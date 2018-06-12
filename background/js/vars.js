// -----------------------------------------------
// vars.js
// -----------------------------------------------
//
// Author: Yuqian Sun
// Last Update Date: June 12th, 2018
// Description: contains global namespace declarations
// retains in the background. The value is retained even 
// the page is reloaded and refreshed.

class SPbackground {
	constructor() {
		// sprites mode is on or not
		this.spritesMode = true; // the default is on

		// valuables used in search
		this.searchMode = false;
		this.keyword = ""; // this must be always stored in lower case

	}
};