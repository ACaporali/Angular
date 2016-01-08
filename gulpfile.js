var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');

// Static server
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./src"
    });

    gulp.watch('src/assets/scss/**/*.scss', ['sass']);
    gulp.watch("./src/*.html").on('change', browserSync.reload);
});

gulp.task('copy-angular-templates', function(done){
	gulp.src(['src/assets/template/**/*'])
		.pipe(gulp.dest('www/assets/template/'))
		.on('end', done);
});

// creation d'une nouvelle tache : 'sass' qui convertie les fichier scss en css
gulp.task('sass', function () {
  // convertit un fichier .scss en .css
  return gulp.src('src/assets/scss/**/*.scss') // définition du répertoire source
    .pipe(sass()) // exécution Sass
    .pipe(gulp.dest('./src/assets/css'))// écriture dans destination
    .pipe(browserSync.stream());// synchronise les modifications comme browserSync.reload mais ne recharge pas la page (comme de l'ajax)
});

// fonction qui met dans le répertoire 'www' les fichier .html situé dans 'src'
gulp.task('useref', function () {
    var assets = useref.assets();
 
    return gulp.src('src/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('www'));
});