var gulp = require('gulp'),
    bundle = require('gulp-bundle-assets');

// gulp.task('copyCss', function () {
//     return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.css'])
//         .pipe(gulp.dest('./wwwroot/lib/css'));
// });

// gulp.task('copyLib', function(){
//     return gulp.src([
//         './node_modules/jquery/dist/jquery.slim.js',
//         './node_modules/popper.js/dist/popper.js',
//         './node_modules/bootstrap/dist/js/bootstrap.js'
//         ]).pipe(gulp.dest('./wwwroot/lib/js'));
// });


// [
//     {
//         "outputFileName": "wwwroot/css/site.min.css",
//         "inputFiles":[
//             "wwwroot/css/site.css"
//         ]
//     }
//     ,{
//         "outputFileName":"wwwroot/css/lib.min.css",
//         "inputfiles":[
//             "wwwroot/lib/css/bootstrap.css"
//         ],
//         "minify": {
//             "enabled": true
//         }
//     }
//     ,{
//         "outputFileName": "wwwroot/js/familyTree.min.js",
//         "inputFiles": [
//             "wwwroot/js/canvas.js",
//             "wwwroot/js/visualElement.js",
//             "wwwroot/js/event.js"
//         ],
//         "minify": {
//             "enabled": true, 
//             "renameLocals": true
//         }
//     }
//     ,{
//         "outputFileName":"wwwroot/js/lib.min.js",
//         "inputfiles":[
//             "wwwroot/lib/js/jquery.slim.js",
//             "wwwroot/lib/js/popper.js",
//             "wwwroot/lib/js/bootstrap.js"
//         ],
//         "minify": {
//             "enabled": true, 
//             "renameLocals": true
//         }
//     }
// ]