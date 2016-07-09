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
var session = require('express-session');
var util = require('util');
var app = express();
var bodyParser = require('body-parser');
var events = require("./events");
var connectors = require("./connectors/connector")
var Accounts = require("./../lib/megam/core/accounts.js");
var Workbenches = require("./../lib/megam/core/workbenches.js");
var lib = require("./lib.js");
var path = require("path");
var flash = require('connect-flash');
var icon_paths = [path.resolve(__dirname + '/../public/icons')];
var htmlToPdf = require('html-to-pdf');

function setupUI(settings) {

	var iconCache = {};
	var defaultIcon = path.resolve(__dirname + '/../public/icons/arrow-in.png');
	//app.use("/", express.static(__dirname + '/../public'));

	app.use(bodyParser.json());

	app.use(bodyParser.urlencoded({
		extended : true
	}));

	app.use(session({
		secret : 'MEGAMMEGLYTICS'
	}));

	app.use(express.static(path.join(__dirname, '/../public')));
	app.set('views', __dirname + '/../views');
	app.engine('html', require('ejs').renderFile);

	app.use(flash());

	app.get("/", function(req, res) {
		util.log('[portal] Loading index page ');
		if (req.session.password) {
			res.redirect("/mconnect");
		} else {
			res.render('index.html', {
				message : req.flash('message')
			});
		}
	});

	app.get("/signout", function(req, res) {
		req.session.destroy();
		res.redirect("/");
		//toastr.info('Have fun.');
	});

	app.post("/signin", function(req, res) {
		var json = req.body;
		var acc = new Accounts(json.email, json.password);
		util.log('[portal] User signin with this email > ' + json.email);
		acc.login(json).then(function(result) {
			util.log('[portal] User login successfully');
			req.session.email = json.email;
			req.session.password = json.password;
			//res.redirect("/mconnect");
			res.send(200);
		}).otherwise(function(err) {
			util.log('[portal] Error occured > ' + err);
			//req.flash('message', err);
			//res.redirect("/");
			res.send(500, err);
		})
	})

	app.post("/signup", function(req, res) {
		var json = req.body;
		var acc = new Accounts(json.email, json.password);
		util.log('[portal] User sigunup with this email > ' + json.email);
		acc.create(json).then(function(result) {
			util.log('[portal] User onboard successfully');
			req.session.email = json.email;
			req.session.password = json.password;
			//res.redirect("/mconnect");
			res.send(200);
		}).otherwise(function(err) {
			util.log('[portal] Error occured > ' + err);
			//req.flash('message', err)
			//res.redirect("/");
			res.send(500, err);
		});
	});

	app.post("/workbenches/content", function(req, res) {
		if (req.session.password) {
			var json = req.body;
			var wkb = new Workbenches(req.session.email, req.session.password);
			util.log('[portal] User email > ' + json.email);
			wkb.create(json).then(function(result) {
				util.log('[portal] workbenches stored successfully');
				req.session.wkb_name = json.name;
				res.send(200);
			}).otherwise(function(err) {
				util.log('[portal] Error occured > ' + err);
				res.send(500, err);
			});
		} else {
			res.render('index.html', {
				message : req.flash('message')
			});
		}
	});

	app.post("/workbenches/execute", function(req, res) {
		if (req.session.password) {
			var json = req.body;
			var wkb = new Workbenches(req.session.email, req.session.password);
			util.log('[portal] User email > ' + json.email);
			wkb.execute(json).then(function(result) {
				util.log('[portal] workbenches executed successfully');

				var oo = JSON.parse(result);
          util.log(req.body.query.split(" "));
    var qr = req.body.query.split(" ");

		/*	var oo = {
		      "result": [
		      [ 4, 4, 4, 6, 1, 2, 2, 2, 2 ],
					[ 411, 411, 411, 411, 50, 40, 40, 40, 40 ]

		      ]
		    }; */

				var arr = [];
				var inc = 0;
				for (elem in oo['result']) {

				var n = oo['result'][elem].concat(qr[inc]);
				console.log(n);

					arr.push(move(n.length -1, 0, n));

					inc += 1;
				}

				res.send(arr)

			}).otherwise(function(err) {
				util.log('[portal] Error occured > ' + err);
				res.send(500, err);
			});
		} else {
			res.render('index.html', {
				message : req.flash('message')
			});
		}

	});

	move = function (old_index, new_index, arr) {
   if (new_index >= arr.length) {
       var k = new_index - arr.length;
       while ((k--) + 1) {
           arr.push(undefined);
       }
   }
   arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
   return arr; // for testing purposes
};

	app.get("/mconnect", function(req, res) {
		if (req.session.password) {
			res.render('mconnect.html');
		} else {
			res.redirect('/');
		}
	});

	app.get("/bizviz", function(req, res) {
		if (req.session.password) {
			if (req.session.wkb_name) {
				res.render('bizviz.html');
			} else {
				res.redirect('/mconnect');
			}
		} else {
			res.redirect('/');
		}
	});

	app.post("/connectors", function(req, res) {
		connectors.init(req.body);
		connectors.getConnection().then(function(connection) {
			connectors.getData(connection).then(function(result) {
				res.send(result);
			}).otherwise(function(err) {
				res.status(500).send(err);
			});
		}).otherwise(function(err) {
			res.status(500).send(err);
		});
	});

	return app;
}

module.exports = setupUI;
