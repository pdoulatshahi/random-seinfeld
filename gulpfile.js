const BatchStream = require('batch-stream2');
const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-minify-css');
const mainBowerFiles = require('main-bower-files');
const livereload = require('gulp-livereload');
const autoprefixer = require('gulp-autoprefixer');
const include = require('gulp-include');
const concat = require('gulp-concat');
const browserify = require('gulp-browserify');
const gulpFilter = require('gulp-filter');
const watch = require('gulp-watch');
const rename = require('gulp-rename');

var src = {
  scss: ['assets/scss/**/*.scss'],
  js: ['assets/js/**/*.js'],
  bower: ['bower.json', '.bowerrc']
}

var publishdir = 'public'
var dist = {
  all: [publishdir + '/**/*'],
  css: publishdir + '/css/',
  js: publishdir + '/js/',
  vendor: publishdir + '/vendor/'
}

gulp.task('bower', function() {
  var jsFilter = gulpFilter('**/*.js', {restore: true})
  var cssFilter = gulpFilter('**/*.css', {restore: true})
  return gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(dist.js))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(dist.css))
    .pipe(cssFilter.restore)
    .pipe(rename(function(path) {
      if (~path.dirname.indexOf('fonts')) {
        path.dirname = '/fonts'
      }
    }))
    .pipe(gulp.dest(dist.vendor))
})

function buildCSS() {
  return gulp.src(src.scss)
    .pipe(sass())
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(dist.css))
}

function buildJS() {
  return gulp.src(src.js)
    .pipe(include())
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dist.js))
}

gulp.task('css', buildCSS)
gulp.task('js', buildJS)

gulp.task('watch', function() {
  gulp.watch(src.bower, ['bower'])
  watch({ glob: src.styles, name: 'app.css' }, buildCSS)
  watch({ glob: src.scripts, name: 'app.js' }, buildJS)
})

gulp.task('livereload', ['bower', 'css', 'js', 'watch'], function() {
  var server = livereload()
  var batch = new BatchStream({ timeout: 100 })
  gulp.watch(dist.all).on('change', function change(file) {
    // clear directories
    var urlpath = file.path.replace(__dirname + '/' + publishdir, '')
    // also clear the tailing index.html
    urlpath = urlpath.replace('/index.html', '/')
    batch.write(urlpath)
  })
  batch.on('data', function(files) {
    server.changed(files.join(','))
  })
})
gulp.task('compress-css', ['css'], function() {
  return gulp.src(dist.css)
    .pipe(cssmin())
    .pipe(gulp.dest(dist.css))
})
gulp.task('compress-js', ['js'], function() {
  return gulp.src(dist.js)
    .pipe(uglify())
    .pipe(gulp.dest(dist.js))
})
gulp.task('compress', ['compress-css', 'compress-js'])

gulp.task('default', ['bower', 'css', 'js', 'livereload']) // development
gulp.task('build', ['bower', 'compress']) // build for production
