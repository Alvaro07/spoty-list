var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    concatCss = require('gulp-concat-css');

gulp.task('sass', function () {
  return gulp.src('src/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('public/dist/styles/'));
});

gulp.task('watch', function () { 
  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['concatJs']);
});



gulp.task('concatJs', function(){
  gulp.src('src/js/**/*.js')
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/dist/js/'));
});



gulp.task('default', ['watch'], function() {
  
});




