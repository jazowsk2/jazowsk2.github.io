var tooltip_div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
var dataFormatter = d3.timeFormat("%x");