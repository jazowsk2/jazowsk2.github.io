// this file contains global variables for the page
var data; // only load the data once
var slide_num = 0; // parameter to change between slides
var num_slides = 5; // set the number of slides
var data_index = []; // array used to store data indexs from file
var legend_offset = 30; // how much to offset the legend
	
// set the svg only once and specify the margins
// set the dimensions and margins of the graph
var margin = {top: 30, right: 250, bottom: 50, left: 50},
	width = 1300 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform","translate(" + margin.left + "," + margin.top + ")");