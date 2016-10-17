/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

// Lint JavaScript
gulp.task('lint', ['lint:client', 'lint:server', 'lint:tests', 'lint:build']);

// Lint client javascript
gulp.task('lint:client', function() {
  return gulp.src([
      'client/**/*.js',
      '!client/public/bower_components/**/*.js',
      '!client/**/*.spec.js'])
    .pipe(plugins.jshint('client/.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

// Lint server javascript
gulp.task('lint:server', function() {
  return gulp.src(['server/**/*.js', '!server/**/*.spec.js'])
    .pipe(plugins.jshint('server/.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

// Lint server javascript tests
gulp.task('lint:tests', function() {
  return gulp.src([
      'server/**/*.spec.js',
      'client/**/*.spec.js',
      'test/**/*.js',
      '!client/public/bower_components/**/*'])
    .pipe(plugins.jshint('./.jshintrc-spec'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

// Lint build related javascript
gulp.task('lint:build', function() {
  return gulp.src('./*.js')
    .pipe(plugins.jshint('./.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});