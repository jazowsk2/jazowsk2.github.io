async function init() {  
	data = await d3.csv(
	'https://jazowsk2.github.io/CS498_Narrative_Viz/data/LA_County_Covid19_cases_deaths_date_table.csv');
	
	// convert strings to int
	data.forEach(function(d) {
			d.index = +d.index;
			d.date_use = d3.timeParse("%m/%d/%Y")(d.date_use);
			d.total_cases = +d.total_cases;
			d.new_case = +d.new_case;
			d.avg_cases = +d.avg_cases;
			d.total_deaths = +d.total_deaths;
			d.new_deaths = +d.new_deaths;
			d.avg_deaths = +d.avg_deaths;
			data_index = data_index.concat(d.index);
		});	
	
	// set state machine to slide 0
	state_machine(0);
}

// function that plots the overview
function overview_plot() {
	// change the header text
	d3.select("h2").text(header[0]);
	document.getElementById("sub_text").innerText = text[0];
	
	// plot the overview slide which shows cumulative cases and deaths	  
	// add the cumulative cases
	var case_max = Math.max.apply(Math,data.map(function(o) {return o.total_cases}));
	var idx_max = Math.max.apply(Math,data.map(function(o) {return o.index}));
	var xs = d3.scaleLinear().domain([1,idx_max]).range([0,width]);
	var ys = d3.scaleLinear().domain([0,case_max]).range([height,0]);
	// Add the cases line
    svg.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("stroke", "black")
	.attr("stroke-width", 1.5)
	.attr("d", d3.line()
		.x(function(d) { return xs(d.index) })
		.y(function(d) { return ys(d.total_cases) })
		)

	// Add the scatterplot
    svg.selectAll("dot")	
        .data(data)			
    .enter().append("circle")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xs(d.index); })		 
        .attr("cy", function(d) { return ys(d.total_cases); })	
		.attr("fill-opacity",0)
		.attr("stroke","black")
        .on("mouseover", function(d) {
			tooltip_div.style("opacity", 1)
			.text( "Date: " + dataFormatter(d.date_use) + "\nTotal Cases: " + d.total_cases )
			.style("left", (d3.event.pageX + 10) + "px")            
			.style("top", (d3.event.pageY - 28) + "px")}
			)
		.on("mouseout", function(d) {tooltip_div.style("opacity",0);});

	// Add cases axis
	svg.append("g")
		.call(d3.axisLeft(ys).tickValues(getTicks(0,case_max,5)).tickFormat(d3.format("~s")));
	// Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date_use; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform","translate(0,"+height+")")
      .call(d3.axisBottom(x));
	  
	// Add the deaths line
	var death_max = Math.max.apply(Math,data.map(function(o) {return o.total_deaths}));
	var ys2 = d3.scaleLinear().domain([0,death_max]).range([height,0]);
    svg.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "green")
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
			.x(function(d) { return xs(d.index) })
			.y(function(d) { return ys2(d.total_deaths) })
		)
	
    // Add the scatterplot
    svg.selectAll("dot")	
        .data(data)			
    .enter().append("circle")								
        .attr("r", 5)		
        .attr("cx", function(d) { return xs(d.index); })		 
        .attr("cy", function(d) { return ys2(d.total_deaths); })	
		.attr("fill-opacity",0)
		.attr("stroke","green")
        .on("mouseover", showTooltip)
		.on("mouseout", removeTooltip);
		
		// add deaths axis
	svg.append("g").attr("transform","translate("+width+",0)")
		.call(d3.axisRight(ys2).tickValues(getTicks(0,death_max,5)).tickFormat(d3.format("~s")));
		
	// add a legend
	var keys = ["Total Cases", "Total Deaths"];

	// Usually you have a color scale in your chart already
	var color = d3.scaleOrdinal()
	  .domain(keys)
	  .range(["black","green"]);

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
		.style("alignment-baseline", "middle")	;

	// Add axis labels
	svg.append("text")      // text label for the x axis
        .attr("x", width/2 )
        .attr("y",  height + margin.bottom)
        .style("text-anchor", "middle")
		.attr("font-size", "18px")
        .style("text-anchor", "middle")		
        .text("Date");

	svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
		.attr("font-family", "serif")
        .attr("font-size", "18px")
        .style("text-anchor", "middle")
        .text("Total cases");
		
	svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + legend_offset)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
		.attr("font-family", "serif")
        .attr("font-size", "18px")
        .style("text-anchor", "middle")
        .text("Total deaths");
		
	// add textbox explaning tooltip
	svg.append("text") 
		.attr("x", width/2)
		.attr("y",  height/4)
		.style("text-anchor", "middle")
		.style("background", "lightsteelblue")
		.attr("font-family", "serif")
		.attr("font-size", "14px")
		.text("Hover over data for details");
}

// callback function on mouseout to remove tooltip
function removeTooltip(d) {tooltip_div.style("opacity",0);}

// callback function on mouseover to add tooltip
function showTooltip(d) {
	tooltip_div.style("opacity", 1)
	.text( "Date: " + dataFormatter(d.date_use) + "\nTotal Deaths: " + d.total_deaths )
	.style("left", (d3.event.pageX + 10) + "px")            
	.style("top", (d3.event.pageY - 28) + "px")
}
// function that returns evenly spaced tick values 
// between min and max, and amount cnt
function getTicks(min,max,cnt) {
	var chnk = Math.round((max - min)/cnt);
	var array = [];
	var val = min;
	for (i = 0; i < cnt; i++) {
		array.push(val);
		val += chnk;
	}
	// add max value as last item
	array.push(max);
	return array;
}