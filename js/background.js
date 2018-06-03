// -----------------------------------------------
// background.js
// -----------------------------------------------
// the js running in the background
// receive the document from the loadDocument.js and convert to DOM

"use strict";

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
				let doc = readDom(request.value);
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
	return dom;
}

// ---------------------------------------
// Read keyboard input
// ---------------------------------------
function readKeyInput(key) {
	console.log(key);
}