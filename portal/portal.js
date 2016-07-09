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

var events = require("./events");
var server = require("./server");
var fs = require("fs");
var settings = null;

var path = require('path');

process.env.NODE_PORTAL_HOME = process.env.NODE_PORTAL_HOME || path.resolve(__dirname+"/..");

var events = require("events");

var PORTAL = {

    init: function(httpServer,userSettings) {
        settings = userSettings;
        
        var p = require(path.join(process.env.NODE_PORTAL_HOME,"package.json"));
        if (fs.existsSync(path.join(process.env.NODE_PORTAL_HOME,".git"))) {
            settings.version = p.version+".git";
        } else {
            settings.version = p.version;
        }
        
        server.init(httpServer,settings);
        return server.app;
    },
    
    start: server.start,
    stop: server.stop,
    events: events,
};

PORTAL.__defineGetter__("app", function() { console.log("Deprecated use of PORTAL.app - use PORTAL.httpAdmin instead"); return server.app });
PORTAL.__defineGetter__("httpAdmin", function() { return server.app });
PORTAL.__defineGetter__("httpNode", function() { return server.nodeApp });
PORTAL.__defineGetter__("server", function() { return server.server });
PORTAL.__defineGetter__("settings", function() { return settings });

module.exports = PORTAL;
