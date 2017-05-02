const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');

gulp.task('build-css', function() {
  return gulp.src(['source/scss/materialize.scss', 'source/scss/style.scss', 'source/scss/youtube.scss'])
    .pipe(sass())
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('start', function () {
  nodemon({
    script: 'app/server.js',
    tasks: ['build-css'],
    env: { 'NODE_ENV': 'development' }
  })
})
