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

var MYSQL = require("./mysql.js");
var _connect = '';
var _connectorname = '';
var _data = "";

var connectors = module.exports = {
	init : function(options) {
		switch(options.connector) {
		case "mysql":
		    _connect = new MYSQL(options);
			break;
		default:
			break;

		}
	},

	getConnection : function() {
		return _connect.getConnection();
	},
	
	getData : function(connection) {
		return _connect.getData(connection);
	},

	generateData : function(connection) {

		return _connect.generateData(connection);
	}
}; 