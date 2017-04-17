'use strict';
// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://github.com/gulpjs/gulp/tree/4.0

import path from 'path';
import run from 'gulp-run';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import minifyejs from 'gulp-minify-ejs';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

//creates information necessary 
//to work with node-env
const getENV = function () {
  const isProd = process.env.NODE_ENV === 'production';
  const output = isProd ? 'compact' : 'expanded';
  return {
      isProd : isProd,
      output: output };
};





// ===========================
// DEVELOPMENT TASKS
// ===========================


//SET ENV
//calling gulp serve, invokes 'npm serve' which calls gulp serve:dev
gulp.task('serve', function() {
    return run('NODE_ENV=development npm run serve').exec();
});



//LIVERELOAD
// Watch files for changes & reload
gulp.task('serve:dev', ['scripts', 'styles'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'src'],
    port: 3000
  });
  
  gulp.watch(['src/**/*.html'], reload);
  gulp.watch(['src/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['src/scripts/**/*.js'], ['scripts', reload]); //scripts
  gulp.watch(['src/images/**/*'], reload);
});

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 8',
    'ff >= 3.5',
    'chrome >= 10',
    'safari >= 5',
    'opera >= 10.5',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];
  
  const nodeENV = getENV();
  
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'src/styles/main.scss'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sass({
      precision: 10,
      outputStyle: nodeENV.ouput
    }).on('error', $.sass.logError))
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    // .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    //creating dist folder only in when nodeENV is true 
    //or gulp build is called
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.if(nodeENV.isProd,gulp.dest('dist/styles')));
});


gulp.task('scripts', () =>
    gulp.src([
      // Note: Since we are not using useref in the scripts build pipeline,
      //       you need to explicitly list your scripts here in the right order
      //       to be correctly concatenated
      './src/scripts/skills-menu.js',
      './src/scripts/scroll.js',
      './src/scripts/side-nav.js'
      // Other scripts
    ])
      .pipe($.newer('.tmp/scripts'))
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe($.concat('main.min.js'))
      .pipe($.uglify())
      // Output files
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/scripts'))
      .pipe(gulp.dest('.tmp/scripts'))
);




// ===========================
// PRODUCTION PREPARTION TASKS
// ===========================

/* 
 * Make sure right files are linted
 * Check the file path for all optimization tasks
 */

//SET ENV
//calling gulp build, invokes npm serve which calls gulp serve:dev
gulp.task('build', function() {
    //run an npm script and change environment
    return run('NODE_ENV=production npm run build').exec();
});



//BUILD
// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    [/*'lint', 'html','minify-ejs','images',*/ 'scripts', 'copy'],
    /*'generate-service-worker',*/
    cb
  )
);


//CLEAN
// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));


// Lint JavaScript
gulp.task('lint', () =>
  gulp.src(['src/scripts/**/*.js','!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

//IMAGES
// Optimize images
gulp.task('images', () =>
  gulp.src('src/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}))
);


//HTML
// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe($.useref({
      searchPath: '{.tmp,src}',
      noAssets: true
    }))

    // Minify any HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});



//EJS
//minifies ejs templates
gulp.task('minify-ejs', function() {
  return gulp.src(['src/views/*.ejs'])
    .pipe(minifyejs())
    // .pipe(rename({suffix:".min"})) 
    .pipe(gulp.dest('dist'))
})



//COPY AND MOVE
// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'src/*',
    '!src/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);




/*
DOWNLOAD PAGE SPEED AND Service Workers from WEB STARTER KIT
*/


