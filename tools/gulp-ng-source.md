# gulp-ng-source

> An angular source dependency manager designed to work with gulp-inject.  Inject only the javascript sources necessary to run your angular application.

If you build multiple angular applications out of the same project, this gulp plugin will auto-inject only the javascript files necessary to run each application.  `gulp-ng-source` will collect your sources and arrange their dependencies, and then traverse those dependencies to figure out which source files to pass into `gulp-inject`.  `gulp-ng-source` can find and traverse bower components that are included as dependencies.  This plugin will reduce the total amount of javascript delivered to the browser, improving load times.

**Note:** `gulp-ng-source` requires NodeJS v4 or above.

## Usage

**buildDependencies(label)**

Before injecting the angular sources, `gulp-ng-source` will need to build a dependency tree of angular modules.

```javascript
const NgSource = require('gulp-ng-source');
let ngSource = new NgSource();

gulp.src('src/*.js').pipe(ngSource.buildDependencies('app'));
```

`buildDependencies(label)` will apply the label value to all modules found within the provided javascript source. This works much the same way as `gulp-inject`'s name option.  It allows groups of related files to be injected together. So if application code and bower dependencies need to be in separate groups:

```javascript
const merge = require('merge-stream');
const NgSource = require('gulp-ng-source');
let ngSource = new NgSource();

merge([
  gulp.src('src/*.js').pipe(ngSource.buildDependencies('app')),
  gulp.src('bower/**/bower.json').pipe(ngSource.buildDependencies('bower'))
]);
```

If bower.json files are added to the stream, `gulp-ng-source` will look for the source of that bower package in the `main` property of the bower.json file.  `gulp-ng-source` will also automatically try to use the minified version of bower source files; falling back to the non-minified version if it is not found.

**src(rootModule, label)**

Then find the source files to inject

```javascript
const gulp = require('gulp');
const inject = require('gulp-inject');
const NgSource = require('gulp-ng-source');
let ngSource = new NgSource();

gulp.task('inject', ['buildDependencies'], function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = ngSource.src('rootMod', 'app');

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
});
```

The rootModule parameter is where `gulp-ng-source` will start traversing the dependency tree.  And the label parameter will filter modules with the label value applied when the dependencies were built.  If there are multiple labels:

```javascript
const gulp = require('gulp');
const inject = require('gulp-inject');
const NgSource = require('gulp-ng-source');
let ngSource = new NgSource();

gulp.task('inject', ['buildDependencies'], function () {
  return gulp.src('./src/index.html')
    .pipe(inject(ngSource.src('rootMod', 'app')))
    .pipe(inject(ngSource.src('rootMod', 'bower')))
    .pipe(gulp.dest('./src'));
});
```
