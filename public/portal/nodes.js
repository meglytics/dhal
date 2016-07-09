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

//var randomWords = require('random-words');

PORTAL.nodes = function() {

	var node_defs = {};
	var nodes = [];
	var configNodes = {};
	var links = [];
	var defaultWorkspace;
	var workspaces = {};
	var sources = [];
	var obj = JSON.parse("{}");
	var currentWKB = "";
	
	function addSource(s) {
		sources.push(s);
	}
	
	function getSources() {
		return sources;
	}

	function registerType(def, s_id) {
		for (var i = 0; i < def.length; i++) {
			node_defs[def[i].name] = def[i];
			def[i]["source_id"] = s_id; 
			// TODO: too tightly coupled into palette UI
			PORTAL.palette.add(def[i]);
		}
	}

	function getType(name) {
		return node_defs[name];
	}

	function addNode(n) {
		nodes.push(n);
	}
	
	function getNodes() {
		return nodes;
	}
	
	function getExportNodes(wkbname) {
		var connectors = [];
		for (var i = 0; i < sources.length; i++) {
		    var connector = {};
		    connector["source"] = sources[i].source;
		    connector["endpoint"] = sources[i].host;
		    connector["dbname"] = sources[i].dbname;
		    connector["port"] = "3306";
		    connector["inputs"] = [];
		    connector["inputs"].push({key:"username", value: sources[i].username});
		    connector["inputs"].push({key:"password", value: sources[i].password});	
		    connector["tables"] = [];	
		    for (var j = 0; j < nodes.length; j++) {
		    	if(sources[i].id == nodes[j]._def.source_id) {
		    		var scs = [];
		    		for (var k=0; k<nodes[j]._def.schemas.length; k++) {
		    			scs.push({key:nodes[j]._def.schemas[k], value:nodes[j]._def.schemas[k]});
		    		}
		    		connector["tables"].push({
		    			name : nodes[j]._def.name,
		    			table_id : nodes[j].id,
		    			schemas : scs,
		    			links : [],
		    		});
		    	}
		    }
		    connectors.push(connector);
		}
		
		return {
			name: wkbname,
			connectors : connectors,
			};
	}
	
	function registerWKB(name) {
		currentWKB = name;
	}	
	
	function getCurrentWKB() {
		return currentWKB;
	}

	return {
		registerType : registerType,
		getType : getType,
		getNodes : getNodes,
		add : addNode,
		addSource : addSource,
		getSources : getSources,
		getExportNodes : getExportNodes,
		registerWKB : registerWKB,
		getCurrentWKB : getCurrentWKB
	};
}();
