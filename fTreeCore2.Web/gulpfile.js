var gulp = require('gulp'),
    bundle = require('gulp-bundle-assets');

gulp.task('copyCss', function () {
    return gulp.src(['./node_modules/bootstrap/dist/css/*.css'])
        .pipe(gulp.dest('./wwwroot/lib/css'));
});

gulp.task('copyJs', function () {
    return gulp.src([
        './node_modules/jquery/dist/*.js',
        './node_modules/popper.js/dist/*.js',
        './node_modules/bootstrap/dist/js/*.js'
    ]).pipe(gulp.dest('./wwwroot/lib/js'));
});

gulp.task('bundle', function () {
    return gulp.src('bundle.config.js')
        .pipe(bundle())
        .pipe(gulp.dest('./wwwroot'));
});