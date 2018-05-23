"use strict";

window.onload = function() {
	var serializer = new XMLSerializer();
	// button.addEventListener("click", function() {
 //    	alert("clicked");
 //    	// chrome.runtime.sendMessage(button);
 //  	}, false);
 	let divlist = document.getElementsByTagName("DIV");
  	console.log(divlist[0]);
  	let sendDiv = serializer.serializeToString(divlist[0]);
  	chrome.runtime.sendMessage({"message": "open_new_page", "div":sendDiv});
  	console.log(sendDiv);
  	chrome.runtime.sendMessage({"message": "test", "value":'test'});
  // function(request, sender, sendResponse) {
  //   if( request.message === "clicked_browser_action" ) {
  //     var firstHref = $("a[href^='http']").eq(0).attr("href");

  //     console.log(firstHref);

  //     // This line is new!
  //     chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
  //   }
  // }
};