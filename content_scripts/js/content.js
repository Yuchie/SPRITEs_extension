// -----------------------------------------------
// content.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 12th, 2018
// manipulation of the currently opened website


"use strict";

var SPdata = new SPclass();

var spritesKeymap = {};
var region_num = {};
SP.Keymapping.initSpritesKeymapping();

(function() {
	window.onload = function() {

		window.addEventListener('keydown', readKeyInput);
	  	addTextContainer();
		setSPdict();

	  	chrome.runtime.onMessage.addListener(readMessage);
	  	// initializa the valuables
	  	chrome.runtime.sendMessage({"message": "initValuables", "from": "content"});

	};

	// ---------------------------------------
	// Read Message from background
	// ---------------------------------------
	// TODO: communicate when the tab is refreshed or before refreshed?
	function readMessage(request, sender, sendResponse) {
		let narrateText = "";

		if(request.from == 'background') {
			switch(request.message) {
				case 'spritesMode':
					SPdata.spritesMode = request.value;
					break;
				case 'searchMode':
					SPdata.searchMode = request.value;
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
					let searchWord = request.keyword;
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
	function readKeyInput(e) {

		// check whether the shortcut is pressed
		checkShortcut(e);

		if(SPdata.spritesMode) {
			SP.Keyboard.suppressKey(e);

			if (SPdata.keywordInputMode) {

				// if the keyword input mode is on, then the key input is stored as a keyword
				SP.Keyboard.keywordInput(e);

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
		}

	}


	// -----------------------------------------------
	// checkShortcut
	// -----------------------------------------------
	// check whether the shortcut is pressed and change the behavior
	function checkShortcut(e) {
		let keyString = getKeyString(e);
		switch (keyString) {
			case 'ctrl w':
				chrome.runtime.sendMessage({"message": "switchSpritesMode", "from": "content"});
				break;
			case 'ctrl f':
				chrome.runtime.sendMessage({"message": "switchSearchMode", "from": "content"});
				break;
			default:
				break;
		}

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
	        default: break;
	      }
		}

		let ctrlPressed = false;
	    let altPressed = false;
	    let shiftPressed = false;
		let appv = parseInt(navigator.appVersion);
	    if(appv>3) {

	      if(appv!=4 || navigator.appName!="Netscape") {
	        shiftPressed = e.shiftKey;
	        altPressed   = e.altKey;
	        ctrlPressed  = e.ctrlKey;
	      } else {
	        let mString  = (e.modifiers+32).toString(2).substring(3,6);
	        shiftPressed = (mString.charAt(0)=="1");
	        ctrlPressed  = (mString.charAt(1)=="1");
	        altPressed   = (mString.charAt(2)=="1");
	      }
	    }

	    let string = "";

	    if((ctrlPressed) && key != "ctrl") {
	      string += "ctrl ";
	    }
	    if((altPressed) && key != "alt") {
	      string += "alt ";
	    }
	    if((shiftPressed) && key != "shift") {
	      string += "shift ";
	    }

	    if(key && key != "") {
	      string += key;
	    }

	    key = string.toLowerCase();

		return key;
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