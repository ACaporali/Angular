var gulp        = require('gulp');
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

gulp.task('make', ['copy-angular-templates'], function(){
	return gulp.src('src/*.html')
		.pipe(useref())
		.pipe(gulp.dest('www'));
});