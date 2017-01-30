var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var cp = require('child_process');

gulp.task('jekyll-build', function(done) {
  browserSync.notify('Jekyll build');
  cp.exec('bundle exec jekyll build --config _config.yml,_config.local.yml', function(err, stdout, stderr) {
    console.log(stdout);
  }).on('exit', function(code) {
        done(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
    });
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});


gulp.task('serve', ['sass', 'jekyll-build'], function() {
  browserSync.init({
    server: {
      baseDir: '_site'
    }
  });

  gulp.watch(['*/*.scss', '!_site/**'], ['sass']).on('change', function(event) {
    console.log('SCSS :File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  gulp.watch(['**/*.{html,md}', '!_site/**'], ['jekyll-rebuild']).on('change', function(event) {
    console.log('HTML :File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
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
    .pipe(gulp.dest('_site/'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['serve']);
