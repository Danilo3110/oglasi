var postcss = require('gulp-postcss');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('css', function () {
    var plugin = [
        autoprefixer({
            browsers: [
                '>1%',
                'last 5 versions',
                'Firefox ESR',
                'not ie < 9',
            ]
        }),
        cssnano()
    ];
    return gulp.src('./src/css/*.css')
        .pipe(postcss(plugin))
        .pipe(gulp.dest('./src/css_min'));
});

gulp.task('default', gulp.series('css'));