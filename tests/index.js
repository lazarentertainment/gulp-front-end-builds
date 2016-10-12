'use strict';

var path = require('path');
var assert = require('assert');
var fs = require('fs');
var gulp = require('gulp');
var frontEnd = require('../index');

var fileName = Math.floor(Math.random()*10000) + '.html';
var dirname = 'upload';
var content = 'Hello, gulp-front-end-builds.';

var options = {
	endpoint: "http://127.0.0.1:7890",
	app: "application"
}

describe('gulp-front-end-builds', function() {
	var filePath = path.join(__dirname, fileName);

	beforeEach(function () {
		fs.writeFileSync(filePath, content, 'utf-8');
	})

	afterEach(function () {
		fs.unlinkSync(filePath);
	})

	it('should post to the server successfully', function(done) {
		var app = require('./server');

		gulp.task('test', function() {
			return gulp.src(filePath)
			.pipe(frontEnd(options))
			.on('end', function(){

				// var destFile = fs.readFileSync(destPath, 'utf-8');
				// assert.equal(content, destFile.toString());
				done();
			});
		});

		gulp.start('test');
	});
});
