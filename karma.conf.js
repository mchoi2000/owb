// Karma configuration
// Generated on Mon Jun 22 2015 12:05:26 GMT-0700 (PDT)
'use strict';

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'client/public/bower_components/angular/angular.js',
      'client/public/bower_components/angular-route/angular-route.js',
      'client/public/bower_components/angular-resource/angular-resource.js',
      'client/public/bower_components/angular-aria/angular-aria.js',
      'client/public/bower_components/angular-mocks/angular-mocks.js',
      'client/public/bower_components/angular-sanitize/angular-sanitize.js',
      'client/public/bower_components/angular-animate/angular-animate.js',
      'client/public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/public/bower_components/validator-js/validator.js',
      'client/public/bower_components/phoneformat/dist/phone-format.js',
      'client/public/bower_components/ng-focus-if/focusIf.js',
      'client/public/bower_components/angular-cookies/angular-cookies.js',
      'client/public/bower_components/angular-feature-flags/dist/featureFlags.js',
      'client/public/bower_components/ng-file-upload/ng-file-upload.js',
      'client/public/bower_components/angular-toastr/dist/angular-toastr.js',
      'client/public/bower_components/angular-toastr/dist/angular-toastr.tpls.js',

      // Load Module Definitions
      'client/public/components/app/header/header.js',
      'client/public/components/app/title/title.js',
      'client/common/app/error/error.js',
      'client/common/app/data/data.js',
      'client/common/app/nav/nav.js',
      'client/common/app/search/search.js',
      'client/common/app/search/search.service.js',
      'client/common/app/review/review.js',
      'client/common/app/topmatter/topmatter.js',
      'client/common/app/dashboard/dashboard.js',
      '.tmp/common/app/input/input.js',
      '.tmp/common/app/spinner/spinner.js',
      '.tmp/common/app/spinner/loader.component.js',
      'client/review/app/cmm/cmmReview.js',
      'client/review/app/cmm/dashboard/cmmDashboard.js',
      'client/review/app/cmm/directory/cmmDirectory.js',
      'client/review/app/offering/offeringReview.directive.js',
      '.tmp/common/app/**/*.js',
      'client/public/components/**/*.js',
      'client/public/app/**/*.js',
      'client/common/**/*.js',
      'client/register/**/*.js',
      'client/review/**/*.js',

      //Directive template files
      'client/public/components/app/loading/*.html',
      'client/common/app/upload/*.html',
      'client/common/app/search/*.html',
      'client/common/app/input/*.html',
      'client/common/app/spinner/*.html',
      'client/common/app/error/*.html',
      'client/common/app/blacklistPicker/*.html',
      'client/common/app/dragDropUpload/*.html',
      'client/common/app/review/*.html',
      'client/common/app/dashboard/**/*.html',
      'client/common/app/nav/*.html',
      'client/common/app/topMatter/*.html',
      'client/review/app/offering/*.html'
    ],

    // list of files to exclude
    exclude: [
      'test/protractor-conf.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // jscs:disable maximumLineLength
    preprocessors: {
      'client/{common,public,register,review}/{app,components}/**/!(*.spec).js': ['coverage'],
      '.tmp/{common}/app/**/!(*.spec).js': ['coverage'],
      'client/{public/components/app/loading/*.html,common/app/upload/*.html,common/app/urlInputField/*.html,common/app/search/*.html,common/app/error/*.html,common/app/blacklistPicker/*.html,common/app/dragDropUpload/*.html,common/app/dashboard/**/*.html,common/app/review/*.html,common/app/input/*.html,common/app/spinner/*.html,common/app/nav/*.html,common/app/topMatter/*.html,review/app/offering/*.html,review/app/commerce/*.html}': ['ng-html2js']
    },

    //Removes the prefix on the template location, making testing of directives possible
    ngHtml2JsPreprocessor: {
      stripPrefix: '(?:client/public/|client/)'
    },

    coverageReporter: {
      dir: 'reports/coverage',
      check: {
        global: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100
        }
      },
      reporters: [
        {
          type: 'lcov', subdir: 'report-client-lcov'
        },
        {
          type: 'json', subdir: 'report-client-lcov'
        },
        {
          type: 'text'
        }
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
