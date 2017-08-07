const gulp = require('gulp')
const path = require('path')

const autoprefixer = require('autoprefixer')
const babelify = require('babelify')
const browserify = require('browserify')
const browsersync = require('browser-sync').create()
const buffer = require('vinyl-buffer')
const notifier = require('node-notifier')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename');
const rimraf = require('rimraf')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const util = require('gulp-util')
const header = require('gulp-header')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

/* Clean dist folder */
gulp.task('clean', (cb) => {
  rimraf('./dist', cb)
})

gulp.task('header', () => {
  return gulp.src(['dist/**/*.js'])
    .pipe(header(fs.readFileSync('./BANNER', 'utf-8'), require('./package.json')))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', ['clean'], () => {
  gulp.start('build:js', 'build:scss')
})

const showError = (arg) => {
  notifier.notify({
    title  : 'Error',
    message: '' + arg,
    sound  : 'Basso'
  })
  this.emit('end')
}

gulp.task('build:scss', () => {
  return gulp.src(path.join('examples', 'assets', 'style.scss'))
    .pipe(plumber())
    .pipe(sass({
      outputStyle : 'nested',
      precision   : 10,
      includePaths: ['.', 'node_modules'],
      onError     : showError
    }).on('error', function(err) {
      showError(err)
      this.emit('end')
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', 'Explorer >= 9', 'Android >= 4.0', '> 2%']
      })
    ]))
    .pipe(gulp.dest(path.join('examples', 'assets')))
    .pipe(browsersync.stream({ match: '**/*.css' }))
})

gulp.task('build:js', () => {
  return browserify({ entries: path.join('src', 'index.js'), debug: true, standalone: 'Flowly' })
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(plumber())
          .on('error', showError)
        .pipe(source('flowly.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'))
        .pipe(rename('flowly.min.js'))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
          .on('error', showError)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream({ match: path.join('**','*.js') }))
})

gulp.task('watch', ['build'], () => {
  browsersync.init({
    notify: false,
    port  : 9000,
    server: {
      baseDir  : [path.join('examples', 'pages'), path.join('examples', 'assets'), 'dist'],
      directory: true
    }
  })

   gulp.watch(path.join('src', '*.js'), ['build:js'])
   gulp.watch(path.join('examples', 'assets', '*.scss'), ['build:scss'])
   gulp.watch(path.join('examples', 'pages', '*.html'), browsersync.reload)
})

gulp.task('default', ['watch'])
