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


PORTAL.view = function() {

	var space_width = 5000, space_height = 5000, lineCurveScale = 0.75, scaleFactor = 1, node_width = 100, node_height = 200;
	var activeWorkspace = 0;

	$("#connector_submit").click(function() {
		console.log("=========================");
		$("#myModalHorizontal").modal('hide');
		//PORTAL.notify("Saved nodes","success");
		var json = {};
		json["connector"] = $("#connector").val();
		json["dbname"] = $("#dbname").val();
		json["host"] = $("#host").val();
		json["username"] = $("#username").val();
		json["password"] = $("#password").val();
        console.log("=========================");
        console.log(json);
		$.ajax({
			url : "/connectors",
			type : "POST",
			data : JSON.stringify(json),
			contentType : "application/json",
		}).done(function(data, textStatus, xhr) {
			PORTAL.notify("Successfully load all schemas", "success");
			PORTAL.nodes.registerType(data);
			$(".palette-scroll").show();
			$(".palette-spinner").hide();

		}).fail(function(xhr, textStatus, err) {
			PORTAL.notify("<strong>Error</strong>: " + xhr.responseText, "error");
		});
	});
		

	$("#chart").droppable({
		accept : ".palette_node",
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

			nn.name = selected_tool;
			nn._def = PORTAL.nodes.getType(nn.name);

			var alignment = {
				'top' : ui.offset.top,
				'left' : ui.offset.left
			};
			drawTable(nn, alignment);

		}
	});

	function drawTable(nn, alignment) {

		var content = '<div class="window ' + nn._def.name + '" >';
		console.log(nn._def.schemas[0]);

		$.each(nn._def.schemas, function(key, value) {
			content += '<div class="button_container">' + '<div class="button_add ' + nn._def.name + '_' + value + '">' + value + '</div>' + '</div>';
		});

		content += '</div>';
		$(content).css(alignment);
		$('#chart').append(content);
		PORTAL.plumb.plumby(nn, content);

	}

	return {
		drawTable : drawTable,

	};
}();
