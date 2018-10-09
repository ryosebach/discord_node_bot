const gulp = require("gulp");
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const abspath = require('gulp-absolute-path');
const tsProj = ts.createProject("./tsconfig.json");
// const newer = require('gulp-newer');
const change = require('gulp-cached');
const merge = require('merge2');

gulp.task('build', function () {
    return srcBuild();
});

gulp.task('watch', function () {
    gulp.watch('src/server/app/**/*.ts', { cwd: './' }, ['build'])
});

const srcBuild = function () {
    const proj = gulp.src(['src/server/app/**/*.ts'])
        .pipe(change('dist/server/app'))
        .pipe(sourcemaps.init())
        .pipe(abspath({ rootDir: './src' }))
        .pipe(tsProj());
    return merge([
        proj.dts.pipe(gulp.dest('dist/server/app')),
        proj.js
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/server/app'))
    ]);
};

gulp.task('default', ['build']);
