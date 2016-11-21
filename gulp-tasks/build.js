/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */
'use strict';

const fs = require('fs');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const NgSource = require('../tools/gulp-ng-source');
const ngSource = new NgSource();
const merge = require('merge-stream');
const wiredep = require('wiredep').stream;
const path = require('path');

const pathReg = /^.*\/client\/(?:public\/)?/;

//Hack Alert: gulp-inject 4.0.0 borked their indentation/newline handling
const regs = {
  '.js': /^(\s*)<!--\s*inject(?::\w*)?:js*\s*-->/m,
  '.css': /^(\s*)<!--\s*inject(?::\w*)?:css*\s*-->/m
};

const transforms = {
  '.js': plugins.inject.transform.html.js,
  '.css': plugins.inject.transform.html.css
};

const ngApps = [
  'public',
  'register',
  'review'
];

const commonMods = [
  'collab',
  'upload',
  'header',
  'loading',
  'title',
  'calendar',
  'search',
  'error',
  'blacklistPicker',
  'urlInputField',
  'dragDropUpload',
  'httpErrorIntercept',
  'review',
  'input',
  'collab',
  'spinner',
  'dashboard',
  'nav',
  'topmatter'
];

// Build distribution
gulp.task('ref', [
  'inject:build',
  'imagemin',
  'copy:client',
  'copy:server',
  'build:package',
  'copy:deployment',
  'copy:npmrc'
], function() {
  return gulp.src('.tmp/**/*.html', {base: '.tmp'})
    .pipe(plugins.useref())
    .pipe(plugins.if('*.css', plugins.cssnano({zindex: false})))
    .pipe(plugins.if('*.js', plugins.ngAnnotate()))
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(gulp.dest('dist/client'));
});

gulp.task('rev', ['ref'], function() {
  return gulp.src(['dist/client/**/*.js', 'dist/client/**/*.css'])
    .pipe(plugins.rev())
    .pipe(gulp.dest('dist/client'))
    .pipe(plugins.revNapkin())
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('dist/client'));
});

gulp.task('build', ['rev'], function() {
  return gulp.src('dist/client/**/*.html')
    .pipe(plugins.revReplace({
      manifest: gulp.src('dist/client/rev-manifest.json'),
      modifyReved: function(filename) {
        return filename.replace('public/', '');
      }
    }))
    .pipe(gulp.dest('dist/client'));
});

//Build the package.json file for bluemix deployment
gulp.task('build:package', ['clean:dist'], function(cb) {
  fs.mkdir('dist', function() {
    fs.readFile('./package.json', function(err, data) {
      if (err) {
        throw err;
      }

      var json = JSON.parse(data);
      delete json.devDependencies;
      json.scripts = {start: 'node ./server/app.js'};

      fs.writeFile('./dist/package.json', JSON.stringify(json, null, 2), function(err) {
        if (err) {
          throw err;
        }
        cb();
      });
    });
  });
});


// Inject js and css reference into index.html
// inject:build includes cached angular html templates
gulp.task('inject:build', ['build:dist:dependencies', 'sass', 'compile:html'], function() {
  return merge(ngApps.map(app => injectNgApp(app)));
});

gulp.task('build:dist:dependencies', ['ngtemplates'], buildDependencies);

gulp.task('ngtemplates', ['clean:server', 'typescript'], function() {
  return merge(ngApps.map(app => ngtemplates(app)))
  .add(commonMods.map(mod => commonTemplates(mod)));
});

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

// Cache angular html templates
function ngtemplates(mod) {
  return gulp.src('client/' + mod + '/app/**/*.html')
    .pipe(plugins.htmlmin({
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(plugins.ngTemplates({
      filename: mod + 'Templates.js',
      module: mod,
      standalone: false,
      path: function(path, base) {
        path = path.replace(base, '');
        if (mod === 'public') {
          return 'app/' + path;
        }

        return mod + '/app/' + path;
      }
    }))
    .pipe(gulp.dest('.tmp/' + mod + '/app'));
}

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

function commonTemplates(mod) {
  return gulp.src([
      'client/public/components/app/' + mod + '/*.html',
      'client/common/app/' + mod + '/**/*.html'
    ])
    .pipe(plugins.htmlmin({
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(plugins.ngTemplates({
      filename: mod + 'Templates.js',
      module: 'common.' + mod,
      standalone: false,
      path: function(path) {
        return path.replace(pathReg,'');
      }
    }))
    .pipe(gulp.dest('.tmp/common'));
}