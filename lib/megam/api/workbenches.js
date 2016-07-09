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

var API = require("./../api.js");
var util = require('util');

var workbenches = module.exports = {

	post_workbenches : function(json, email, password) {
		var api = new API({
			email : email,
			password : password,
			url : "/workbenches/content",
			body : json,
		});
		util.log('[portal] Processing post workbenches requirements');
		return api.post();
	},
	
	execute_workbenches : function(json, email, password) {
		var api = new API({
			email : email,
			password : password,
			url : "/workbenches/execute",
			body : json,
		});
		util.log('[portal] Processing execute workbenches requirements');
		return api.post();
	},
		
	
};
