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

PORTAL.plumb = function() {	

  var refresh_all = function() {
    jsPlumb.repaintEverything();
};

	function plumby(nn, el) {

		jsPlumb.ready(function() {

			jsPlumb.importDefaults({
				Container : $("body"),
				Endpoints : [["Dot", {
					radius : 2
				}], ["Dot", {
					radius : 3
				}]],
				Anchor : "Continuous",
				HoverPaintStyle : {
					strokeStyle : "#1e8151",
					lineWidth : 5
				},
				ConnectionOverlays : [],
				//Connector : ["Flowchart", {
				//	stub : 20,
				//	alwaysRespectStubs : true
				//}],
				PaintStyle : {
					lineWidth : 5,
					strokeStyle : '#5c96bc'
				},
			});

			jsPlumb.draggable($("." + nn._def.name));

			var anEndpointDestination = {
				endpoint : ["Dot", {
					radius : 7
				}],
				isSource : true,
				isTarget : true,
				connectorStyle : {
					lineWidth : 3,
					strokeStyle : 'blue'
				},
				maxConnections : 10,

				anchors : ["Right", "Left"],
				dropOptions : {
					drop : function(e, ui) {
						var connectionList = jsPlumb.getConnections(this);
						//console.log(connectionList);
					}
				}
			};

			 $.each(nn._def.schemas, function( key, value ) {			 	
				var parentnode = $("."+nn._def.name+"_"+value)[0];
				jsPlumb.addEndpoint(parentnode, anEndpointDestination);
				var endpoints = jsPlumb.getEndpoints(parentnode);
				//console.log(endpoints[0].elementId);
			});
			
         refresh_all();
		
		});
	}

	return {
		plumby : plumby
	};

}();
