// this file contains global variables for the page
var data; // only load the data once
var slide_num = -1; // parameter to change between slides
var num_slides = 5; // set the number of slides
var data_index = []; // array used to store data indexs from file
var legend_offset = 40; // how much to offset the legend
	
// set the svg only once and specify the margins
// set the dimensions and margins of the graph
var margin = {top: 30, right: 250, bottom: 50, left: 75},
	width = 1200 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform","translate(" + margin.left + "," + margin.top + ")");

// string array containing the annotation dates
var dates = ["3/1/2020","3/15/2020","5/1/2020","5/15/2020","present"];

// string arrays containing text and headers for each slide_num
var header = ["Continuous Growth",
			 "The Beginning",
			 "The Plateau",
			 "The Reopening",
			 "The Present"];

var text = ["The cumulative number of cases and deaths \
			has been increasing steadily since the beginning of the Covid-19 outbreak. \
			Taking a look at daily statistics will tell us how we got here.",
			"As new cases and deaths began to grow \
			without any hope of stopping the spread, LA county officials enacted a stay at home order.",
			"The stay at home order proved effective, and once cases peaked \
			and started to plateau, discussions about reopening began.",
			"With deaths decreasing and cases mostly steady, \
			LA county began to reopen.",
			"Although cases have been increasing since reopening, deaths have continued \
			to decrease meaning the current reopening strategy is mostly successful. However, LA county officials need to continue \
			closely monitoring the situation to maintain control of spread and prevent an increase in deaths."];

// annotation label and y offset
var annotations = [{label: "Stay at home order", y: 100},
					{label: "New Cases Peak and Plateau", y: 100},
					{label: "Beginning of reopening", y: 150}];
		