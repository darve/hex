'use strict';

var gulp            = require('gulp'),

    // Tool for deleting files and folders
    del             = require('del'),

    // SASS compiler
    sass            = require('gulp-sass'),

    // Used for reading tags in HTML and replacing them with gulp output
    processhtml     = require('gulp-processhtml'),

    // Used to automatically add in css browser prefixes so we can just write lovely CSS3 without worrying
    autoprefixer    = require('gulp-autoprefixer'),

    // Used to minify our compiled CSS
    mincss          = require('gulp-minify-css'),

    // Used to combine multiple files into one
    concat          = require('gulp-concat'),

    // Used for minifying javascript
    uglify          = require('gulp-uglify'),

    // Outputs the filesize of the gulp output
    size            = require('gulp-filesize'),

    // Used for linting javascript and checking for issues
    jshint          = require('gulp-jshint'),

    // Used for modular javascript development
    browserify      = require('browserify'),

    // Used for generating sourcemaps of minified javascript files.
    sourcemaps      = require('gulp-sourcemaps'),

    // I'll be honest, I have no idea what this does.
    gutil           = require('gulp-util'),

    // Test-runner
    tape            = require('gulp-tape'),

    // Reporter used by the test runner
    tap             = require('tap-colorize'),

    // These are used to perform tasks differently depending on the args
    argv            = require('yargs').argv,
    gulpif          = require('gulp-if'),
    rename          = require('gulp-rename');


/**
 * Polyfill required so the autoprefixer doesn't break.
 */
require('es6-promise').polyfill();


/**
 * Bundle and minify all of the source script files
 */
gulp.task('scripts', ['jshint'], function () {

    return browserify({ entries: './src/scripts/app.js', debug: true })
        .bundle()
        .pipe(source('hex.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(gulpif(argv.production, uglify()))
            .pipe(gulpif(argv.production, rename({suffix: '.min'})))
            .pipe(gulpif(argv.production, sourcemaps.write('./')))
            .on('error', gutil.log)
            .pipe(gulp.dest('./app/assets/scripts'));
});


/**
 * This task is used to verify that I am not taking crazy pills
 * and that my javascript is in fact perfectly formed.
 */
gulp.task('jshint', function() {

    return gulp.src('./src/scripts/**/*.js')
        .pipe(jshint(require('./config/jshint.js')))
        .pipe(jshint.reporter('default'))
});


/**
 * This task compiles, nay transforms my sass into a hard
 * shiny peg of truth (CSS). Compiles scss files for dev.
 * Minifies if this task is run with the productiona argument.
 */
gulp.task('sass', function() {

    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(argv.production, mincss()))
        .pipe(gulpif(argv.production, rename({suffix: '.min'})))
        .pipe(gulp.dest('./app/assets/css'));
});


/**
 * Run the TAPE tests
 */
gulp.task('test', function() {

    return gulp.src('./tests/*.js')
        .pipe(tape({
            reporter: tap()
        }));
});


/**
 * This task is used to lint and minify everything and stick
 * it in a folder called 'prod'.
 */
gulp.task('build', ['jshint', 'test', 'sass', 'scripts']);


/**
 *  Watch our source files and trigger a build when they change
 */
gulp.task('watch', function() {

    gulp.watch([
        './src/scripts/**/*.js',
        './src/scss/**',
    ], ['build']);
});
