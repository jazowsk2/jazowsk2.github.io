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
			 "The Bad Beginning",
			 "The Plateau",
			 "The Reopening",
			 "The Present"];

var text = ["The total number of cases and deaths \
			has been steadily increasing since the beginning of the COVID-19 outbreak. \
			In the subsequent slides, we will assess daily statistics at different stages of the Los Angeles County response plan.",
			"As new cases and deaths began to grow \
			without any hope of stopping the spread, Los Angeles County officials enacted a stay at home order.",
			"The stay at home order proved effective, and once cases peaked \
			and started to plateau, discussions about reopening began.",
			"With deaths decreasing and cases mostly steady, \
			Los Angeles County began to reopen in phases.",
			"Although cases have been increasing since reopening, deaths have continued \
			to decrease meaning the current reopening strategy has been mostly successful. However, Los Angeles County officials need to continue \
			monitoring the situation to maintain control over the spread and prevent an increase in deaths."];

// annotation label and y offset
var annotations = [{label: "Stay at home order", y: 100},
					{label: "New Cases Peak and Plateau", y: 100},
					{label: "Beginning of reopening", y: 150}];
				