// -----------------------------------------------
// background.js
// -----------------------------------------------
// the js running in the background
// receive the document from the loadDocument.js and convert to DOM

"use strict";

window.onload = function() {
	var parser = new DOMParser();

	chrome.runtime.onMessage.addListener(

		// ---------------------------------------
		// Receive when the website is opened
		// ---------------------------------------
		function(request, sender, sendResponse) {
		    if( request.from === 'content' && request.message === "open_new_page" ) {
		      	console.log("I read");
		      	let doc = parser.parseFromString(request.document, "text/xml");
				console.log(doc);
				console.log(doc.body.children.length)
		    } else if (request.message === 'test') {
		    	console.log("I read " + request.value);
		    }
		 }

	);
};

// chrome.runtime.onMessage.addListener(function (msg, sender) {
//   // First, validate the message's structure
//   if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
//     // Enable the page-action for the requesting tab
//     chrome.pageAction.show(sender.tab.id);
//   }
// });