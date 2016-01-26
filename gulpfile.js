'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var exec = require('child_process').exec;

// gulp.task('default', function(){ console.log('Hello gulp')});
/**
 * Execute all tests.
 */
gulp.task('run-tests', function () {
    return gulp.src('test/**/test*.js', { read: false })
        .pipe(mocha({ require: 'should', reporter: 'spec' }));
});

// Dokumentacia k exec 
// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
gulp.task('test-tests', function (callback) {
    exec('mocha', function (err, stdout, stderr) {
        if (err) {
            console.error(err);
        }
        console.log(stdout);
        console.log(stderr);
    });
});

gulp.task('watch-test', function () {
    gulp.watch(['views/**', 'public/**', 'app.js', 'test/**'], ['test']);
});


gulp.task('default', function(){
    
    // Dokumentacia k exec 
    // https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
    gulp.task('test-tests', function (callback) {
        exec('mocha', function (err, stdout, stderr) {
            if (err) {
                console.error(err);
            }
            console.log(stdout);
            console.log(stderr);
        });
    });
});
/**
 * https://tanzimsaqib.wordpress.com/2015/06/06/continuous-functional-test-automation-with-gulp-mocha-request-cheerio-chai/
 */
