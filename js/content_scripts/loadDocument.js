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
  	chrome.runtime.sendMessage({"message": "open_new_page", "from": "content", "document":sendDocument});
};