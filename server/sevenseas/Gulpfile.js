"use strict";

var gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    jsonlint = require("gulp-jsonlint");

gulp.task("jslint", ["jsonlint"], function jslint () {
    return gulp.src(["**/*.js", "!coverage/**", "!node_modules/**", "!src_tool/**"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("jsonlint", function jsonlintfx () {
    gulp.src(["*.json", "!coverage/**", "!node_modules/**", "!src_tool/**"])
        .pipe(jsonlint())
        .pipe(jsonlint.reporter())
        .pipe(jsonlint.failOnError());
});

gulp.task("test", ["jslint", "jsonlint"]);
