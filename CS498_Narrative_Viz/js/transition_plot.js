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
		.attr("y",function(d,i) {return ys(d.new_case);})
        .on("mouseover", function(d) {
			tooltip_div.style("opacity", 1)
			.text( "Date: " + dataFormatter(d.date_use) + "\nDaily Cases: " + d.new_case )
			.style("left", (d3.event.pageX + 10) + "px")            
			.style("top", (d3.event.pageY - 28) + "px")}
			)
		.on("mouseout", function(d) {tooltip_div.style("opacity",0);});
	// plot the new data with transition
	svg.append("g")
		.selectAll("rect").data(data2).enter().append("rect")
		.attr("x",function (d,i) {return xs(d.index);})
		.attr("height",height - ys(0))
		.attr("width",xs.bandwidth())
		.attr("y",function(d,i) {return ys(0);})
		.on("mouseover", function(d) {
			tooltip_div.style("opacity", 1)
			.text( "Date: " + dataFormatter(d.date_use) + "\nDaily Cases: " + d.new_case )
			.style("left", (d3.event.pageX + 10) + "px")            
			.style("top", (d3.event.pageY - 28) + "px")}
			)
		.on("mouseout", function(d) {tooltip_div.style("opacity",0);})
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
	// Add the scatterplot
    svg.selectAll("dot")	
        .data(data1)			
		.enter().append("circle")	
        .attr("r", 5)
		.attr("fill-opacity",0)
		.attr("stroke","black")
        .attr("cx", function(d) { return xs(d.index); })		 
        .attr("cy", function(d) { return ys(d.avg_cases); })
        .on("mouseover", function(d) {
			tooltip_div.style("opacity", 1)
			.text( "Date: " + dataFormatter(d.date_use) + "\nDaily Avg Cases: " + d.avg_cases )
			.style("left", (d3.event.pageX + 10) + "px")            
			.style("top", (d3.event.pageY - 28) + "px")}
			)
		.on("mouseout", function(d) {tooltip_div.style("opacity",0);});
		
	// TODO functionify
	var line_gen = d3.line()
			.x(function(d,i) {return xs(d.index); })
			.y(function(d,i) {return ys(d.avg_cases); });
	var temp_data2 = [];
	for(var i = 0; i < data2.length - 1; i++)
	{
		temp_data2.push(line_gen([data2[i],data2[i+1]]));
	}
	// plot new data with transition
	// need to loop over adding the path because its a unique case
	for (var i = 0; i < temp_data2.length; i++) {
		svg.append("path")
			.datum(temp_data2[i])
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("stroke-width", 1.5)
			.attr("opacity",0)
			.attr("d", temp_data2[i])
			.transition().delay(i*(1500/data2.length))
			.attr("opacity",1)
	}
		

	// Add the scatterplot
    svg.selectAll("dot")	
        .data(data2)			
    .enter().append("circle")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xs(d.index); })		 
        .attr("cy", function(d) { return ys(d.avg_cases); })	
		.attr("opacity",0)
		.attr("fill-opacity",0)
		.attr("stroke","black")
        .on("mouseover", function(d) {
			tooltip_div.style("opacity", 1)
			.text( "Date: " + dataFormatter(d.date_use) + "\nDaily Avg Cases: " + d.avg_cases )
			.style("left", (d3.event.pageX + 10) + "px")            
			.style("top", (d3.event.pageY - 28) + "px")}
			)
		.on("mouseout", function(d) {tooltip_div.style("opacity",0);})
		.transition().delay(function(d,i) {return i*(1500/data2.length);})
		.attr("opacity",1);
		
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
	// Add the scatterplot
    svg.selectAll("dot")	
        .data(data1)			
    .enter().append("circle")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xs(d.index); })		 
        .attr("cy", function(d) { return ys2(d.avg_deaths); })	
		.attr("fill-opacity",0)
		.attr("stroke","green")
        .on("mouseover", function(d) {
			tooltip_div.style("opacity", 1)
			.text( "Date: " + dataFormatter(d.date_use) + "\nDaily Avg Deaths: " + d.avg_deaths )
			.style("left", (d3.event.pageX + 10) + "px")            
			.style("top", (d3.event.pageY - 28) + "px")}
			)
		.on("mouseout", function(d) {tooltip_div.style("opacity",0);});
	
	var line_gen = d3.line()
			.x(function(d,i) {return xs(d.index); })
			.y(function(d,i) {return ys2(d.avg_deaths); });
	var temp_data2 = [];
	for(var i = 0; i < data2.length - 1; i++)
	{
		temp_data2.push(line_gen([data2[i],data2[i+1]]));
	}

	// plot new data with transition
	for (var i = 0; i < temp_data2.length; i++) {
		svg.append("path")
			.datum(temp_data2[i])
			.attr("fill", "none")
			.attr("stroke", "green")
			.attr("stroke-width", 1.5)
			.attr("opacity",0)
			.attr("d", temp_data2[i])
			.transition().delay(i*(1500/data2.length))
			.attr("opacity",1)
	}
		
    svg.selectAll("dot")	
        .data(data2)			
    .enter().append("circle")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xs(d.index); }) 
        .attr("cy", function(d) { return ys2(d.avg_deaths); })
		.attr("opacity",0)
		.attr("fill-opacity",0)
		.attr("stroke","green")
        .on("mouseover", function(d) {
			tooltip_div.style("opacity", 1)
			.text( "Date: " + dataFormatter(d.date_use) + "\nDaily Avg Deaths: " + d.avg_deaths )
			.style("left", (d3.event.pageX + 10) + "px")            
			.style("top", (d3.event.pageY - 28) + "px")}
			)
		.on("mouseout", function(d) {tooltip_div.style("opacity",0);})
		.transition().delay(function(d,i) {return i*(1500/data2.length);})
		.attr("opacity",1);
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
				.style("stroke-dasharray", ("3, 3"))
				.attr("stroke", "black")
				.attr("stroke-width", 1)
				.attr("fill", "none");
		}
	}	
}

// function that takes in data array and returns a path array
function buildPath(data) {
var line_gen = d3.line()
			.x(function(d,i) {return xs(d.index); })
			.y(function(d,i) {return ys(d.avg_cases); });
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
				temp_object.date_use = d.date_use;
				temp_data.push(temp_object);
			}
			
		});	
	return temp_data;
}