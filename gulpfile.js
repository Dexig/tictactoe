'use strict';
const gulp = require('gulp');
const less = require('gulp-less');
const ts = require('gulp-typescript');

gulp.task('less', () => {
  return gulp.src('./src/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist'));
});

gulp.task('ts', () => {
  return gulp.src('./src/*.ts')
    .pipe(ts())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
  gulp.watch('./src/*.less', gulp.series('less'));
  gulp.watch('./src/*.ts', gulp.series('ts'));
});

gulp.task('default', gulp.series('less', 'ts'));
