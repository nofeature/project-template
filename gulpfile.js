'use strict';

var gulp = require('gulp');
var del = require('del');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var server = require('browser-sync');

gulp.task('clear', function () {
  return del('build');
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/*.{woff,woff2}',
    'source/img/**/*.{jpg,svg,png}'
  ],
  {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('css', function () {
  return gulp.src('source/less/index.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('html', function () {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build/'))
    .pipe(server.stream());
});

gulp.task('server', function () {
  server.init({
    server: {
      baseDir: 'build/',
      notify: false,
      open: true,
      cors: true,
      ui: false
    }
  });

  gulp.watch('source/less/**/*.less', gulp.series('css'));
  gulp.watch('source/*.html', gulp.series('html'));
});

gulp.task('build', gulp.series('clear', 'copy', 'css', 'html'));
gulp.task('start', gulp.series('build', 'server'));
