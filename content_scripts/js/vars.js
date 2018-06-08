// -----------------------------------------------
// vars.js
// -----------------------------------------------
//
// Author: Yuqian Sun
// Last Update Date: June 5th, 2018
// Description: contains global namespace declarations

var SP = {
	Webparser: null,       // currently in webparser.js
	Keymapping: null,
	Keyboard: null,
	Node: null,
	Sound: null
};

class SPclass {
	constructor() {
		// Array of Document objects used for SPRITEs
		this.pageDic = new Array();
		// Array of navigation menu objects used for SPRITEs
		this.menuDic = new Array();

		// current node to read
		this.currentNode = null;

		// -------------------------------------
		// variable used in keyboard
		// -------------------------------------
		// keyboardMode:
		// 0 - Browse Mode
		// 1 - other Mode
		this.keyboardMode = 0;

		// dicMode:
		// 1 - pageDic
		// -1 - menuDic
		this.dicMode = 0;


		// search table mode: search keyword in the table
		this.tableEdgeSearchMode = 0;
		this.searchResultRow = [];
		this.searchResultColumn = [];
		this.keyword = ""; // this must be always stored in lower case

		this.menubar = false;
		this.table = false;
		this.paragraph = false;

		this.prevIndex = [0, 0, 0, 0];
		this.activatedIndex = [0, 0, 0, 0];
		this.pagescroll = [0, 0, 0, 0];
		this.menuscroll = [0, 0, 0, 0];
	}
};