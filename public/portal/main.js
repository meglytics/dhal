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

var PORTAL = function() {

	$(function() {
		var space_width = 5000, space_height = 5000, lineCurveScale = 0.75, scaleFactor = 1, node_width = 100, node_height = 200;
		var activeWorkspace = 0;				
		
		$("#connector_submit").click(function() {

			var isValid = true;
			$('#dbname,#host,#username,#password').each(function() {
				if ($.trim($(this).val()) == '') {
					isValid = false;
					$(this).css({
						"border" : "1px solid red",
						"background" : "#FFCECE"
					});
				} else {
					$(this).css({
						"border" : "",
						"background" : ""
					});
				}
			});
			if (isValid == false)
				e.preventDefault();

			$("#myModalHorizontal").modal('hide');
            NProgress.start();
			var json = {};
			json["connector"] = $("#connector").val();
			json["dbname"] = $("#dbname").val();
			json["host"] = $("#host").val();
			json["username"] = $("#username").val();
			json["password"] = $("#password").val();

			$.ajax({
				url : "/connectors",
				type : "POST",
				data : JSON.stringify(json),
				contentType : "application/json",
			}).done(function(data, textStatus, xhr) {
				NProgress.done();
				PORTAL.notify("Successfully load all schemas", "success");
				var ss = {
					id : (1 + Math.random() * 4294967295).toString(16),
					source : json.connector,
					dbname : json.dbname,
					host : json.host,
					username : json.username,
					password : json.password,
				};
				PORTAL.nodes.addSource(ss);
				PORTAL.nodes.registerType(data, ss.id);
				$(".palette-scroll").show();
				$(".palette-spinner").hide();

			}).fail(function(xhr, textStatus, err) {
				NProgress.done();
				PORTAL.notify("<strong>Error</strong>: " + xhr.responseText, "danger");
			});
		});

		$("#wkb_save").click(function() {
			var isValid = true;
			$('#wkbname').each(function() {
				if ($.trim($(this).val()) == '') {
					isValid = false;
					$(this).css({
						"border" : "1px solid red",
						"background" : "#FFCECE"
					});
				} else {
					$(this).css({
						"border" : "",
						"background" : ""
					});
				}
			});
			if (isValid == false)
				e.preventDefault();

			$("#myModalNorm").modal('hide');
			NProgress.start();
			nn = PORTAL.nodes.getExportNodes($("#wkbname").val());
			$.ajax({
				url : "/workbenches/content",
				type : "POST",
				data : JSON.stringify(nn),
				contentType : "application/json",
			}).done(function(data, textStatus, xhr) {
				NProgress.done();
				PORTAL.notify("Successfully stored workbench", "success");
				PORTAL.nodes.registerWKB($("#wkbname").val());
			}).fail(function(xhr, textStatus, err) {
				NProgress.done();
				PORTAL.notify("<strong>Error</strong>: " + xhr.responseText, "danger");
			});
		});

		$("#bizvizpage").click(function() {
			NProgress.start();
			if (PORTAL.nodes.getCurrentWKB()) {
				NProgress.done();
				window.location.replace("/bizviz");
			} else {
				NProgress.done();
				PORTAL.notify("<strong>Warning</strong>: Generate Workbench and save it first.", "warning");
			}
		});

		$("#savewkb").click(function() {
			if (PORTAL.nodes.getNodes().length == 0) {
				PORTAL.notify("<strong>Warning</strong>: Nothing to save. Drag & Drop tables first", "warning");
			} else {
				$('#myModalNorm').modal('show');
			}
		});

		$("#chart").droppable({
			accept : ".schema_node",
			drop : function(event, ui) {
				d3.event = event;
				var selected_tool = ui.draggable[0].type;
				var mousePos = d3.touches(this)[0] || d3.mouse(this);
				mousePos[1] += this.scrollTop;
				mousePos[0] += this.scrollLeft;
				mousePos[1] /= scaleFactor;
				mousePos[0] /= scaleFactor;

				var nn = {
					id : (1 + Math.random() * 4294967295).toString(16),
					x : mousePos[0],
					y : mousePos[1],
					w : node_width,
					z : activeWorkspace
				};
				$("#chart_disable").hide();
				nn.name = selected_tool;
				nn._def = PORTAL.nodes.getType(nn.name);

				var alignment = {
					'top' : ui.offset.top,
					'left' : ui.offset.left
				};

				PORTAL.nodes.add(nn);
				drawTable(nn, alignment);

			}
		});

		function drawTable(nn, alignment) {

			var content = '<div class="window ' + nn._def.name + '" >';
			content += '<div class="button_container">' + '<div class="window_head">' + nn._def.name + '</div>' + '</div>';
			$.each(nn._def.schemas, function(key, value) {
				content += '<div class="button_container">' + '<div class="button_add ' + nn._def.name + '_' + value + '">' + value + '</div>' + '</div>';
			});

			content += '</div>';
			$(content).css(alignment);
			$('#chart').append(content);
			PORTAL.plumb.plumby(nn, content);
		}		

	});

	return {
	};
}();
