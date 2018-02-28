import gulp from 'gulp';
import mocha from 'gulp-mocha';
import './build';

const testGlob = [
  'build/test/**/*.test.js',
];

export function test () {
  return gulp.src(testGlob)
    .pipe(mocha());
};

gulp.task('test', gulp.series('build', test));
