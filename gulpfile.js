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


gulp.task('concatJsCreate', function(){
  gulp.src(['src/js/comun/*.js','src/js/searchTracks.js'])
  .pipe(concat('bundleCreate.js'))
  .pipe(uglify()) 
  .pipe(gulp.dest('public/dist/js/'));
});

gulp.task('concatJsMix', function(){
  gulp.src(['src/js/comun/*.js','src/js/mix.js'])
  .pipe(concat('bundleMix.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/dist/js/'));
});


gulp.task('watch', function () {
  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['concatJsCreate', 'concatJsMix']);
});


gulp.task('default', ['watch'], function() {
  
});




