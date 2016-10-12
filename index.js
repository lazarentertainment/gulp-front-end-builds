'use strict';
const PLUGIN_NAME = "gulp-front-end-builds";

var CoreObject 	= require('core-object');
var fs 						= require('fs');
var crypto 				= require('crypto');
var execSync 			= require('child_process').execSync;
var _ 						= require('underscore');
var request 			= require('request');
var util					= require('gulp-util')
const pluginError = require("gulp-util").PluginError;
const post 				= require("request").post;
const obj 				= require("through2").obj;

function gitInfo() {
  var sha, branch;
  sha = execSync('git rev-parse HEAD').toString().trim();
  branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

  return {
    sha: sha,
    branch: branch
  };
}

module.exports._gitInfo = gitInfo;

function sign(index) {
  var algo = 'RSA-SHA256',
    keyFile = this.readConfig('privateKey');

  return crypto
    .createSign(algo)
    .update(index)
    .sign(fs.readFileSync(keyFile), 'base64');
}

module.exports = (endpoint, app, options) => {
  let option = options || {};
  if (!host || typeof(host) !== "string") {
    throw new pluginError(PLUGIN_NAME, 'Invalid host format.');
  }

  return obj((file, enc, cb) => {
    if (!file) {
      throw new pluginError(PLUGIN_NAME, 'Missing file or files.');
    }
    if (file.isBuffer()) {

    	var git = this.gitInfo();
    	var content = file.contents.toString(opt.encoding || null);
      var signature = this.sign(content);

      var url = endpoint.match(/\/front_end_builds\/builds$/) ?
	      endpoint : endpoint + '/front_end_builds/builds';

			var data = {
				app_name: app,
        branch: git.branch,
        sha: git.sha,
        signature: signature,
        html: content
      },
      plugin = this;

      post({
        url: url,
        form: (opt => {
          opt.content = content
          opt.relative = file.relative;
          return opt;
        })(option)
      }, (err, response, body) => {
        option.callback && option.callback(err, body);
        if (err) {
          throw new pluginError(PLUGIN_NAME, 'Unable to reach endpoint ' + endpoint + ': ' + err.message);
        } else {
      	  var code = response.statusCode;

      	  if (code.toString().charAt(0) === '4') {
      	    //return reject('Rejected with code ' + code + '\n' + body);
      	  }

	    	  util.log(util.colors.green('Successfully deployed to front end builds server'));

      	}
      });
    }
    cb(null, file);
  })
};

