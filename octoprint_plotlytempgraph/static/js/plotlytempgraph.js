/*
 * View model for OctoPrint-PlotlyTempGraph
 *
 * Author: jneilliii
 * License: AGPLv3
 */
$(function() {
	function PlotlytempgraphViewModel(parameters) {
		var self = this;

		self.loginStateViewModel = parameters[0];

		self.data = [];
		self.layout = {
			autosize: true,
			showlegend: true,
			legend: {"orientation": "h"},
			xaxis: { type:"date", tickformat:"%H:%M:%S", automargin: true, title: {standoff: 0},linecolor: 'black', linewidth: 2, mirror: true},
			yaxis: { type:"linear", automargin: true, title: {standoff: 0},linecolor: 'black', linewidth: 2, mirror: true },
			margin: {l:0,r:30,b:0,t:20,pad:5}
		};
		self.options = {
			showLink: false,
			sendData: false,
			displaylogo: false,
			displayModeBar: false,
			editable: false,
			showTips: false
		};

		Plotly.newPlot('plotlytempgraph', self.data, self.layout, self.options);

		self.onDataUpdaterPluginMessage = function(plugin, data) {
			if (plugin != "plotlytempgraph") {
				return;
			}
			var timestamp = new Date();

			var d3colors = Plotly.d3.scale.category10();

			for (var key in data) {
				for(var i=0;i<data[key].length;i++){
					var gd = document.getElementById('plotlytempgraph').data;
					var index = gd.findIndex( ({ name }) => name === key);
					if(index < 0 && data[key][i]){
						Plotly.addTraces('plotlytempgraph',{name:key,x:[[timestamp]],y:[[data[key][i]]],mode: 'lines'});
					} else {
						Plotly.extendTraces('plotlytempgraph', {x: [[timestamp]], y: [[data[key][i]]]}, [index]);
					}
				}
			}
		};
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: PlotlytempgraphViewModel,
		dependencies: [ "loginStateViewModel" ],
		elements: [ /* ... */ ]
	});
});
