// Modules
var gulp = require('gulp'),
    typescript = require('gulp-typescript'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    changed = require('gulp-changed'),
    cssmin = require('gulp-minify-css'),
    htmlmin = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect');

// Directories
var sassSrc = './styles/scss/**/*.scss',
    sassDest = './styles/css',
    cssSrc = './styles/css/**/*.css',
    cssDest = './build/styles/',
    tsSrc = './scripts/ts/**/*.ts',
    tsDest = './scripts/js/',
    jshintSrc = './scripts/js/*.js',
    scriptSrc = ['./scripts/vendor/**/*.js', './scripts/js/**/*.js'],
    scriptDest = './build/scripts/',
    htmlSrc = './html/*.html',
    htmlDest = './build',
    imgSrc = './assets/images/**/*',
    imgDest = './build/images',
    reloadSrc = [cssDest, scriptDest, './build/*html'];


var sassTranspileOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var devServerOptions = {
    root: 'build',
    livereload: true,
    port: 8080
};

gulp.task('sass', function() {
    return gulp
        .src(sassSrc)
        .pipe(sourcemaps.init())
        .pipe(sass(sassTranspileOptions).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(sassDest));
});

gulp.task('css', function() {
    return gulp.src(cssSrc)
        .pipe(concat('styles.css'))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cssmin())
        .pipe(gulp.dest(cssDest));
});

gulp.task('typescript', function () {
    return gulp.src(tsSrc)
        .pipe(typescript({
            noImplicitAny: true,
            out: 'typescript.js'
        }))
        .pipe(gulp.dest(tsDest));
});

gulp.task('scripts', function() {
    return gulp.src(scriptSrc)
        .pipe(concat('bundle.js'))
        .pipe(stripdebug())
        .pipe(uglify())
        .pipe(gulp.dest(scriptDest));
});

gulp.task('htmlpage', function() {
    return gulp.src(htmlSrc)
        .pipe(changed(htmlDest))
        .pipe(htmlmin())
        .pipe(gulp.dest(htmlDest));
});

gulp.task('imagemin', function() {
    return gulp.src(imgSrc)
        .pipe(changed(imgDest))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDest));
});

gulp.task('jshint', function() {
    return gulp.src(jshintSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('webserver', function() {
    connect.server(devServerOptions);
});

gulp.task('watch', function() {
    gulp.watch(sassSrc, ['sass']);
    gulp.watch(cssSrc, ['css', 'reload']);
    gulp.watch(tsSrc, ['typescript']);
    gulp.watch(scriptSrc, ['scripts', 'reload']);
    gulp.watch(htmlSrc, ['htmlpage', 'reload']);
    gulp.watch(jshintSrc, ['jshint']);
});

gulp.task('serve', ['webserver', 'watch']);

gulp.task('reload', function() {
    gulp.src(reloadSrc)
        .pipe(connect.reload());
});

gulp.task('build', ['sass', 'css', 'typescript', 'scripts', 'htmlpage'], function() {});

gulp.task('default', ['serve'], function() {});
