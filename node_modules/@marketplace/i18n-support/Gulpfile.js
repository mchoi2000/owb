var gulp = require('gulp'),
    eslint = require('gulp-eslint');

gulp.task('jslint', function jslint () {
    return gulp.src('**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', ['jslint']);
