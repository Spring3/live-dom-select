const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('compress', function () {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename('live-dom-select.min.js'))
    .pipe(gulp.dest('dist'));
});
