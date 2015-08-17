var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var jade = require('gulp-jade');

var jadeConf = {
  pretty: true
};

gulp.task('copy', function () {
  gulp.src('./public/components/bootstrap/dist/js/bootstrap.min.js')
    .pipe(gulp.dest('./public/lib/bootstrap/js'));
  gulp.src('./public/components/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('./public/lib/bootstrap/css'));
  gulp.src('./public/components/bootstrap/dist/fonts/**/*')
    .pipe(gulp.dest('./public/lib/bootstrap/fonts/'));

  gulp.src('./public/components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./public/lib/js/'));
  gulp.src('./public/components/angular/angular.min.js')
    .pipe(gulp.dest('./public/lib/js/'));
  gulp.src('./public/components/angular-resource/angular-resource.min.js')
    .pipe(gulp.dest('./public/lib/js/'));
  gulp.src('./public/components/angular-translate/angular-translate.min.js')
    .pipe(gulp.dest('./public/lib/js/'));
  gulp.src('./public/components/angular-ui-router/release/angular-ui-router.min.js')
    .pipe(gulp.dest('./public/lib/js/'));
  gulp.src('./public/components/lodash/lodash.min.js')
    .pipe(gulp.dest('./public/lib/js/'));
  gulp.src('./public/components/moment/min/moment-with-locales.min.js')
    .pipe(gulp.dest('./public/lib/js/'));
  gulp.src('./public/components/underscore.string/dist/underscore.string.min.js')
    .pipe(gulp.dest('./public/lib/js/'));

  gulp.src('./public/components/fontawesome/css/font-awesome.min.css')
    .pipe(gulp.dest('./public/lib/fontawesome/'));
  gulp.src('./public/components/fontawesome/fonts/**/*')
    .pipe(gulp.dest('./public/lib/fontawesome/fonts/'));
});

gulp.task('jade', function () {
  gulp
    .src('./public/templates/jade/*.jade')
    .pipe(jade(jadeConf))
    .pipe(gulp.dest('./public/templates/html'))
    .pipe(livereload());

  gulp
    .src('./public/templates/jade/index.jade')
    .pipe(jade(jadeConf))
    .pipe(gulp.dest('./public/'))
    .pipe(livereload());
});

gulp.task('less', function () {
  gulp.src('./public/less/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.less', ['less']);
  gulp.watch('./public/templates/**/*.jade', ['jade']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js jade coffee'
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 500);
  });
});

gulp.task('default', [
  'less',
  'develop',
  'watch'
]);
