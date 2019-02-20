const gulp = require('gulp'),
  concat = require('gulp-concat'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  del = require('del'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  terser = require('gulp-terser'),
  imagemin = require('gulp-imagemin');

function styleSass() {
  return gulp
    .src('./src/sass/**/*.sass')
    .pipe(
      sass({
        includePaths: require('node-normalize-scss').includePaths
      }).on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: [
          '> 0.1%',
          'firefox >= 4',
          'safari 7',
          'safari 8',
          'IE 8',
          'IE 9',
          'IE 10',
          'IE 11'
        ],
        cascade: true,
        grid: 'autoplace'
      })
    )
    .pipe(gulp.dest('./src/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src('./src/js/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./build/js'));
}

function reimg() {
  return gulp
    .src('./src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img/'));
}

function style() {
  return gulp
    .src('./src/css/**/*.css')
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest('./build/css'));
}

function fonts() {
  return gulp.src('./src/fonts/**/*.ttf').pipe(gulp.dest('./build/fonts'));
}

function audio() {
  return gulp.src('./src/audio/**/*').pipe(gulp.dest('./build/audio'));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './src'
    }
  });
  gulp.watch('src/sass/**/*.sass', styleSass);
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
  gulp.watch('src/*.html').on('change', browserSync.reload);
}

function htmlBuild() {
  return gulp.src('./src/*.html').pipe(gulp.dest('./build'));
}

function clean() {
  return del(['./build/*']);
}

gulp.task('style', style);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('styleSass', styleSass);
gulp.task('htmlBuild', htmlBuild);
gulp.task('reimg', reimg);
gulp.task('fonts', fonts);
gulp.task('audio', audio);

gulp.task(
  'build',
  gulp.series(clean, scripts, gulp.parallel(style, reimg, htmlBuild, fonts, audio))
);
