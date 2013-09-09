var drawGraph = function(chart_id, series_data, y_axis_id, legend_id, y_label_id, y_label_text, graph_type) { // graph_type: {1: salary, 2: industry, 3: openings}
	var graph = new Rickshaw.Graph({
	  element: document.querySelector(chart_id),
	  renderer: 'multi',
	  stroke: true,
	  width: 500,
	  height: 500,
	  //series:[{
	  //  name: "Insert name here",
	  //  data: {{insert_obj seriesData}},
	  //  color: 'steelblue'
	  //}]
	  series: series_data
	});

	var x_axis = new Rickshaw.Graph.Axis.Time({graph: graph});
	var y_axis = new Rickshaw.Graph.Axis.Y( {
		graph: graph,
		orientation: 'left',
		tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
		element: document.getElementById(y_axis_id)
	});

	var legend = new Rickshaw.Graph.Legend( {
		element: document.querySelector(legend_id),
		graph:graph
	});

	var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
		graph: graph,
		legend: legend
	});

	var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
		graph: graph,
		legend: legend
	});

	if (graph_type == 1) {
	  var hoverDetail = new Rickshaw.Graph.HoverDetail({
		graph: graph,
		xFormatter: function(x){return (new Date(x*1000).getFullYear()) + 1},
		yFormatter: function(y) {
		  return '$' + y.toFixed(2);
		}
	  });
	}

	else if (graph_type == 2) {
	  var hoverDetail = new Rickshaw.Graph.HoverDetail({
	    graph: graph,
	    xFormatter: function(x){return (new Date(x*1000).getFullYear()) + 1}});
	   
	  
	}

	else if (graph_type == 3) {
	  var hoverDetail = new Rickshaw.Graph.HoverDetail({
	    graph: graph,
	    xFormatter: function(x){return (new Date(x*1000).getFullYear()) + 1},
	    yFormatter: function(y) {
	      return "Job Openings: " + y.toFixed(2) + "%";
	    
	    }
	  });



	}

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

}

