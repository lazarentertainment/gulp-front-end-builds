'use strict';
const PLUGIN_NAME = "gulp-front-end-builds";

var CoreObject 	= require('core-object');
var fs 						= require('fs');
var crypto 				= require('crypto');
var request 			= require('request');
var util					= require('gulp-util')
var passwdUser 		= require('passwd-user');

var execSync 			= require('child_process').execSync;
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

function sign(index, privateKey) {
  var algo = 'RSA-SHA256'

  return crypto
    .createSign(algo)
    .update(index)
    .sign(fs.readFileSync(privateKey), 'base64');
}

module.exports = (options) => {
  let option = options || {
  	endpoint: "http://127.0.0.1:3000"
  };

  if (!options.privateKey) {
	  var homedir = passwdUser.sync(process.getuid()).homedir;
    options.privateKey = homedir + '/.ssh/id_rsa';
  }

  if (!options.app) {
  	util.log(util.colors.red('Could not find app to use.'));
    throw new PluginError(PLUGIN_NAME, 'Could not find app to use.');
  }

  if (!options.endpoint || typeof(options.endpoint) !== "string") {
  	util.log(util.colors.red('Invalid endpoint.'));
    throw new pluginError(PLUGIN_NAME, 'Invalid endpoint.');
  }

  var cb = options.callback || function(){};

  return obj((file, enc, cb) => {
  	util.log(util.colors.cyan('Deploying to front end builds server.'));
    if (!file) {
    	util.log(util.colors.red('Missing source file or files.'));
      throw new pluginError(PLUGIN_NAME, 'Missing file or files.');
    }
    if (file.isBuffer()) {

    	var git = gitInfo();
    	var content = file.contents.toString(options.encoding || null);
      var signature = sign(content, options.privateKey);

      var url = options.endpoint.match(/\/front_end_builds\/builds$/) ?
	     options.endpoint : options.endpoint + '/front_end_builds/builds';

			var data = {
				app_name: options.app,
        branch: git.branch,
        sha: git.sha,
        signature: signature,
        html: content
      },
      plugin = this;

      post({
        url: url,
        form: data
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

