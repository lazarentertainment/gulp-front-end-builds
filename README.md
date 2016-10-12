# gulp-front-end-builds [![Build Status](https://travis-ci.org/leeh/gulp-front-end-builds.svg?branch=master)](https://travis-ci.org/leeh/gulp-front-end-builds)

Gulp plugin to deploy a JS application to a [https://github.com/tedconf/front_end_builds](Front End Builds)-enabled server

## Install

```
$ npm install --save-dev gulp-front-end-builds
```


## Usage

```js
const gulp = require('gulp');
const frontEnd = require('gulp-front-end-builds');


gulp.task('deploy', () => {
	gulp.src('dist/index.html')
		.pipe(frontEnd({endpoint: "http://www.example.com", app: "application"}))
);
```


## API

### frontEndBuilds([options])

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.

