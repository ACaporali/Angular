var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');

// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: "./src"
    });
});

gulp.task('copy-angular-templates', function(done){
	gulp.src(['src/assets/template/**/*'])
		.pipe(gulp.dest('www/assets/template/'))
		.on('end', done);
});

// creation d'une nouvelle tache : 'sass' 
gulp.task('sass', function () {
  // convertit un fichier .scss en .css
  return gulp.src('src/assets/scss/**/*.scss') // définition du répertoire source
    .pipe(sass()) // exécution Sass
    .pipe(gulp.dest('./src/assets/css'))// écriture dans destination
    .pipe(browserSync.stream());// synchronise les modifications comme browserSync.reload mais ne recharge pas la page (comme de l'ajax)
});

gulp.task('make', ['copy-angular-templates'], function(){
	return gulp.src('src/*.html')
		.pipe(useref())
		.pipe(gulp.dest('www'));
});