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
const sourcemaps = require('gulp-sourcemaps');
const ts = plugins.typescript;
const tsProject = ts.createProject('tsconfig.json');
const gulpTypings = plugins.typings;
const tslint = plugins.tslint;

//Typescript compiler
gulp.task('typescript', ['tslint'], function() {
  var tsResult = gulp.src([
      'client/**/*.ts',
      'typings/globals/**/*.d.ts',
      '!node_modules/**/*.ts'
    ])
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('installTypings',function() {
  return gulp.src('./typings.json').pipe(gulpTypings());
});

gulp.task('tslint', function() {
  gulp.src(['client/**/*.ts', '!client/public/bower_components/**/*.ts'])
    .pipe(tslint({
      configuration: 'tslint.json'
    }))
    .pipe(tslint({
      formatter: 'prose'
    }))
    .pipe(tslint.report({
      emitError: true,
      summarizeFailureOutput: true
    }));
});
