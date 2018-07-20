var gulp = require('gulp');

gulp.task('copyCss', function () {
    return gulp.src(['./node_modules/bootstrap/dist/css/*.css'])
        .pipe(gulp.dest('./wwwroot/lib/css'));
});

gulp.task('copyJs', function () {
    return gulp.src([
        './node_modules/jquery/dist/jquery*js',
        './node_modules/popper.js/dist/popper*js',
        './node_modules/bootstrap/dist/js/bootstrap*js'
    ]).pipe(gulp.dest('./wwwroot/lib/js'));
});

//using gulp-bundle-assets
// gulp.task('bundle', function () {
//     return gulp.src('bundle.config.js')
//         .pipe(bundle())
//         .pipe(gulp.dest('./wwwroot'));
// });

// {
//     "label": "gulpBundles",
//     "type": "shell",
//     "command": "gulp bundle",
//     "options": {
//         "cwd": "${workspaceRoot}/fTreeCore2.Web"
//     },
//     "dependsOn": [
//         "yarn"
//     ]
// },

//from old bundle.config.js
// bundle: {
//     familyTree: {
//         scripts: [
//             './wwwroot/js/canvas.js',
//             './wwwroot/js/visualElement.js',
//             './wwwroot/js/event.js'
//         ],
//         styles: ['./wwwroot/css/site.css']
//     },
//     lib: {
//         scripts: [
//             './wwwroot/lib/js/jquery.slim.min.js',
//             './wwwroot/lib/js/popper.min.js',
//             './wwwroot/lib/js/bootstrap.min.js'
//         ],
//         styles: ['./wwwroot/lib/css/bootstrap.min.css'],
//         options: {
//           maps: false
//         }
//     }
// }