var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('copyCss', function () {
    return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('./wwwroot/css'));
});

gulp.task('copyJs', function () {
    return gulp.src([
        './node_modules/jquery/dist/jquery.slim.min.js',
        './node_modules/popper.js/dist/umd/popper.min.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js'])
        .pipe(gulp.dest('./wwwroot/js'));
});

gulp.task('bundleJs', function(){
    return gulp.src([
        './js/canvas.js',
        './js/visualElement.js',
        './js/person.js',
        './js/familyNode.js',
        './js/event.js'])
        .pipe(concat('familyTree.min.js'))
        .pipe(gulp.dest('./wwwroot/js'));
});

gulp.task('bundleCss', function(){
    return gulp.src(['./css/site.css'])
        .pipe(gulp.dest('./wwwroot/css'))
});

gulp.task('default', ['copyCss', 'copyJs', 'bundleJs', 'bundleCss'])