/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */
'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const fs = require('fs');
const merge = require('merge-stream');
const path = require('path');
const shell = require('gulp-shell');
const wiredep = require('wiredep').stream;
const lobster = require('@marketplace/lobster');
const ts = plugins.typescript;
const NgSource = require('../tools/gulp-ng-source');
const ngSource = new NgSource();

var webRoot = process.env.CFCI_WEB_ROOT;

const ngApps = [
  'public',
  'register',
  'review'
];

//Hack Alert: gulp-inject 4.0.0 borked their indentation/newline handling
const regs = {
  '.js': /^(\s*)<!--\s*inject(?::\w*)?:js*\s*-->/m,
  '.css': /^(\s*)<!--\s*inject(?::\w*)?:css*\s*-->/m
};

const transforms = {
  '.js': plugins.inject.transform.html.js,
  '.css': plugins.inject.transform.html.css
};

//Run express in dev mode
gulp.task('express:dev', ['inject:dev'], function(cb) {

  var server =  plugins.liveServer('server/app.js', undefined, {
    port: 35729,
    pfx: fs.readFileSync('server/certs/localhost.pfx')
  });
  server.start();

  //Reload resource when client side files change
  gulp.watch([
      '{.tmp,client}/**/*.html',
      '{.tmp,client}/**/*.css',
      '{.tmp,client}/**/*.js',
      'client/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg,eot,ttf,woff}'],
    function(event) {
      server.notify(event);
    });

  //Recompile css files when change in sass file
  gulp.watch(['client/{public,common,review}/app/**/*.{sass,scss,hbs}'], ['sass:watch']);

  gulp.watch(['client/**/*.ts'], ['typescript']);

  //Restart server when server side code changes
  gulp.watch(['server/**/*.js'], function() {
    server.start.apply(server);
  });
  cb();
});

gulp.task('inject:dev', ['build:dependencies', 'sass', 'compile:html'], function() {
  return merge(ngApps.map(app => injectNgApp(app)));
});

function injectWrapper(filepath, file, index, length, targetFile) {
  let ext = path.extname(filepath);
  let indent = regs[ext].exec(String(targetFile.contents))[1];

  return indent + transforms[ext].apply({}, arguments) + '\n';
}

function injectNgApp(appName) {
  return gulp.src('.tmp/' + appName + '/index.html', {base: '.tmp'})
    .pipe(plugins.inject(ngSource.src(appName, 'app'), {
      addRootSlash: false,
      ignorePath: ['client/public/', '.tmp/public', 'client/', '.tmp/'],
      removeTags: true,
      starttag: '<!-- inject:app:js -->',
      transform: injectWrapper
    }))
    .pipe(plugins.inject(ngSource.src(appName, 'bower'), {
      addRootSlash: false,
      ignorePath: 'client/public/',
      removeTags: true,
      starttag: '<!-- inject:bower:js -->',
      transform: injectWrapper
    }))
    .pipe(plugins.inject(gulp.src('.tmp/public/app/app.css'), {
      addRootSlash: false,
      ignorePath: '.tmp/public/',
      removeTags: true,
      transform: injectWrapper
    }))
    .pipe(wiredep({
      directory: 'client/public/bower_components',
      ignorePath: '../../client/public/'
    }))
    .pipe(gulp.dest('.tmp'));
}

// Cache module dependencies for ng-js injection
function buildDependencies() {
  let appSrc = gulp.src([
    'client/**/*.js',
    '.tmp/**/*.js',
    '!.tmp/**/*.spec.js',
    '!client/**/*.spec.js',
    '!client/public/bower_components/**/*.js'
  ]).pipe(ngSource.buildDependencies('app'));

  let bowerSrc = gulp.src('client/public/bower_components/**/bower.json')
    .pipe(ngSource.buildDependencies('bower'));

  return merge([appSrc, bowerSrc]);
}
gulp.task('build:dependencies', ['clean:server', 'typescript'], buildDependencies);