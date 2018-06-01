// -----------------------------------------------
// sample.js
// -----------------------------------------------
// used for testing google chrome extension
// only used for testing so no effect with the whole function

"use strict";

window.onload = function() {
	var serializer = new XMLSerializer();
	// button.addEventListener("click", function() {
 //    	alert("clicked");
 //    	// chrome.runtime.sendMessage(button);
 //  	}, false);
 	let wholeDocument = document;
  	//console.log(divlist[0]);
  	let sendDocument = serializer.serializeToString(wholeDocument);
  	chrome.runtime.sendMessage({"message": "open_new_page", "document":sendDocument});
  	//console.log(sendDiv);
  	// chrome.runtime.sendMessage({"message": "test", "value":'test'});
};