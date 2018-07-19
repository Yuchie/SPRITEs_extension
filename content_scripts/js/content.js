// -----------------------------------------------
// content.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 17th, 2018
// manipulation of the currently opened website


"use strict";

var SPdata = new SPclass();

var spritesKeymap = {};
var region_num = {};
SP.Keymapping.initSpritesKeymapping();

(function() {
	window.onload = function() {

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyReleased);
	  	addTextContainer();
		setSPdict();

	  	chrome.runtime.onMessage.addListener(readMessage);
	  	// initializa the valuables
	  	chrome.runtime.sendMessage({"message": "initValuables", "from": "content"});

	};

	// ---------------------------------------
	// Read Message from background
	// ---------------------------------------
	function readMessage(request, sender, sendResponse) {
		let narrateText = "";

		if(request.from == 'background') {
			switch(request.message) {
				case 'spritesMode':
					SPdata.spritesMode = request.value;
					break;
				case 'searchMode':
					SPdata.keyword = request.keyword;
					break;
				case 'switchSpritesModeFinished':
					let resultMode = request.value;
					SPdata.spritesMode = resultMode;
					if(resultMode) {
						narrateText = "SPRITEs Mode ON";
					} else {
						narrateText = "SPRITEs Mode OFF";
					}
					SP.Sound.narrate(narrateText);
					break;
				case 'switchSearchModeFinished':
					let resultSearchMode = request.value;
					let searchWord = SPdata.keyword;
					SPdata.searchMode = resultSearchMode;
					SPdata.keywordInputMode = resultSearchMode;
					if(resultSearchMode) {
						SPdata.keyword = searchWord;
						narrateText = "Table Search Mode ON.";
						if (searchWord.trim() != "") {
							narrateText += ' ' + "Current keyword to search is " + searchWord;
						}
					} else {
						// clear the search result
						SPdata.searchResultDic = new Array();
						narrateText = "Table Search Mode OFF";
						// set scroll
						let scroll = [0, 0, 0, 0];
						scroll[0] = (SPdata.prevPageIndex[0]-1)/region_num[1];
						SPdata.pagescroll = scroll;
						scroll = [0, 0, 0, 0];
						scroll[0] = (SPdata.prevMenuIndex[0]-1)/region_num[-1];
						SPdata.menuscroll = scroll;
					}
					SP.Sound.narrate(narrateText);
					break;
				default:
					console.log("unexpected message sent to the content");
					break;
			}
		} else {
			console.log("message from unknown");
		}
	}


	// -----------------------------------------------
	// set the SPdict in the SPdata from the DOM
	// -----------------------------------------------
	function setSPdict() {
	 	let dom = document;
	  	SP.Webparser.createDictFromSource(SPdata, dom);
	 }


	// -----------------------------------------------
	// read key input and choose dict
	// -----------------------------------------------
	// this is event listener for key input
	function readKeyInput(e, keyString) {

		// check whether the shortcut is pressed
		if (checkShortcut(keyString)) {
			return true;
		}

		if(SPdata.spritesMode) {
			SP.Keyboard.suppressKey(e);

			if (SPdata.searchMode && SPdata.keywordInputMode) {

				// if the keyword input mode is on, then the key input is stored as a keyword
				SP.Keyboard.keywordInput(code);

			} else {

				// get the keyinput data and convert to the sprites key mapping 
				let code = e.code;
				let spritesKey = SP.Keymapping.convertToKeyMap(code);
				if(!spritesKey) {
			      return false;
			    } else {
			      spritesKey = spritesKey.split(" ");
			    }

			    if (SPdata.searchMode) {
			    	SP.Keyboard.keyPressedSearchMode(spritesKey);
			    } else {
			    	SP.Keyboard.keyPressed(spritesKey);
			    }

			}	
		} else {
			switch(keyString) {
				case "enter":
					if (SPdata.currentNode) {
						if (SPdata.currentNode.tagName.toLowerCase() == "a") {
							window.location.href = SPdata.currentNode.href;
						}
					}
					break;
				default:
					break;
			}
		}

	}


	// -----------------------------------------------
	// checkShortcut
	// -----------------------------------------------
	// check whether the shortcut is pressed and change the behavior
	function checkShortcut(keyString) {

		let shortcutPressed = true;
		switch (keyString) {
			case 'ctrl w':
				SPdata.spritesMode = !SPdata.spritesMode;
				chrome.runtime.sendMessage({"message": "switchSpritesMode", "from": "content"});
				break;
			case 'ctrl f':
				SPdata.searchMode = !SPdata.searchMode;
				// initialize valuables
				SPdata.activatedIndex = [0, 0, 0, 0];
	    		SPdata.list = false;
	    		SPdata.table = false;
	    		SPdata.paragraph = false;
				chrome.runtime.sendMessage({"message": "switchSearchMode", "from": "content"});
				break;
			default:
				shortcutPressed = false;
				break;
		}

		return shortcutPressed;

	}


	// -----------------------------------------------
	// getKeyString
	// -----------------------------------------------
	// get the string of key input for shortcut
	function getKeyString(e) {
		var key_id = e.which ? e.which : e.keyCode;

	    var key = "";
	    if(key_id >= 48 && key_id <= 90) {
	      key = String.fromCharCode(key_id);
	    } else {
	      switch(key_id) {
	      	case 8: key = "backspace"; break;  
	        case 9: key = "tab"; break;
	        case 13: key = "enter"; break;
	        case 16: key = "shift"; break;  
	        case 17: key = "ctrl"; break;  
	        case 18: key = "alt"; break;
	        case 19: key = "pause"; break;
	        case 20: key = "capslock"; break;
	        case 27: key = "esc"; break;
	        case 32: key = "spacebar"; break;
	        case 33: key = "pageup"; break;  
	        case 34: key = "pagedown"; break;  
	        case 35: key = "end"; break;                  
	        case 36: key = "home"; break;
	        case 37: key = "arrowleft"; break;
	        case 38: key = "arrowup"; break;
	        case 39: key = "arrowright"; break;
	        case 40: key = "arrowdown"; break;
	        case 45: key = "insert"; break;
	        case 46: key = "del"; break;
	        case 59: key = "semi-colon"; break;  // same as key code 186.
	        case 91: key = "left windows"; break;
	        case 92: key = "right windows"; break;
	        case 93: key = "select"; break;
	        case 96: key = "numpad 0"; break;
	        case 97: key = "numpad 1"; break;
	        case 98: key = "numpad 2"; break;
	        case 99: key = "numpad 3"; break;
	        case 100: key = "numpad 4"; break;
	        case 101: key = "numpad 5"; break;
	        case 102: key = "numpad 6"; break;
	        case 103: key = "numpad 7"; break;
	        case 104: key = "numpad 8"; break;
	        case 105: key = "numpad 9"; break;
	        case 106: key = "multiply"; break;
	        case 107: key = "add"; break;
	        case 109: key = "subtract"; break;
	        case 110: key = "decimal point"; break;
	        case 111: key = "divide"; break;
	        case 112: key = "f1"; break;
	        case 113: key = "f2"; break;
	        case 114: key = "f3"; break;
	        case 115: key = "f4"; break;
	        case 116: key = "f5"; break;
	        case 117: key = "f6"; break;
	        case 118: key = "f7"; break;
	        case 119: key = "f8"; break;
	        case 120: key = "f9"; break;
	        case 121: key = "f10"; break;
	        case 122: key = "f11"; break;
	        case 123: key = "f12"; break;
	        case 144: key = "num lock"; break;
	        case 145: key = "scroll lock"; break;
	        case 186: key = "semi-colon"; break;  // same as key code 59.
	        case 187: key = "equal sign"; break;
	        case 188: key = "comma"; break;
	        case 189: key = "dash"; break;
	        case 190: key = "dot"; break;
	        case 191: key = "forward slash"; break;
	        case 192: key = "grave accent"; break;
	        case 219: key = "open bracket"; break;
	        case 220: key = "back slash"; break;
	        case 221: key = "close bracket"; break;
	        case 222: key = "single quote"; break;
        	default: break;
	      }
		}

		return key;
	}


	// -----------------------------------------------
	// handleKeyDown
	// -----------------------------------------------
	// handle when the key is down
	// "shift", "alt", "ctrl" are ignored as long as 
	// 1. other keys are pressed
	// 2. those keys are released
	function handleKeyDown(e) {

		// get key string
		let keyString = getKeyString(e);

		let appv = parseInt(navigator.appVersion);
	    if(appv>3) {

	      if(appv!=4 || navigator.appName!="Netscape") {
	        SPdata.shiftPressed = e.shiftKey;
	        SPdata.altPressed   = e.altKey;
	        SPdata.ctrlPressed  = e.ctrlKey;
	      } else {
	        let mString  = (e.modifiers+32).toString(2).substring(3,6);
	        SPdata.shiftPressed = (mString.charAt(0)=="1");
	        SPdata.ctrlPressed  = (mString.charAt(1)=="1");
	        SPdata.altPressed   = (mString.charAt(2)=="1");
	      }
	    }

	    let string = "";

	    if((SPdata.ctrlPressed) && keyString != "ctrl") {
	      string += "ctrl ";
	    }
	    if((SPdata.altPressed) && keyString != "alt") {
	      string += "alt ";
	    }
	    if((SPdata.shiftPressed) && keyString != "shift") {
	      string += "shift ";
	    }

	    if(keyString && keyString != "") {
	      string += keyString;
	    }

	    keyString = string.toLowerCase();

		if(keyString != "shift" && keyString != "alt" && keyString != "ctrl") {
			readKeyInput(e, keyString);
		}

	} 


	// -----------------------------------------------
	// handleKeyReleased
	// -----------------------------------------------
	// only reacts when "shift", "alt", "ctrl" is released
	function handleKeyReleased(e) {

		// get key string
		let keyString = getKeyString(e);

		if(keyString == "shift" || keyString == "alt" || keyString == "ctrl") {
			SPdata.shiftPressed = e.shiftKey;
	        SPdata.altPressed   = e.altKey;
	        SPdata.ctrlPressed  = e.ctrlKey;
			readKeyInput(e, keyString);
		}

	}



	// -----------------------------------------------
	// add text container to the website
	// -----------------------------------------------
	// This area contains the narration
	// Problem: overlapped with the existing absolute element
	function addTextContainer() {
		let textContainer = document.createElement('div');
		textContainer.setAttribute('id', 'sp_text_display_container');
		// display none
		textContainer.style.display = "none";

		let text = document.createElement('span');
		text.setAttribute('id', 'sp_text_display');
		text.innerHTML = 'Welcome to Sprties';
		textContainer.appendChild(text);

		// insert as a first child in the body
		let bodyList = document.body;
		bodyList.insertBefore(textContainer, bodyList.childNodes[0]);
	}

})();