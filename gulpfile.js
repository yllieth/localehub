var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// *.scss compilation
var foundationPaths = [
  'node_modules/foundation-sites/scss',
  'node_modules/motion-ui/src'
];

gulp.task('sass.foundation', function(){
  return gulp.src('styles/foundation/foundation_core.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: foundationPaths,
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('styles/foundation'));
});

gulp.task('sass.app', function(){
  return gulp.src('styles/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: foundationPaths,
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('styles'));
});

gulp.task('sass.components', function(){
  return gulp.src('app/**/*.scss')
    .pipe(sass({
      includePaths: foundationPaths
    }).on('error', sass.logError))
    .pipe(gulp.dest('app'));  // compile in-place
});

gulp.task('sass', ['sass.foundation', 'sass.app', 'sass.components']);



// Gulp watcher
gulp.task('watch', function(){
  gulp.watch('styles/foundation/*.scss', ['sass.foundation']);
  gulp.watch('styles/*.scss', ['sass.app']);
  gulp.watch('app/**/*.scss', ['sass.components']);
});