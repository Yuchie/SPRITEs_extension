// -----------------------------------------------
// loadDocument.js
// -----------------------------------------------
// load the website opened and pass the document to background
// by converting to the string


"use strict";

window.onload = function() {
	var serializer = new XMLSerializer();
 	let wholeDocument = document;
  	let sendDocument = serializer.serializeToString(wholeDocument);
  	chrome.runtime.sendMessage({"message": "open_new_page", "from": "content", "value":sendDocument});

  	window.addEventListener('keydown', keySend);
};


// -----------------------------------------------
// send key input to the background
// -----------------------------------------------
function keySend(event) {
	console.log("key pressed");
	let key = event.code;
	console.log(event);
	chrome.runtime.sendMessage({"message": "key_input", "from": "content", "value": key});
}