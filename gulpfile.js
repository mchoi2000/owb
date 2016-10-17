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
const browserSync = require('browser-sync').create();
const fs = require('fs');

// If running gulp locally, load local env variables
try {
  if (fs.statSync('./server/config/local.env.json')) {
    plugins.env({file: './server/config/local.env.json'});
  }
} catch (ex) {
  console.error('Failed to load the local env');
}

//Get the webRoot from the environment config
var webRoot = process.env.CFCI_WEB_ROOT;

var requireDir = require('require-dir');
requireDir('./gulp-tasks');

// Start server in development mode with browser-sync
gulp.task('serve', ['express:dev'], function() {
  browserSync.init({
    proxy: 'https://localhost:9001',
    startPath: webRoot,
    https: {
      pfx: 'server/certs/localhost.pfx'
    }
  });
});

// Run distribution version of client
gulp.task('serve:dist', ['build'], function(cb) {
  plugins.liveServer('dist/server/app.js', undefined, {
    port: 35729,
    pfx: fs.readFileSync('server/certs/localhost.pfx')
  }).start();

  browserSync.init({
    proxy: 'https://localhost:9001',
    startPath: webRoot,
    https: {
      pfx: 'server/certs/localhost.pfx'
    }
  });
  cb();
});

// Set test environment
gulp.task('env:dev', function(cb) {
  process.env.NODE_ENV = 'development';
  cb();
});
