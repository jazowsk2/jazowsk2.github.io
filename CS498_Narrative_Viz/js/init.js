async function init() {
const data = await d3.csv(
"https://jazowsk2.github.io/CS498_Narrative_Viz/data/LA_County_Covid19_cases_deaths_date_table.csv").then(function(d) {console.log(d[0])});
var plot_width = 1000;
var plot_height = 1000;
var xs = d3.scaleLinear().domain([1,124]).range([0,plot_width]);
var ys = d3.scaleLinear().domain([0,3500]).range([plot_height,0]);
d3.select("svg").append("g")
.attr("transform","translate(50,50)").selectAll("rect").data(data).enter()
.append("rect").attr("x",function (d,i) {return xs(i);}).attr("height",function(d,i) { return plot_height - ys(d.new_case);})
.attr("width",xs.bandwidth())
//d3.select("svg").append("g").attr("transform","translate(50,50)").call(d3.axisLeft(ys).tickValues([10,20,50,100]).tickFormat(d3.format("~s")))
//d3.select("svg").append("g").attr("transform","translate(50,250)").call(d3.axisBottom(xs).tickValues([10,20,50,100]).tickFormat(d3.format("~s")))
}