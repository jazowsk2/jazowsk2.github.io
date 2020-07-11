async function init() {
	var data_index = [];
	const data = await d3.csv(
	'https://jazowsk2.github.io/CS498_Narrative_Viz/data/LA_County_Covid19_cases_deaths_date_table.csv');
	
	// convert strings to int
	data.forEach(function(d) {
			d.index = +d.index;
			d.total_cases = +d.total_cases;
			d.new_case = +d.new_case;
			d.avg_cases = +d.avg_cases;
			d.total_deaths = +d.total_deaths;
			d.new_deaths = +d.new_deaths;
			d.avg_deaths = +d.avg_deaths;
			data_index = data_index.concat(d.index);
		});	
	var plot_width = 600;
	var plot_height = 500;
	var case_max = Math.max.apply(Math,data.map(function(o) {return o.new_case}));
	var xs = d3.scaleBand().domain(data_index).range([0,plot_width]);
	var ys = d3.scaleLinear().domain([0,case_max]).range([plot_height,0]);

	d3.select("svg").append("g").attr("transform","translate(50,50)")
	.selectAll("rect").data(data).enter().append("rect")
	.attr("x",function (d,i) {return xs(d.index);}).attr("height",function(d,i) { return plot_height - ys(d.new_case);})
	.attr("width",xs.bandwidth()).attr("y",function(d,i) { return ys(d.new_case);});
	d3.select("svg").append("g").attr("transform","translate(50,50)").call(d3.axisLeft(ys).tickValues([0,1000,2000,case_max]).tickFormat(d3.format("~s")));
	d3.select("svg").append("g").attr("transform","translate(50,550)").call(d3.axisBottom(xs).tickValues([0,40,80,120]).tickFormat(d3.format("~s")));
	
	// Add the line
    d3.select("svg").append("path").attr("transform","translate(50,50)")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return xs(d.index) })
        .y(function(d) { return ys(d.avg_cases) })
        )
}