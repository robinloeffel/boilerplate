const gulp = require('gulp');
const del = require('del');
const open = require('open');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');

const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const gIf = require('gulp-if');

const paths = require('./config/paths');
const webpackConfig = require('./config/webpack');
const connectConfig = require('./config/connect');
const browserlistConfig = require('./config/browserlist');

const dev = process.argv.includes('--dev');

gulp.task('clean', () => del(paths.dist.root));

gulp.task('open:page', () => open('http://localhost:' + connectConfig.port));

gulp.task('open:folder', () => open('dist'));

gulp.task('server', done => {
    connect.server(connectConfig);
    done();
});

gulp.task('sass', () => {
    return gulp.src(paths.src.files.sass)
        .pipe(plumber())
        .pipe(gIf(dev, sourcemaps.init()))
        .pipe(sass.sync())
        .pipe(autoprefixer(browserlistConfig))
        .pipe(gIf(!dev, cleanCss()))
        .pipe(gIf(dev, sourcemaps.write('.')))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(connect.reload());
});

gulp.task('js:transpile', () => {
    return gulp.src(paths.src.files.js.entry)
        .pipe(plumber())
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(connect.reload());
});

gulp.task('js:lint', () => {
    return gulp.src(paths.src.files.js.all)
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('img', () => {
    return gulp.src(paths.src.files.img)
        .pipe(plumber())
        .pipe(changed(paths.dist.img))
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true,
                optimizationLevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 7
            }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest(paths.dist.img))
        .pipe(connect.reload());
});

gulp.task('copy', () => {
    return gulp.src(paths.src.files.root, {
            base: paths.src.root
        })
        .pipe(gulp.dest(paths.dist.root))
        .pipe(connect.reload());
});

gulp.watch(paths.src.files.sass, gulp.series('sass'));
gulp.watch(paths.src.files.js.all, gulp.series('js:lint', 'js:transpile'));
gulp.watch(paths.src.files.img, gulp.series('img'));
gulp.watch(paths.src.files.sass, gulp.series('copy'));

gulp.task('build', gulp.parallel('js:lint', 'js:transpile', 'sass', 'img', 'copy'));
gulp.task('default', gulp.series('clean', 'build', 'server', 'open:page'));
