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


var util = require('util');

var errors = module.exports = {
	
	RequestFailed: function() {
		return "Something went wrong on API server. Please contact service provider.";
	},
	Unauthorized: function() {
		return "Unauthorized - please check email and password";
	},
	Forbidden: function() {
		return "Forbidden";
	},
	NotFound: function() {
		return "Not found";
	},
	Timeout: function() {
		return "Timeout reached";
	},	

};