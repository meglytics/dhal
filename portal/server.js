/*
 ** Copyright [2013] [Megam Systems]
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

var express = require('express');
var util = require('util');
var when = require('when');

var createUI = require("./ui");

var app = null;
var nodeApp = null;
var server = null;
var settings = null;
var storage = null;

function createServer(_server, _settings) {
	server = _server;
	settings = _settings;
	app = createUI(settings);
	nodeApp = express();	
}

function start() {
	var PORTAL = require("./portal");
	var defer = when.defer();
	
    defer.resolve();
	return defer.promise;
}

function stop() {
	//portalNodes.stopFlows();
}

module.exports = {
	init : createServer,
	start : start,
	stop : stop
};

module.exports.__defineGetter__("app", function() {
	return app
});

module.exports.__defineGetter__("server", function() {
	return server
}); 


