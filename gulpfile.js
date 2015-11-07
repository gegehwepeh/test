var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
  return gulp.src([
    'public/js/jquery.js',
    'public/js/bootstrap.min.js',
    'public/js/jquery.easing.min.js',
    'public/js/jquery.fittext.js',
    'public/js/wow.min.js',
    'public/js/creative.js'
  ]).pipe(concat('bundle.js'))
    .pipe(gulp.dest('public/js'));
});
gulp.task('build', ['vendor']);
