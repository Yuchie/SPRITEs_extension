// -----------------------------------------------
// background.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
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
				case 'checkSpritesMode':
					sendSpritesMode();
					break;
				case 'switchSpritesMode':
					switchSpritesMode();
				default:
					console.log('unexpected message');
					break;
			}
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
				chrome.tabs.sendMessage(tabs[0].id, {"message": "spritesMode", "from": "background", "value":sendData}, function(response){} );
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
				chrome.tabs.sendMessage(tabs[0].id, {"message": "switchSpritesModeFinished", "from": "background", "value":spritesMode}, function(response){} );
			}
		);

	}

})();