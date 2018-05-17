"use strict";

window.onload = function() {
	let button = document.getElementById("hplogo");
	// button.addEventListener("click", function() {
 //    	alert("clicked");
 //    	// chrome.runtime.sendMessage(button);
 //  	}, false);
 	let divlist = document.getElementsByTagName("DIV");
  	console.log(divlist);
  	chrome.runtime.sendMessage(divlist);
};