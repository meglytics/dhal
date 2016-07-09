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

var when = require("when");
var lib = require("./../../../portal/lib.js");
var workbenches_api = require("./../api/workbenches.js");
var util = require('util');
var _result = [];
var _email = "";
var _password = "";

function Workbenches(email, password) {
	this._email = email;
	this._password = password;
}

function createWorkbenchesJson(data) {
	var _json = {};
	if (data.hasOwnProperty('id')) {
		lib.mergeObjects(_json, {
			id : data.id
		});
	} else {
		lib.mergeObjects(_json, {
			id : ''
		});
	}
	if (data.hasOwnProperty('name')) {
		lib.mergeObjects(_json, {
			name : data.name
		});
	} else {
		lib.mergeObjects(_json, {
			name : ''
		});
	}
	if (data.hasOwnProperty('connectors')) {
		lib.mergeObjects(_json, {
			connectors : data.connectors
		});
	} else {
		lib.mergeObjects(_json, {
			connectors : []
		});
	}
	
	if (data.hasOwnProperty('created_at')) {
		lib.mergeObjects(_json, {
			created_at : data.created_at
		});
	} else {
		lib.mergeObjects(_json, {
			created_at : ''
		});
	}
	return _json;
}

function toJson(options) {
	util.log('[portal] Processing user workbench ');
	return createWorkbenchesJson(options);
};

Workbenches.prototype.create = function(options) {
	util.log('[portal] Ready to post workbenches');
	return workbenches_api.post_workbenches(options, this._email, this._password);
};

Workbenches.prototype.execute = function(options) {
	util.log('[portal] Ready to execute workbenches');
	return workbenches_api.execute_workbenches(options, this._email, this._password);
};


module.exports = Workbenches;
