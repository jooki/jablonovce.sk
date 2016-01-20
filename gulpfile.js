'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');

// gulp.task('default', function(){ console.log('Hello gulp')});
/**
 * Execute all tests.
 */
gulp.task('run-tests', function () {
  return gulp.src('test/**/*.js', { read: false })
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('watch-test', function () {
    gulp.watch(['views/**', 'public/**', 'app.js', 'framework/**', 'test/**'], ['test']);
});

/**
 * https://tanzimsaqib.wordpress.com/2015/06/06/continuous-functional-test-automation-with-gulp-mocha-request-cheerio-chai/
 */
