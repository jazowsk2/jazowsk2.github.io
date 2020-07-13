function transition_plot(slide_idx) {
	// change the header text
	d3.select("h2").text(header[slide_idx]);
	document.getElementById("sub_text").innerText = text[slide_idx];
		
	// add the bar graph
	var case_max = Math.max.apply(Math,data.map(function(o) {return o.new_case}));
	var xs = d3.scaleBand().domain(data_index).range([0,width]);
	var ys = d3.scaleLinear().domain([0,case_max]).range([height,0]);
	
	// extract data based on slide number
	var data1 = extractData(dates[0],dates[slide_idx-1]); // data that will be started from
	var data2 = extractData(dates[slide_idx-1],dates[slide_idx]); // data that will be transitioned
	
	// plot the data already plotted
	svg.append("g")
		.selectAll("rect").data(data1).enter().append("rect")
		.attr("x",function (d,i) {return xs(d.index);})
		.attr("height",function(d,i) {return height - ys(d.new_case);})
		.attr("width",xs.bandwidth())
		.attr("y",function(d,i) {return ys(d.new_case);});
	// plot the new data with transition
	svg.append("g")
		.selectAll("rect").data(data2).enter().append("rect")
		.attr("x",function (d,i) {return xs(d.index);})
		.attr("height",height - ys(0))
		.attr("width",xs.bandwidth())
		.attr("y",function(d,i) {return ys(0);})
		.transition().delay(function(d,i) {return i*(1500/data2.length);})
		.attr("x",function (d,i) {return xs(d.index);})
		.attr("height",function(d,i) {return height - ys(d.new_case);})
		.attr("y",function(d,i) {return ys(d.new_case);});
		
	// Add cases axis
	svg.append("g")
		.call(d3.axisLeft(ys).tickValues(getTicks(0,case_max,5)).tickFormat(d3.format("~s")));
	  
	// Add the cases line
	// plot old data first
    svg.append("path")
		.datum(data1)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
			.x(function(d,i) {return xs(d.index);})
			.y(function(d,i) {return ys(d.avg_cases);})
        );
	// plot new data with transition
    svg.append("path")
		.datum(data2)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
			.x(xs(data2[0].index))
			.y(ys(data2[0].avg_cases))
        )
		.transition().duration(2000)
	    .attr("d", d3.line()
			.x(function(d,i) {return xs(d.index); })
			.y(function(d,i) {return ys(d.avg_cases); })
        );

	// Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date_use; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform","translate(0,"+height+")")
      .call(d3.axisBottom(x));
	  
	  
	// Add the deaths line
	var death_max = Math.max.apply(Math,data.map(function(o) {return o.avg_deaths}));
		var ys2 = d3.scaleLinear().domain([0,death_max]).range([height,0]);
	// plot old data
    svg.append("path")
      .datum(data1)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
	  .attr("d", d3.line()
        .x(function(d,i) {return xs(d.index) }) 
        .y(function(d,i) {return ys2(d.avg_deaths) })
        );
	// plot new data with transition
    svg.append("path")
      .datum(data2)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
	  .attr("d", d3.line()
        .x(xs(data2[0].index)) 
        .y(ys2(data2[0].avg_deaths))
        )
	  .transition().duration(2000)
      .attr("d", d3.line()
        .x(function(d,i) {return xs(d.index) }) 
        .y(function(d,i) {return ys2(d.avg_deaths) })
        );	
		
	// add deaths axis
	svg.append("g").attr("transform","translate("+width+",0)")
		.call(d3.axisRight(ys2).tickValues(getTicks(0,death_max,5)).tickFormat(d3.format("~s")));
	
	// add a legend
	var keys = ["7-Day Average New Cases", "7-Day Average Deaths","Daily New Cases", ];

	// Usually you have a color scale in your chart already
	var color = d3.scaleOrdinal()
	  .domain(keys)
	  .range(["black","green","lightblue"]);

	// Add one dot in the legend for each name.
	var size = 15;
	svg.append("g")
		.attr("transform","translate("+width+",0)")
		.selectAll("mydots")
		.data(keys)
		.enter()
		.append("rect")
		.attr("x",legend_offset)
		.attr("y", function(d,i){ return legend_offset + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
		.attr("width", size)
		.attr("height", size)
		.style("fill", function(d){ return color(d)});

	// Add one dot in the legend for each name.
	svg.append("g")
		.attr("transform","translate("+width+",0)")
		.selectAll("mylabels")
		.data(keys)
		.enter()
		.append("text")
		.attr("x", legend_offset + size*1.2)
		.attr("y", function(d,i){ return legend_offset + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
		.style("fill", "black")
		.text(function(d){ return d})
		.attr("text-anchor", "left")
		.style("alignment-baseline", "middle");
		
	// Add axis labels
	svg.append("text")      // text label for the x axis
        .attr("x", width/2 )
        .attr("y",  height + margin.bottom)
        .style("text-anchor", "middle")
		.attr("font-family", "serif")
        .attr("font-size", "18px")
        .text("Date");
		
	svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
		.attr("font-family", "serif")
        .attr("font-size", "18px")
        .style("text-anchor", "middle")
        .text("Daily New Cases");
		
	svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + legend_offset)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
		.attr("font-family", "serif")
        .attr("font-size", "18px")
        .style("text-anchor", "middle")
        .text("New Deaths");	

	// Add annotation to the chart
	for (var i = 1; i < slide_idx + 1;i++) {
		if (i < 4) {
			var temp_data = extractData(dates[i],dates[i]);
			// get the x location of our three annotations
			var x_loc = xs(temp_data[0].index);
			var y_loc = ys(temp_data[0].avg_cases);

			// annotation text
			svg.append("text") 
				.attr("x", x_loc )
				.attr("y",  y_loc - annotations[i-1].y)
				.style("text-anchor", "middle")
				.attr("font-family", "serif")
				.attr("font-size", "14px")
				.text(annotations[i-1].label);
			// path	
			var lineFunction = d3.line()
				 .x(function(d) { return d.x; })
				 .y(function(d) { return d.y; });
			
			var endpoints = [{x:x_loc,y:height},{x:x_loc,y: y_loc - annotations[i-1].y + 10}	];
			svg.append("path")
				.attr("d", lineFunction(endpoints))
				.attr("stroke", "black")
				.attr("stroke-width", 1)
				.attr("fill", "none");
		}
	}	
}

// function that extracts data between two points
function extractData(start_date,end_date) {
	var temp_data = [];
	var end_time;
	var start_time = d3.timeParse("%m/%d/%Y")(start_date)
	// if end_date is present, go through end of data set
	if (end_date == "present")
		end_time = data[data.length - 1].date_use;
	else
		end_time = d3.timeParse("%m/%d/%Y")(end_date);
		
	data.forEach(function(d,i) {
			if (d.date_use <= end_time && d.date_use >= start_time) {
				var temp_object = new Object();
				temp_object.index = d.index;
				temp_object.total_cases = d.total_cases;
				temp_object.new_case = d.new_case;
				temp_object.avg_cases = d.avg_cases;
				temp_object.total_deaths = d.total_deaths;
				temp_object.new_deaths = d.new_deaths;
				temp_object.avg_deaths = d.avg_deaths;
				temp_data.push(temp_object);
			}
			
		});	
	return temp_data;
}