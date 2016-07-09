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

var accounts = module.exports = {

	post_accounts : function(json) {
		var api = new API({
			email : json.email,
			password : json.password,
			url : "/accounts/content",
			body : json,
		});
		util.log('[portal] Processing post account requirements');
		return api.post();
	},
	
	auth : function(json) {
		var api = new API({
			email : json.email,
			password : json.password,
			url : "/accounts/"+json.email,
			body : json,
		});
		util.log('[portal] Processing authenticating account requirements');
		return api.auth();
	},
	
};
