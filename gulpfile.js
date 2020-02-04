'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var server = require('browser-sync');
var del = require('del');

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
  return gulp.src('source/scss/index.scss')
    .pipe(plumber())
    .pipe(sass())
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

gulp.task('js', function () {
  return gulp.src('source/js/*.js')
    .pipe(gulp.dest('build/js'))
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

  gulp.watch('source/sass/**/*.sass', gulp.series('css'));
  gulp.watch('source/*.html', gulp.series('html'));
  gulp.watch('source/js/**/*.js', gulp.series('js'));
});

gulp.task('build', gulp.series('clear', 'copy', 'css', 'html', 'js'));
gulp.task('start', gulp.series('build', 'server'));
