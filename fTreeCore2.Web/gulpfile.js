var gulp = require('gulp');

gulp.task('copyCss', function () {
    return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.css'])
        .pipe(gulp.dest('./wwwroot/lib/css'));
});

gulp.task('copyLib', function(){
    return gulp.src([
        './node_modules/jquery/dist/jquery.slim.js',
        './node_modules/popper.js/dist/popper.js',
        './node_modules/bootstrap/dist/js/bootstrap.js'
        ]).pipe(gulp.dest('./wwwroot/lib/js'));
})