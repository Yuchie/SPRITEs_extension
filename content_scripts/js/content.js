// -----------------------------------------------
// content.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
// manipulation of the currently opened website


"use strict";

window.onload = function() {

	loadDocument();
  	window.addEventListener('keydown', keySend);
  	// addTextContainer();

};

// -----------------------------------------------
// send the document dom to the background
// -----------------------------------------------
function loadDocument() {
	var serializer = new XMLSerializer();
 	let wholeDocument = document;
  	let sendDocument = serializer.serializeToString(wholeDocument);
  	chrome.runtime.sendMessage({"message": "open_new_page", "from": "content", "value":sendDocument});
}

// -----------------------------------------------
// send key input to the background
// -----------------------------------------------
// this is event listener
function keySend(event) {
	console.log("key pressed");
	let key = event.code;
	console.log(event);
	chrome.runtime.sendMessage({"message": "key_input", "from": "content", "value": key});
}

// -----------------------------------------------
// add text container to the website
// -----------------------------------------------
// This area contains the narration
// Problem: overlapped with the existing absolute element
function addTextContainer() {
	let textContainer = document.createElement('div');
	textContainer.setAttribute('id', 'sp_text_display_container');

	let text = document.createElement('span');
	text.setAttribute('id', 'sp_text_display');
	text.innerHTML = 'Welcome to Sprties';
	textContainer.appendChild(text);

	// insert as a first child in the body
	let bodyList = document.body;
	bodyList.insertBefore(textContainer, bodyList.childNodes[0]);
}