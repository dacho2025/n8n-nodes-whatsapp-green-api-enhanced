const gulp = require('gulp');
const rename = require('gulp-rename');

// Build icons task
gulp.task('build:icons', function() {
  return gulp.src('icons/**/*.svg')
    .pipe(rename(function(path) {
      // Keep the same structure in dist
      path.dirname = path.dirname.replace(/^icons/, '');
    }))
    .pipe(gulp.dest('dist/icons'));
});

// Copy icons to nodes directories for n8n
gulp.task('copy:node-icons', function() {
  return gulp.src('icons/greenApi.svg')
    .pipe(gulp.dest('dist/nodes/GreenApi'))
    .pipe(gulp.dest('dist/nodes/GreenApiTrigger'));
});

// Default task
gulp.task('default', gulp.series('build:icons', 'copy:node-icons'));

// Build all
gulp.task('build', gulp.series('build:icons', 'copy:node-icons'));