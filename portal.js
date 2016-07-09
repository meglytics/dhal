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

var http = require('http');
var https = require('https');
var util = require("util");
var express = require("express");
var crypto = require("crypto");
var nopt = require("nopt");
var path = require("path");
var PORTAL = require("./portal/portal.js");

var server;
var app = express();

var settingsFile = "./settings";

var knownOpts = {
	"settings" : [path],
	"v" : Boolean,
	"help" : Boolean
};
var shortHands = {
	"s" : ["--settings"],
	"?" : ["--help"]
};
nopt.invalidHandler = function(k, v, t) {
	// TODO: console.log(k,v,t);
}
var parsedArgs = nopt(knownOpts, shortHands, process.argv, 2)

if (parsedArgs.help) {
	console.log("Portal v" + PORTAL.version());
	console.log("Usage: node portal.js [-v] [-?] [--settings settings.js]");
	console.log("");
	console.log("Options:");
	console.log("  -s, --settings FILE  use specified settings file");
	console.log("  -v                   enable verbose output");
	console.log("  -?, --help           show usage");
	console.log("");
	console.log("Documentation can be found at http://docs.megam.io");
	process.exit();
}

if (parsedArgs.settings) {
	settingsFile = parsedArgs.settings;
}
try {
	var settings = require(settingsFile);
} catch(err) {
	if (err.code == 'MODULE_NOT_FOUND') {
		console.log("Unable to load settings file " + settingsFile);
	} else {
		console.log(err);
	}
	process.exit();
}

if (parsedArgs.v) {
	settings.verbose = true;
}

if (settings.https) {
	server = https.createServer(settings.https, function(req, res) {
		app(req, res);
	});
} else {
	server = http.createServer(function(req, res) {
		app(req, res);
	});
}
server.setMaxListeners(0);

function formatRoot(root) {
	if (root[0] != "/") {
		root = "/" + root;
	}
	if (root.slice(-1) != "/") {
		root = root + "/";
	}
	return root;
}

if (settings.httpRoot === false) {
	settings.httpAdminRoot = false;
	settings.httpNodeRoot = false;
} else {
	settings.httpRoot = settings.httpRoot || "/";
}

if (settings.httpAdminRoot !== false) {
	settings.httpAdminRoot = formatRoot(settings.httpAdminRoot || settings.httpRoot || "/");
	settings.httpAdminAuth = settings.httpAdminAuth || settings.httpAuth;
}

settings.uiPort = settings.uiPort || 1990;
settings.uiHost = settings.uiHost || "0.0.0.0";

PORTAL.init(server, settings);

if (settings.httpAdminRoot !== false) {
	app.use(settings.httpAdminRoot, PORTAL.httpAdmin);
}


function getListenPath() {
	var listenPath = 'http' + (settings.https ? 's' : '') + '://' + (settings.uiHost == '0.0.0.0' ? '127.0.0.1' : settings.uiHost) + ':' + settings.uiPort;
	if (settings.httpAdminRoot !== false) {
		listenPath += settings.httpAdminRoot;
	} else if (settings.httpStatic) {
		listenPath += "/";
	}
	return listenPath;
}


PORTAL.start().then(function() {
	if (settings.httpAdminRoot !== false || settings.httpNodeRoot !== false || settings.httpStatic) {
		server.on('error', function(err) {
			if (err.errno === "EADDRINUSE") {
				util.log('[portal] Unable to listen on ' + getListenPath());
				util.log('[portal] Error: port in use');
			} else {
				util.log('[portal] Uncaught Exception:');
				util.log(err.stack);
			}
			process.exit(1);
		});
		server.listen(settings.uiPort, settings.uiHost, function() {
			if (settings.httpAdminRoot === false) {
				util.log('[portal] Admin UI disabled');
			}
			util.log('[portal] Server now running at ' + getListenPath());
		});
	} else {
		util.log('[portal] Running in headless mode');
	}
});

process.on('uncaughtException', function(err) {
	util.log('[portal] Uncaught Exception:');
	util.log(err.stack);
	//process.exit(1);
});

process.on('SIGINT', function() {
	PORTAL.stop();
	// TODO: need to allow nodes to close asynchronously before terminating the
	// process - ie, promises
	process.exit();
});
