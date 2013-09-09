var drawGraphCombined = function(chart_id, series_data, y_axis_id, legend_id, y_label_id, y_label_text) {
	var graph = new Rickshaw.Graph({
	  element: document.querySelector(chart_id),
	  renderer: 'scatterplot',
	  stroke: true,
	  width: 500,
	  height: 500,
	  //series:[{
	  //  name: "Insert name here",
	  //  data: {{insert_obj seriesData}},
	  //  color: 'steelblue'
	  //}]
	  series: series_data,
	  renderer: 'multi',
	  min: 'auto'
	});

	//var x_axis = new Rickshaw.Graph.Axis.Time({graph: graph});
	var y_axis = new Rickshaw.Graph.Axis.Y( {
		graph: graph,
		orientation: 'left',
		//tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
		tickFormat: function(x) { return x*100;},
		element: document.getElementById(y_axis_id)
	});

	var x_axis = new Rickshaw.Graph.Axis.X({
		graph: graph,
		tickFormat: function(x) { return x * 100;}
	});

	//var legend = new Rickshaw.Graph.Legend( {
	//	element: document.querySelector(legend_id),
	//	graph:graph
	//});

	//var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
	//	graph: graph,
	//	legend: legend
	//});

	//var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
	//	graph: graph,
	//	legend: legend
	//});

	var hoverDetail = new Rickshaw.Graph.HoverDetail({
		graph: graph,
		xFormatter: function(x){
		  //var roundX = Math.round(x*100) / 100;
		  return 'Industry Growth: ' + (x*100).toFixed(2) + '%';
		},
		yFormatter: function(y) {
		  //var roundY = Math.round(y*100) / 100;
		  return 'Salary growth: ' + (y*100).toFixed(2) + '%';
		}
		//xFormatter: function(x){return (new Date(x*1000).getFullYear()) + 1}
	});

	graph.render();

	var text = d3.select(y_label_id)
	  .append("svg")
	//.append("g")
	     // .attr("class", "y axis")
	     // .call(yAxis)
	    .append("svg:text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 1)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text(y_label_text);


	//var x_text = d3.select("#x_label")
	//    .append("svg")
	//    .append("svg:text")
	//    .attr("y", 1)
	//    .attr("dy", ".71em")
	    //.style("text-anchor", "end")
	//    .text("Percent change in number of workers in industry");

}

