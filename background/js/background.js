// -----------------------------------------------
// background.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 12th, 2018
// the main js running in the background

"use strict";

var SPbackgrounddata = new SPbackground();

(function(){
	window.onload = function() {
		chrome.runtime.onMessage.addListener(readMessage);
	};


	// ---------------------------------------
	// Read Message from content_js
	// ---------------------------------------
	function readMessage(request, sender, sendResponse) {
		if(request.from === 'content') {
			switch(request.message) {
				case 'initValuables':
					sendSpritesMode();
					sendSearchMode();
					break;
				case 'checkSpritesMode':
					sendSpritesMode();
					break;
				case 'switchSpritesMode':
					switchSpritesMode();
					break;
				case 'switchSearchMode':
					switchSearchMode();
					break;
				case 'storeKeyword':
					SPbackgrounddata.keyword = request.keyword;
					break;
				default:
					console.log('unexpected message sent to the background');
					break;
			}
		} else {
			console.log("message from unknown");
		}
	}


	// ---------------------------------------
	// sendSpritesMode
	// ---------------------------------------
	// send the current sprites mode to the content
	function sendSpritesMode() {
		let sendData = SPbackgrounddata.spritesMode;

	  	chrome.tabs.query({active: true, currentWindow: true},
			function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {"message": "spritesMode", "from": "background", "value": sendData}, function(response){} );
			}
		);
	}


	// ---------------------------------------
	// sendSearchMode
	// ---------------------------------------
	// send searched keyword to the content
	function sendSearchMode() {
		let keyword = SPbackgrounddata.keyword;
		chrome.tabs.query({active: true, currentWindow: true},
			function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {"message": "searchMode", "from": "background", "keyword": keyword}, function(response){} );
			}
		);
	}


	// ---------------------------------------
	// switchSpritesMode
	// ---------------------------------------
	// switch the current sprites mode
	function switchSpritesMode() {
		let spritesMode = !SPbackgrounddata.spritesMode;
		SPbackgrounddata.spritesMode = spritesMode;

		chrome.tabs.query({active: true, currentWindow: true},
			function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {"message": "switchSpritesModeFinished", "from": "background", "value": spritesMode}, function(response){} );
			}
		);

	}


	// ---------------------------------------
	// switchSearchMode
	// ---------------------------------------
	// switch the current search mode and send the keyword to search
	function switchSearchMode() {
		let spritesSearchMode = !SPbackgrounddata.searchMode;
		SPbackgrounddata.searchMode = spritesSearchMode;

		chrome.tabs.query({active: true, currentWindow: true},
			function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {"message": "switchSearchModeFinished", "from": "background", "value": spritesSearchMode}, function(response){} );
			}
		);

	}

})();