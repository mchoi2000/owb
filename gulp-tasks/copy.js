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
const merge = require('merge-stream');

// Copy client files to dist/public
gulp.task('copy:client', ['clean:dist'], function() {
  var client = gulp.src(['client/public/*.{ico,txt,html}'], {
      base: 'client/public', dot: true})
    .pipe(plugins.size({title: 'Copy Client Files'}))
    .pipe(gulp.dest('dist/client/public'));

  var akamai = gulp.src(['client/public/bower_components/site-test-files/*.html'], {
      base: 'client/public/bower_components/site-test-files', dot: true})
    .pipe(plugins.size({title: 'Copy Akamai Files'}))
    .pipe(gulp.dest('dist/client/public/akamai'));

  return merge(client, akamai);
});

// Copy server files to dist/server
gulp.task('copy:server', ['clean:dist'], function() {
  return gulp.src([
      'server/**/*',
      '!server/**/*.spec.js',
      '!server/.jshintrc'
    ], {base: './', dot: true})
    .pipe(plugins.size({title: 'Copy Server Files'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy:deployment', ['clean:dist'], function() {
  return gulp.src('./manifest-prod.yml')
    .pipe(plugins.rename('manifest.yml'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy:npmrc', ['clean:dist'], function() {
  return gulp.src('./.npmrc')
    .pipe(gulp.dest('dist'));
});