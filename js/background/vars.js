// -----------------------------------------------
// vars.js
// -----------------------------------------------
//
// Author: Yuqian Sun
// Last Update Date: June 4th, 2018
// Description: contains global namespace declarations

var SP = {
	Webparser: null       // currently in webparser.js
};

class SPclass {
	constructor() {
		// Array of Document objects used for SPRITEs
		this.pageDic = new Array();
		// Array of navigation menu objects used for SPRITEs
		this.menuDic = new Array();
	}
};