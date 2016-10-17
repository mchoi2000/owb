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
const del = require('del');

// INTERMEDIATE GULP TASKS
// Clean server
gulp.task('clean:server', function() {
  return del(['.tmp'], {dot: true});
});

// Clean dist
gulp.task('clean:dist', ['clean:server'], function() {
  return del(['dist', '!dist/.git'], {dot: true});
});