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
const runSequence = require('run-sequence');
const karma = require('karma');

// Run unit tests
gulp.task('test', function(cb) {
  runSequence(
    ['lint', 'jscs'],
    'test:server',
    'test:client',
    cb
  );
});

// JavaScript style checker
gulp.task('jscs', function() {
  return gulp.src([
      'client/public/app/**/*.js',
      'client/admin/app/**/*.js',
      'client/common/app/**/*.js',
      'client/provider/app/**/*.js',
      'client/qualification/app/**/*.js',
      'client/register/app/**/*.js',
      'client/review/app/**/*.js',
      'client/translation/app/**/*.js',
      'server/**/*.js',
      './*.js'
    ])
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter('failImmediately'))
    .pipe(plugins.jscsStylish());
});

gulp.task('pre-test', ['env:dev'], function() {
  return gulp.src([
      'server/api/**/*.js',
      'server/components/**/*.js',
      'server/config/auth/*.js',
      'server/config/session/*.js',
      'migrate/*.js',
      'tools/*.js',
      '!server/**/*.spec.js',
      '!migrate/*.spec.js',
      '!tools/*.spec.js'
    ])
    .pipe(plugins.istanbul(
      {
        includeUntested: true
      }
    ))
    .pipe(plugins.istanbul.hookRequire());
});

// Run server side tests
gulp.task('test:server', ['pre-test'], function() {
  //Swallow unhandled promises on tests.  Causes false positive noise.
  require('process').on('unhandledRejection', () => {});

  return gulp.src([
      'server/**/*.spec.js',
      'migrate/*.spec.js',
      'tools/*.spec.js'
    ])
    .pipe(plugins.jasmine({includeStackTrace: true}))
    .on('error', function(error) {
      console.log('Server tests failed');
      console.log(error);
      process.exit(1);
    })
    .pipe(plugins.istanbul.writeReports({
      dir: 'reports/coverage/report-server-lcov'
    }))
    .pipe(plugins.istanbul.enforceThresholds({
      thresholds: {
        global: {
          statements: 100,
          branches: 100,
          lines: 100,
          functions: 100
        }
      }
    }));
});

// Run karma unit tests once for client code
gulp.task('test:client', ['inject:dev'], function() {
  var server = new karma.Server({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  });
  server.start();
});