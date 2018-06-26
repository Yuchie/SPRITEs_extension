// -----------------------------------------------
// vars.js
// -----------------------------------------------
//
// Author: Yuqian Sun
// Last Update Date: June 12th, 2018
// Description: contains global namespace declarations

var SP = {
	Webparser: null,       // in webparser.js
	Keymapping: null,		// in keymapping.js
	Keyboard: null,			// in keyboard.js
	Node: null,				// in node.js
	Sound: null				// in sound.js 
};

class SPclass {
	constructor() {
		// sprites mode is on or not
		this.spritesMode = false;

		// Array of Document objects used for SPRITEs
		this.pageDic = new Array();
		// Array of navigation menu objects used for SPRITEs
		this.menuDic = new Array();
		// Array of search result
		this.searchResultPageDic = new Array();
		this.searchResultMenuDic = new Array();

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


		// search mode: search keyword
		this.searchMode = false;
		this.keywordInputMode = false;
		this.keyword = ""; // this must be always stored in lower case

		this.menubar = false;
		this.table = false;
		this.paragraph = false;

		this.activatedIndex = [0, 0, 0, 0];
		this.prevPageIndex = [0, 0, 0, 0];
		this.prevMenuIndex = [0, 0, 0, 0];
		this.pagescroll = [0, 0, 0, 0];
		this.menuscroll = [0, 0, 0, 0];

		// used for shortcut key
		this.shiftPressed = false;
		this.altPressed = false;
		this.ctrlPressed = false; 
	}
};