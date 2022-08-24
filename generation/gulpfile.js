import gulp from 'gulp';
import pug from 'gulp-pug';
import gultSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import minify from 'gulp-uglify'; // Can to be replaced by `gulp-terser` for es6+
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import { deleteAsync } from 'del';
import spritesmith from 'gulp.spritesmith';
import gulpif from 'gulp-if';
import jslint from 'gulp-jslint';
import dartSass from 'sass';
import rename from 'gulp-rename';
//import util from 'gulp-util';

const sass = gultSass(dartSass);

gulp.task('pug', function () {
    return gulp.src('./assets/**/*.pug')
        .pipe(pug({
            locals: {}
        }))
        .pipe(gulp.dest('../webapp/app/'))
});

gulp.task('sass', function () {
    return gulp.src('./assets/**/*.sass')
        .pipe(sass.sync({outputStyle: 'compressed', quietDeps: true}).on('error', sass.logError))
        .pipe(gulp.dest('../webapp/app/'));
});
gulp.task('autoprefixer', function () {
    return gulp.src('../webapp/app/style/main.css')
        .pipe(autoprefixer({}))
        .pipe(gulp.dest('../webapp/app/style/'));
});
gulp.task('css-concat', function () {
    return gulp.src(['../webapp/app/style/sprite.css', '../webapp/app/style/main.css'])
        .pipe(concat('app.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('../webapp/app/style/'))
});
gulp.task('css-build', gulp.series('sass', 'autoprefixer', 'css-concat'));
gulp.task('css-third-party', function () {
    return gulp.src([
        './node_modules/lato/css/lato.css',
        './node_modules/normalize.css/normalize.css',
        './node_modules/font-awesome/css/font-awesome.css'
    ])
        .pipe(concat('source.css'))
        .pipe(gulp.dest('../webapp/app/third-party/style'));
});

gulp.task('css-third-party-resources:font-awesome', function () {
    return gulp.src('./node_modules/font-awesome/fonts/*').pipe(gulp.dest('../webapp/app/third-party/fonts'));
});

gulp.task('css-third-party-resources:lato', function () {
    return gulp.src('./node_modules/lato/font/**/*').pipe(gulp.dest('../webapp/app/third-party/font'));
});

gulp.task('css-third-party-resources', gulp.series('css-third-party-resources:font-awesome', 'css-third-party-resources:lato'));
gulp.task('css', gulp.series('css-build', 'css-third-party', 'css-third-party-resources'));


gulp.task('copy-images', function () {
    return gulp.src(['./assets/**/*.png', './assets/**/*.jpg'])
        .pipe(gulp.dest('../webapp/app/'));
});
gulp.task('sprites', function () {
    return gulp.src('./assets/**/sprite_*.{png,jpg}').pipe(spritesmith({
        imgName: '../images/sprite.png',
        cssName: 'sprite.css'
    })).pipe(gulpif('*.png',
        gulp.dest('../webapp/app/images'),
        gulp.dest('../webapp/app/style/'))
    );
});
gulp.task('images', gulp.series('copy-images', 'sprites'));

gulp.task('lint', function () {
    return gulp.src('./assets/**/*.js').pipe(jslint({
            node: false,
            evil: false,
            nomen: true,
            vars: true,
            unparam: true,
            global: [],
            predef: ['angular', '_', 'window', '$', 'hljs'],
            edition: '2014-07-08',
            errorsOnly: true,
        }).on('error', function () {
            // no-op
        })
    );
});
gulp.task('copy-js', function () {
    return gulp.src('./assets/**/*.js')
        .pipe(gulp.dest('../webapp/app/'));
});
gulp.task('copy-404', function () {
    return gulp.src('../webapp/index.html')
        .pipe(rename(function (path) {
            path.basename = "404";
        }))
        .pipe(gulp.dest('../webapp'));
});

gulp.task('minify', function () {
    return gulp.src('./assets/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(minify({
            output: { ascii_only: true },
            mangle: false // otherwhise the sourcemap/debugger does not work properly.
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../webapp/app/js/'));
});

gulp.task('js-build', gulp.series('lint', 'copy-js', 'minify'));

gulp.task('js-third-party', function () {
    return gulp.src([
        './node_modules/underscore/underscore.js',
        './node_modules/jquery/dist/jquery.js',
        './node_modules/angular/angular.js',
        './node_modules/angular-route/angular-route.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('source.js'))
        .pipe(minify({
            //minify but leave licenses and source map
            output: {
                ascii_only: true,
                comments: /^!|\b(copyright|license)\b|@(preserve|license|cc_on)\b/i
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../webapp/app/third-party/'));
});
gulp.task('js', gulp.series('js-build', 'js-third-party'));

gulp.task('clean', function (done) {
    return deleteAsync(['../webapp/app/', '../webapp/404.html'], {
        force: true
    }).then(res => {
        if (res?.length) {
            //util.log(`Cleaned ${res.join(',')}`);
        }
        done();
    });
});

gulp.task('watch', function () {
    gulp.watch(
        ['./assets/**/*'],
        gulp.series('build')
    )
});

gulp.task('build', gulp.series('clean', 'pug', 'images', 'css', 'js', 'copy-404'));
gulp.task('default', gulp.parallel('build', 'watch'));
