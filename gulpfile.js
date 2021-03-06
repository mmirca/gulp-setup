//
// Required packages
//
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const del = require('del');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngQuant  = require ('imagemin-pngquant');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const cached = require('gulp-cached');
const chalk = require('chalk');
const htmlreplace = require('gulp-html-replace');
//
// Simple tasks
//
// SASS
gulp.task('sass', ()=>
  gulp.src('app/scss/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
);
// Live development server
gulp.task('browserSync', ()=>{
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});
// Minify images
gulp.task('minifyImages', ()=>
  gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin([
    imagemin.gifsicle(),
    imageminJpegRecompress({
      loops:6,
      min: 40,
      max: 85,
      quality:'low'
    }),
    imageminPngQuant(),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest('dist/images'))
);
// Clean dist folder
gulp.task('clean:dist', ()=>
  del.sync(['dist/**', '!dist', '!dist/.gitkeep'])
);
// Combine scripts and css with useref
gulp.task('useref', ['sass', 'clean:dist'], ()=>
  gulp.src('app/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.css', autoprefixer()))
  .pipe(gulpIf('*.css', cleanCSS({debug: true}, logDetailsCSS)))
  .pipe(gulpIf('*.js', babel({presets: ['@babel/env']})))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulp.dest('dist'))
);
// Copy fonts to dist
gulp.task('fonts', ()=>
  gulp.src('app/fonts/**')
  .pipe(gulp.dest('dist/fonts'))
);
// Copy images to dist
gulp.task('images', ()=>
  gulp.src('app/images/**')
  .pipe(gulp.dest('dist/images'))
);
// Prebundle
gulp.task('prebundle', ['sass', 'clean:dist'], (callback)=>{
  delete cached.caches['bundle'];
  return gulp.src(['app/*.html', '!app/scss', '!app/scss/**'])
  .pipe(useref({noconcat: true}))
  .pipe(gulpIf('*.css', autoprefixer()))
  .pipe(gulpIf('*.css', cleanCSS({debug: true}, logDetailsCSS)))
  .pipe(gulpIf('*.js', babel({presets: ['@babel/env']})))
  .pipe(gulpIf('*.js', cached('bundle')))
  .pipe(gulpIf('*.js', concat('bundle.js')))
  .pipe(gulp.dest('dist'));
});
//
// Build tasks
//
// ES2015 + uglify + SASS
gulp.task('build', ['sass', 'clean:dist'], ()=>
  gulp.src(['app/**', '!app/scss', '!app/scss/**'])
  .pipe(gulpIf('*.css', autoprefixer()))
  .pipe(gulpIf('*.css', cleanCSS({debug: true}, logDetailsCSS)))
  .pipe(gulpIf('*.js', babel({presets: ['@babel/env']})))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulp.dest('dist'))
);
// ES2015 + uglify + SASS + imagemin
gulp.task('build:imagemin', ['sass', 'clean:dist'], (callback)=>{
  runSequence(['minifyImages', 'build'], callback)
});
// Bundle JS files
gulp.task('build:bundle', ['prebundle'], callback=>{
    gulp.src(['app/**', '!app/js', '!app/js/**', '!app/scss', '!app/scss/**'])
    .pipe(gulpIf('*.html', htmlreplace({js: 'bundle.js'})))
    .pipe(gulp.dest('dist'));
    return gulp.src('dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});
// Bundle JS files + imagemin
gulp.task('build:bundle:imagemin', ['clean:dist'], (callback)=>{
  runSequence(['build:bundle', 'minifyImages'], callback)
});
// ES2015 + uglify + SASS + useref
gulp.task('build:strict', ['sass', 'clean:dist'], (callback)=>{
  runSequence(['useref', 'images', 'fonts'], callback)
});
// ES2015 + uglify + SASS + useref + imagemin
gulp.task('build:strict:imagemin', ['sass', 'clean:dist'], (callback)=>{
  runSequence(['minifyImages', 'build:strict'], callback)
});
//
// Watch task
//
gulp.task('watch', ['browserSync', 'sass'], ()=>{
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
//
// Functions
//
function logDetailsCSS(details){
  let time = chalk.gray((new Date).toLocaleTimeString());
  let bytes =  chalk.magenta(`${details.stats.originalSize - details.stats.minifiedSize} bytes`);
  console.log(`[${time}] ${details.name}: ${bytes} reduced`);
}