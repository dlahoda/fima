const gulp          = require('gulp'),
      sass          = require('gulp-sass'),
      pug           = require('gulp-pug'),
      autoprefixer  = require('gulp-autoprefixer'),
      concat        = require('gulp-concat'),
      rename        = require('gulp-rename'),
      rigger        = require('gulp-rigger'),
      uglify        = require('gulp-uglify'),
      del           = require('del'),
      browserSync   = require('browser-sync');

gulp.task('server', function(){
  browserSync.init({
    server: {
        port: 3111,
        baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('templates:compile', function(){
  return gulp.src('src/templates/index.pug')
          .pipe(pug({pretty: true}))
          .pipe(gulp.dest('build'));
});

gulp.task('styles:compile', function(){
  return gulp.src('src/sass/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false}))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/styles'));
});

gulp.task('js:compile', function(){
  return gulp.src('src/js/main.js')
          .pipe(rigger())
          .pipe(uglify())
          .pipe(gulp.dest('build/js'));
});

gulp.task('images:copy', function(){
  return gulp.src('src/images/**/*.*')
          .pipe(gulp.dest('build/images'));
});

gulp.task('fonts:copy', function(){
  return gulp.src('src/fonts/**/*.*')
          .pipe(gulp.dest('build/fonts'));
});

gulp.task('clean:build', function(){
  return del(['build/*']);
});

gulp.task('watch', function(){
  gulp.watch('src/templates/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('src/sass/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('src/js/**/*.js', gulp.series('js:compile'));
});

gulp.task('dev', gulp.series(
  'clean:build',
  gulp.parallel('templates:compile', 'styles:compile', 'js:compile', 'images:copy', 'fonts:copy'),
  gulp.parallel('watch', 'server')
  )
);

gulp.task('build', gulp.series(
  'clean:build',
  gulp.parallel('templates:compile', 'styles:compile', 'js:compile', 'images:copy', 'fonts:copy')
  )
);