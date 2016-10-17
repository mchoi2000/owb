/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */
'use strict'

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

// Minify images
gulp.task('imagemin', ['clean:dist'], function() {
  return gulp.src('client/public/images/**/*.{png,svg,gif,jpg,jpeg,eot,ttf,woff}')
    .pipe(plugins.imagemin())
    .pipe(plugins.size({title: 'Images'}))
    .pipe(gulp.dest('dist/client/public/images'));
});