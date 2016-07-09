var PORTAL = function() {

	$(function() {
		//localStorage.setItem("workbench", "fooWorkbench") //NOTE: THIS WILL BE REMOVED AND WORKBENCH WILL BE STORED IN MCONNECT
		var chart_selected = '';
		var chartObjs = {};
		var ndata = '';
		var query = '';
		var wb = localStorage.getItem("workbench");

		var count = "count";
		var inc = 0;
		var ctxs = ["chart1", "chart2", "chart3", "chart4", "chart5", "chart6"];
		localStorage.setItem(count, inc);

		google.charts.load('current', {
			'packages' : ['corechart', 'table']
		});
		google.charts.setOnLoadCallback(drawChart);

		function drawChart() {
			initModalCharts();
		}

		function transpose(a) {
			return a[0].map(function(_, c) {
				return a.map(function(r) {
					return r[c];
				});
			});
		}

		//init modal charts with dummy data
		function initModalCharts() {
			var init_data = [['Year', '2014', '2015', '2014', '2013'], ['Expenses', 800, 600, 400, 110], ['Sales', 100, 1170, 555, 1123]];

			var t_data = transpose(init_data);

			var data = google.visualization.arrayToDataTable(t_data);
			ndata = data;
			//  var ndata = '';
			// Set chart options
			/*  var options = {
			 'title': 'How Much Line chart willi draw?',
			 'width': 450,
			 'height': 300
			 }; */

			var options = {
				'title' : 'MeglyticsBI',
				'width' : 475,
				'height' : 350
			};

			chartObjs["BarChart"] = new google.visualization.BarChart(document.getElementById('modal_chart'));
			chartObjs["PieChart"] = new google.visualization.PieChart(document.getElementById('modal_chart'));
			chartObjs["AreaChart"] = new google.visualization.AreaChart(document.getElementById('modal_chart'));
			chartObjs["LineChart"] = new google.visualization.LineChart(document.getElementById('modal_chart'));
			chartObjs["GeoChart"] = new google.visualization.GeoChart(document.getElementById('modal_chart'));
			chartObjs["ColumnChart"] = new google.visualization.ColumnChart(document.getElementById('modal_chart'));
			chartObjs["Table"] = new google.visualization.Table(document.getElementById('modal_chart'));

			$("#modal_area").click(function() {
				chart_selected = 'AreaChart'
				new google.visualization.AreaChart(document.getElementById('modal_chart')).draw(data, options);

				//  chartObjs[chart_selected].draw(data, options);
			});

			$("#modal_pie").click(function() {
				chart_selected = 'PieChart'
				new google.visualization.PieChart(document.getElementById('modal_chart')).draw(data, options);
				//  chartObjs[chart_selected].draw(data, options);
			});

			$("#modal_bar").click(function() {
				chart_selected = 'BarChart'
				new google.visualization.BarChart(document.getElementById('modal_chart')).draw(data, options);

				//chartObjs[chart_selected].draw(data, options);
			});

			$("#modal_line").click(function() {
				chart_selected = 'LineChart'
				new google.visualization.LineChart(document.getElementById('modal_chart')).draw(data, options);

				//chartObjs[chart_selected].draw(data, options);
			});

			$("#modal_geo").click(function() {
				chart_selected = 'GeoChart'
				new google.visualization.GeoChart(document.getElementById('modal_chart')).draw(data, options);

				//chartObjs[chart_selected].draw(data, options);
			});

			$("#modal_column").click(function() {
				chart_selected = 'ColumnChart'
				new google.visualization.ColumnChart(document.getElementById('modal_chart')).draw(data, options);

				//chartObjs[chart_selected].draw(data, options);
			});

			$("#modal_table").click(function() {
				chart_selected = 'Table'
				new google.visualization.Table(document.getElementById('modal_chart')).draw(data, options);

				//  chartObjs[chart_selected].draw(data, options);
			});

			$("#analyze").click(function() {
				query = $("#query").val();
				var d = getQueryData(query);
        console.log("alrighty");
				console.log(d);
				ndata = new google.visualization.arrayToDataTable(d);
				chartObjs[chart_selected].draw(ndata, options);
			});

			$("#save").click(function() {
				var no = check();
				var id = ctxs[no];

				var cs = getChartObject(chart_selected, id);

				cs.draw(ndata, options);

			});
		}

		function getChartObject(c, id) {

			switch (c) {
			case 'AreaChart':
				return new google.visualization.AreaChart(document.getElementById(id));
				break;
			case 'PieChart':
				return new google.visualization.PieChart(document.getElementById(id));
				break;
			case 'BarChart':
				return new google.visualization.BarChart(document.getElementById(id));
				break;
			case 'LineChart':
				return new google.visualization.LineChart(document.getElementById(id));
				break;
			case 'GeoChart':
				return new google.visualization.GeoChart(document.getElementById(id));
				break;
			case 'ColumnChart':
				return new google.visualization.ColumnChart(document.getElementById(id));
				break;
			case 'Table':
				return new google.visualization.Table(document.getElementById(id));
				break;
			}

		};

		function getQueryData(query) {
			var nn = {
				query : query,
				name : PORTAL.nodes.getCurrentWKB(),
			};
			var dd = [];

			$.ajax({
				url : "/workbenches/execute",
				type : "POST",
				async: false,
				data : JSON.stringify(nn),
				contentType : "application/json",
			}).done(function(data, textStatus, xhr) {
				console.log(data);
				dd = data;
			}).fail(function(xhr, textStatus, err) {
				PORTAL.notify("<strong>Error</strong>: " + xhr.responseText, "danger");
			});

			return transpose(dd)

		};

		function check() {
			//if goes exceeds more than 4, reset it to 1
			var c = localStorage.getItem(count);
			var cnt = parseInt(c);
			if (c != 5) {
				cnt++;
				localStorage.setItem(count, cnt)
				return c
			} else if (c == 5) {
				localStorage.setItem(count, 0)
				return c
			}
		};

		$("#report").click(function() {
			$.ajax({
				type : 'GET',
				url : '/report',
				async : false,
			});
		});
	});

	return {
	};
}();
