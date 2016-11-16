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
const nodeSass = require('node-sass');
var webRoot = process.env.CFCI_WEB_ROOT;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23'
];
gulp.task('sass:watch', sass);
gulp.task('sass', ['clean:server'], sass);

function sass() {
  return gulp.src('client/public/app/app.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      precision: 10,
      includePaths: [
        'client/public/app',
        'client/public/components/app',
        'client/common/app',
        'client/review/app/cmm',
        'client/translation/app'
      ],
      onError: console.error.bind(console, 'Sass error:'),
      functions: {
        getWebRoot: function() {
          return nodeSass.types.String('"' + webRoot + '"');
        }
      }
    }))
    .pipe(plugins.autoprefixer({browers: AUTOPREFIXER_BROWSERS}))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('.tmp/public/app'));
}