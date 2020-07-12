// This is the state machine of the interactive slideshow
// given an idx, it calls the appropriate plot functions
function state_machine(idx) {

	// if new idx is same as current do nothing
	if (parseInt(idx) != slide_num) {
		// clear svg element
		svg.selectAll('*').remove();

		switch(idx) {
		  case 1:
			overview_plot();
			break;
		  case 2:
			plot2()
			break;
		  case 3:
			plot3();
			break;
		  case 4:
			plot4();
			break;
		  case 5:
			full_plot();
			break;		
		  default:
			overview_plot();
		}
		
		// set new slide_num
		slide_num = idx;
	}

	// check if next_button should be enabled or disabled
	set_next_button();	
}

// event callback for next_button
function increment_slide_num() {
	// if less then the max slide number, increment and update the plot
	if (slide_num < num_slides) {
		state_machine(slide_num + 1);
	}
}

// function that enables or disables the next button depending on slide num
function set_next_button() {
	if (slide_num == 5) {
		document.getElementById("next_button").disabled = true;
	}
	else {
		document.getElementById("next_button").disabled = false;
	}
}
