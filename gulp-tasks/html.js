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

//Get the webRoot from the environment config
var webRoot = process.env.CFCI_WEB_ROOT;

gulp.task('compile:html', ['clean:server'], function() {
  var data = {
    webRoot: webRoot
  };

  return gulp.src('client/**/*.hbs')
    .pipe(plugins.compileHandlebars(data))
    .pipe(plugins.rename({extname: '.html'}))
    .pipe(gulp.dest('.tmp'));
});