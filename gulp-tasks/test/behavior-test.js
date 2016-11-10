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
const argv = require('yargs').argv;

var mockIdaas;
var mockV18;
var mockSendgrid;

// Run server with test config
gulp.task('serve:test', ['build'], function(cb) {
  plugins.liveServer('dist/server/app.js',
    {
      env: {
        NODE_ENV: 'test',
        NODE_TLS_REJECT_UNAUTHORIZED: '0'
      }
    }, false).start();

  cb();
});

// Run bevahior tests
// Note: Requires 'serve:test' and a local pouch/couch server to be running
gulp.task('test:behavior', function(cb) {
  runSequence('serve:mockExternals', 'cucumber', 'kill:mockExternals', function(err) {
    if (err) {
      //hard exit
      return process.exit(1);
    }

    cb();
  });
});

gulp.task('serve:mockExternals', function(cb) {
  mockIdaas = plugins.liveServer('test/mockExternals/mockIdaas.js', {}, false);
  mockV18 = plugins.liveServer('test/mockExternals/mockV18.js', {}, false);
  mockSendgrid = plugins.liveServer('test/mockExternals/mockSendgrid.js', {}, false);

  mockIdaas.start();
  mockV18.start();
  mockSendgrid.start();

  setTimeout(cb, 2000);
});

// Note: kill:mockExternals can only be run in the same process that
//       serve mockExternals runs in.
gulp.task('kill:mockExternals', function(cb) {
  mockIdaas.stop()
    .then(() => mockV18.stop())
    .then(() => mockSendgrid.stop())
    .then(cb);
});

gulp.task('cucumber', function() {
  return gulp.src('test/features/*.feature')
    .pipe(plugins.cucumber({
      steps: 'test/features/steps/*.js',
      support: 'test/features/support/*.js',
      tags: argv.tags
    }));
});
