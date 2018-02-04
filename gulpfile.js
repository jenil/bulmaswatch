var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var cp = require('child_process');
var del = require('del');
var data = require('gulp-data');
var pluck = require('gulp-pluck');
var frontMatter = require('gulp-front-matter');

const pkg = require('./package.json');
const VERSION = pkg.version;
const HOME = pkg.homepage;
const CDN = 'https://unpkg.com/bulmaswatch';
var changedTheme = '';

gulp.task('clean', function() {
    return del(['*/*.css', '*/*.css.map']);
});

gulp.task('jekyll-build', function(done) {
    browserSync.notify('Jekyll build');
    cp.exec('bundle exec jekyll build --config _config.yml,_config.local.yml', function(err, stdout, stderr) {
        console.log(stdout);
    }).on('exit', function(code) {
        done(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
    });
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});


gulp.task('serve', ['sass:dev', 'jekyll-build'], function() {
    browserSync.init({
        server: {
            baseDir: '_site'
        },
        ghostMode: {
            clicks: false,
            forms: false
        },
        reloadDelay: 500
    });

    gulp.watch(['*/*.scss', '!_site/**'], ['sass:dev']).on('change', function(event) {
        console.log('SCSS: File ' + event.path + ' was ' + event.type + ', running tasks...');
        changedTheme = event.path.split('/')[event.path.split('/').length - 2]
    });
    gulp.watch(['**/*.{html,md}', '!_site/**'], ['jekyll-rebuild']).on('change', function(event) {
        console.log('HTML: File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('sass:dev', function() {
    console.log('Building', changedTheme);
    return gulp.src(changedTheme ? `${changedTheme}/*.scss` : '*/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: 'node_modules/bulma'
        }).on('error', sass.logError))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(changedTheme ? `_site/${changedTheme}` : '_site/'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(gulp.dest(changedTheme ? `_site/${changedTheme}` : '.'));
});

gulp.task('sass', ['clean'], function() {
    return gulp.src('*/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: 'node_modules/bulma'
        }).on('error', sass.logError))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});

gulp.task('api', function() {
    var API = {
        version: VERSION,
        themes: []
    };

    del(['api/*']);

    return gulp.src('./_themes/*.md')
        .pipe(frontMatter({
            property: 'meta'
        }))
        .pipe(data(function(file) {
            delete file.meta.order;
            file.meta.preview = HOME + '/' + file.meta.name.toLowerCase() + '/';
            file.meta.thumb = HOME + '/thumb/?' + file.meta.name.toLowerCase();
            file.meta.css = CDN + '@' + VERSION + '/' + file.meta.name.toLowerCase() + '/bulmaswatch.min.css';
            file.meta.scss = CDN + '@' + VERSION + '/' + file.meta.name.toLowerCase() + '/bulmaswatch.scss';
            file.meta.scssVariables = CDN + '@' + VERSION + '/' + file.meta.name.toLowerCase() + '/_variables.scss';
        }))
        .pipe(pluck('meta', 'themes.json'))
        .pipe(data(function(file) {
            API.themes = file.meta;
            file.contents = new Buffer(JSON.stringify(API));
        }))
        .pipe(gulp.dest('api'));
});

gulp.task('default', ['serve']);
