"use strict";

chrome.runtime.onMessage.addListener(function (message) {
	console.log("I read");
	console.log(message);
	//document.getElementById('url').innerHTML = message.innerHTML;
});

window.onload = function() {
	chrome.runtime.onMessage.addListener(function (message) {
		console.log("I read");
		console.log(message);
		//document.getElementById('url').innerHTML = message.innerHTML;
	});
};