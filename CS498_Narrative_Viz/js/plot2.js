function plot2() {
	// change the header text
	d3.select("h2").text("The Beginning");
	document.getElementById("sub_text").innerText = "As new cases and deaths began to grow \
		without any hope of stopping the spread, LA county officials enacted a stay at home order.";
		
	// add the bar graph
	var case_max = Math.max.apply(Math,data.map(function(o) {return o.new_case}));
	var xs = d3.scaleBand().domain(data_index).range([0,width]);
	var ys = d3.scaleLinear().domain([0,case_max]).range([height,0]);

	svg.append("g")
		.selectAll("rect").data(data).enter().append("rect")
		.attr("x",function (d,i) {return xs(d.index);}).attr("height",function(d,i) { return height - ys(d.new_case);})
		.attr("width",xs.bandwidth()).attr("y",function(d,i) { return ys(d.new_case);});
		
	// Add cases axis
	svg.append("g")
		.call(d3.axisLeft(ys).tickValues(getTicks(0,case_max,5)).tickFormat(d3.format("~s")));
	  
	// Add the cases line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return xs(d.index) })
        .y(function(d) { return ys(d.avg_cases) })
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
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return xs(d.index) })
        .y(function(d) { return ys2(d.avg_deaths) })
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
}