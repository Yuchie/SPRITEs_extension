// -----------------------------------------------
// background.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
// the main js running in the background

"use strict";

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
				// read the whole web document
				case 'open_new_page':
					readDom(request.value);
					break;
				case 'key_input':
					readKeyInput(request.value);
					break;
				default:
					console.log('unexpected message');
					break;
			}
		}
	}

	// ---------------------------------------
	// Read the document
	// ---------------------------------------
	function readDom(doc) {
		let parser = new DOMParser();
		let dom = parser.parseFromString(doc, "text/xml");

		SP.Webparser.createDictFromSource(SPdata, dom);
	}

	// ---------------------------------------
	// Read keyboard input
	// ---------------------------------------
	function readKeyInput(code) {
		let spritesKey = SP.Keymapping.convertToKeyMap(code);
		if(!spritesKey) {
	      return false;
	    } else {
	      spritesKey = spritesKey.split(" ");
	    }
	    let ori_region = parseInt(spritesKey[0]);
	    let region = ori_region;
	    let Keynum = parseInt(spritesKey[1]);

	    let sendNode = SPdata.pageDic[Keynum][1];
	    sendNodeToBackground(sendNode);
	}

	// ---------------------------------------
	// Send Node to the content
	// ---------------------------------------
	function sendNodeToBackground(node) {
		var serializer = new XMLSerializer();
	  	let sendDocument = serializer.serializeToString(node);

	  	chrome.tabs.query({active: true, currentWindow: true},
			function(tabs) {
				chrome.tabs.sendMessage( tabs[0].id, {"message": "node_to_read", "from": "background", "value":sendDocument}, function(response){} );
			}
		);
	}
})();