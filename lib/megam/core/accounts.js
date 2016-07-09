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
var accounts_api = require("./../api/accounts.js");
var util = require('util');
var _result = [];
var _email = "";
var _password = "";

function Accounts(email, password) {
	this._email = email;
	this._password = password;
}

function createAccountJson(data) {
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
	if (data.hasOwnProperty('email')) {
		lib.mergeObjects(_json, {
			email : data.email
		});
	} else {
		lib.mergeObjects(_json, {
			email : ''
		});
	}
	if (data.hasOwnProperty('username')) {
		lib.mergeObjects(_json, {
			first_name : data.username
		});
	} else {
		lib.mergeObjects(_json, {
			first_name : ''
		});
	}
	if (data.hasOwnProperty('api_key')) {
		lib.mergeObjects(_json, {
			api_key : data.api_key
		});
	} else {
		lib.mergeObjects(_json, {
			api_key : ''
		});
	}
	if (data.hasOwnProperty('password')) {
		lib.mergeObjects(_json, {
			password : data.password
		});
	} else {
		lib.mergeObjects(_json, {
			password : ''
		});
	}
	if (data.hasOwnProperty('phone')) {
		lib.mergeObjects(_json, {
			phone : data.phone
		});
	} else {
		lib.mergeObjects(_json, {
			phone : ''
		});
	}
	if (data.hasOwnProperty('last_name')) {
		lib.mergeObjects(_json, {
			last_name : data.last_name
		});
	} else {
		lib.mergeObjects(_json, {
			last_name : ''
		});
	}
	if (data.hasOwnProperty('authority')) {
		lib.mergeObjects(_json, {
			authority : data.authority
		});
	} else {
		lib.mergeObjects(_json, {
			authority : ''
		});
	}
	if (data.hasOwnProperty('password_reset_key')) {
		lib.mergeObjects(_json, {
			password_reset_key : data.password_reset_key
		});
	} else {
		lib.mergeObjects(_json, {
			password_reset_key : ''
		});
	}
	if (data.hasOwnProperty('password_reset_sent_at')) {
		lib.mergeObjects(_json, {
			password_reset_sent_at : data.password_reset_sent_at
		});
	} else {
		lib.mergeObjects(_json, {
			password_reset_sent_at : ''
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
	util.log('[portal] Processing user account ');
	return createAccountJson(options);
};

Accounts.prototype.create = function(options) {
	util.log('[portal] Ready to post the account');
	return accounts_api.post_accounts(toJson(options));
};

Accounts.prototype.login = function(options) {
	util.log('[portal] Ready to authenticate the user');
	return accounts_api.auth(toJson(options));
};

module.exports = Accounts;
