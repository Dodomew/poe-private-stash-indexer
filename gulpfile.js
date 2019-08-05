const gulp = require('gulp');
const sass = require('gulp-sass');
// const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const gulpIf = require('gulp-if');
// const concat = require('gulp-concat');
// const webserver = require('gulp-webserver');

gulp.task('sass', function(){
    return gulp.src('resources/sass/**/*.scss')
               .pipe(sass()) // Converts Sass to CSS with gulp-sass
               .pipe(autoprefixer())
               .pipe(gulp.dest('public/css/'))
});

// gulp.task('js', function(){
//     return gulp.src('resources/js/*.js')
//                // .pipe(concat('[name].js'))
//                .pipe(gulp.dest('dist/js/'))
// });

gulp.task('build', function() {
    return gulp.src(['resources/sass/**/*.scss'])
        .pipe(gulpIf('*css', cssnano()))
        .pipe(gulp.dest('public/css'))
});

// gulp.task('build', function(){
//     return gulp.src(['resources/sass/**/*.sass', 'resources/js/**/*.js'])
//                .pipe(gulpIf('*.js', uglify()))
//                // Minifies only if it's a CSS file
//                .pipe(gulpIf('*.css', cssnano()))
//                .pipe(gulp.dest('dist'))
// });

gulp.task('watch-sass', function() {
    gulp.watch('resources/sass/**/*.scss', gulp.series('sass'));
});

// gulp.task('serve', function () {
//     gulp.src('./')
//         .pipe(webserver({
//                             livereload: {
//                                 enable: true,
//                             },
//                             fallback: "index.html",
//                             port: 8080,
//                             open: 'http://localhost:8080/index.html'
//                         }));
//     gulp.watch('resources/sass/**/*.sass', gulp.series('sass'));
//     gulp.watch('resources/js/**/*.js', gulp.series('js'));
//     gulp.watch('index.html');
// });
