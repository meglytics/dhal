/*
** Copyright [2012-2013] [Megam Systems]
**
** Licensed under the Apache License, Version 2.0 (the "License");
** you may not use this file except in compliance with the License.
** You may obtain a copy of the License at
**
** http://www.apache.org/licenses/LICENSE-2.0
**
** Unless required by applicable law or agreed to in writing, software
** distributed under the License is distributed on an "AS IS" BASIS,
** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
** See the License for the specific language governing permissions and
** limitations under the License.
*/

// We need this to build our post string
var http = require('http');
var request = require('request');
var fs = require('fs');
var when = require('when');
var crypto = require('crypto');
var time = require('time');
var util = require('util');
var errors = require("./../errors.js");

var now = new time.Date();
var API_VERSION = "/v2";

var result = {};
var post_result = {};
//var host = 'https://api.megam.io';
var HOST = 'http://localhost:9000';

var X_Megam_EMAIL = "X-Megam-EMAIL";
var X_Megam_APIKEY = "X-Megam-APIKEY";
var X_Megam_DATE = "X-Megam-DATE";
var X_Megam_PUTTUSAVI = "X-Megam-PUTTUSAVI";
var X_Megam_PASSWORD = "X-Megam-PASSWORD"
var Content_Type = "Content-Type";
var application_json = "application/json";
var Accept = "Accept";
var application_vnd_megam_json = "application/vnd.megam+json";

function MEGAM(options) {
	this._email = options.email.length > 1 ? options.email : "";
	this._password = options.password.length > 1 ? options.password : "";
	this._url = options.url;
	this._body = JSON.stringify(options.body);
	util.log('[portal] Body content > ' + this._body);
}

MEGAM.prototype.auth = function() {
	var path = API_VERSION + this._url;
	util.log('[portal] Request url > ' + path);
	var hmac = generateHMAC(this._body, path, this._password);
	// An object of options to indicate where to post to
	// Configure the request
	var options = {
		url : HOST + path,
		method : 'GET',
		headers : generateHeaders(this._email, this._password, hmac),
		form : this._body
	};
	util.log('[portal] Request headers ' + options.headers);

	return when.promise(function(resolve, reject) {
		// Start the request
		request(options, function(error, response, body) {
			util.log('[portal] Request completed..');
			util.log('[portal] Error > ' + error);
			util.log('[portal] Response code > ' + response.statusCode);
			util.log('[portal] Response body > ' + body);
			post_result = body;
			if (!error && response.statusCode == 200 || response.statusCode == 201) {
				resolve(body);
			} else if (response.statusCode == 503) {
				reject(errors.RequestFailed());
			} else if (response.statusCode == 401) {
				reject(errors.Unauthorized());
			} else {
				reject(errors.RequestFailed());
			}
		});

	});

}

MEGAM.prototype.post = function() {
	var path = API_VERSION + this._url;
	util.log('[portal] Request url > ' + path);
	var hmac = generateHMAC(this._body, path, this._password);
	// An object of options to indicate where to post to
	// Configure the request
	var options = {
		url : HOST + path,
		method : 'POST',
		headers : generateHeaders(this._email, this._password, hmac),
		form : this._body
	};
	util.log('[portal] Request headers ' + options.headers);

	return when.promise(function(resolve, reject) {
		// Start the request
		request(options, function(error, response, body) {
			util.log('[portal] Request completed..');
			util.log('[portal] Error > ' + error);
			util.log('[portal] Response code > ' + response.statusCode);
			util.log('[portal] Response body > ' + body);
			post_result = body;
			if (!error && response.statusCode == 200 || response.statusCode == 201) {
				resolve(body);
			} else if (response.statusCode == 503) {
				reject(errors.RequestFailed());
			} else {
				reject(errors.RequestFailed());
			}
		});

	});
};

function generateHeaders(email, password, hmac) {
	return {
		'X-Megam-DATE' : now.toString(),
		'X-Megam-EMAIL' : email,
		'X-Megam-PUTTUSAVI' : true,
		'X-Megam-PASSWORD' : password,
		'X-Megam-HMAC' : email + ":" + hmac,
		'Accept' : 'application/vnd.megam+json',
		'Content-Type' : 'application/json'
	}
}

function createSign(data, path) {
	var mkSign = now.toString() + "\n" + path + "\n" + calculateMD5(data);
	util.log('[portal] sign string > ' + mkSign);
	return mkSign;
}

function calculateMD5(data) {
	md5 = crypto.createHash("md5", "MD5").update(data).digest( encoding = 'base64');
	util.log('[portal] Digested value > ' + md5);
	return md5;
}

function generateHMAC(body, path, password) {
	var algorithm = 'sha1';
	var hash, hmac;
	util.log('[portal] Generating HMAC key ');
	hmac = crypto.createHmac(algorithm, password).update(createSign(body, path)).digest("hex");
	return hmac;
}

module.exports = MEGAM;
