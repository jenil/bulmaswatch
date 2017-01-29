var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    }
  });

  gulp.watch('*/*.scss', ['sass']);
  gulp.watch('*/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
  return gulp.src('*/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: 'node_modules/bulma'
    }).on('error', sass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
