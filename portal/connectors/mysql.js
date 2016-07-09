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


var mysql = require('mysql');
var when = require("when");
var util = require('util');
var _connection;
var _result = [];

function MySQL(options) {
	this._dbname = options.dbname;
	this._host = options.host;
	this._username = options.username;
	this._password = options.password;
}

MySQL.prototype.getDBName = function() {
	return this._dbname;
};

MySQL.prototype.getHost = function() {
	return this._host;
};

MySQL.prototype.getUserName = function() {
	return this._username;
};

MySQL.prototype.getPassword = function() {
	return this._password;
};

MySQL.prototype.getConnection = function() {
	_connection = mysql.createConnection({
		host : this._host,
		user : this._username,
		password : this._password,
		database : this._dbname
	});

	return when.promise(function(resolve, reject) {
		_connection.connect(function(err) {
			if (err) {
				util.log('[portal] Error > ' + err.stack);
				reject(new Error(err));
			} else {
				util.log('[portal] connected as id > ' + _connection.threadId);
				resolve(_connection);
			}
		});
	});
};

MySQL.prototype.getData = function(connection) {
	var _array = [];
    _result = [];
	return when.promise(function(resolve, reject) {
		listTables(connection).then(function(tables) {
			for (var i in tables) {
				_array.push(listFields(connection, tables[i]))
			}
			when.all(_array).then(function() {
				resolve(_result);
			}).otherwise(function(err) {
				reject(err);
			});
		}).otherwise(function(err) {
			util.log("[portal] Error > " + err);
			reject(err);
		});
	});

};

function listTables(connection) {
	var _tables = [];

	return when.promise(function(resolve, reject) {
		connection.query("SHOW tables").on('error', function(err) {
			// Handle error, an 'end' event will be emitted after this as well
			reject(err);
		}).on('result', function(row) {
			// Pausing the connnection is useful if your processing involves I/O
			for (var key in row) {
				_tables.push(row[key]);
			}
			//_tables.push(row.Tables_in_retail);

		}).on('end', function() {
			// all rows have been received
			resolve(_tables);
		});
	});
}

function listFields(connection, tableName) {
	var schemas = [];
	return when.promise(function(resolve, reject) {
		connection.query('SHOW COLUMNS FROM ' + tableName).on('error', function(err) {
			// Handle error, an 'end' event will be emitted after this as well
			reject(err);
		}).on('result', function(row) {
			// Pausing the connnection is useful if your processing involves I/O
			schemas.push(row.Field);
		}).on('end', function() {
			// all rows have been received
			resolve(_result.push({name : tableName, schemas }));
		});
	});
}

module.exports = MySQL;
