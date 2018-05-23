"use strict";

window.onload = function() {
	var parser = new DOMParser();
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		    if( request.message === "open_new_page" ) {
		      	console.log("I read");
		      	console.log(request.div);
		      	let doc = parser.parseFromString(request.div, "text/xml");
				console.log(doc.firstChild);
				//document.getElementById('url').innerHTML = message.innerHTML;
		    } else if (request.message === 'test') {
		    	console.log("I read " + request.value);
		    }
		 });
};

// chrome.runtime.onMessage.addListener(function (msg, sender) {
//   // First, validate the message's structure
//   if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
//     // Enable the page-action for the requesting tab
//     chrome.pageAction.show(sender.tab.id);
//   }
// });