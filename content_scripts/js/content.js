// -----------------------------------------------
// content.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
// manipulation of the currently opened website


"use strict";

var SPdata = new SPclass();

var spritesKeymap = {};
var region_num = {};
SP.Keymapping.initSpritesKeymapping();

(function() {
	window.onload = function() {

		setSPdict();
	  	window.addEventListener('keydown', readKeyInput);
	  	addTextContainer();

	  	chrome.runtime.onMessage.addListener(readMessage);

	};

	// ---------------------------------------
	// Read Message from background
	// ---------------------------------------
	function readMessage(request, sender, sendResponse) {
		if(request.from == 'background') {
			switch(request.message) {
				case 'node_to_read':
					readDom(request.value);
					break;
				default:
					break;
			}
		}
	}

	// -----------------------------------------------
	// set the SPdict in the SPdata from the DOM
	// -----------------------------------------------
	function setSPdict() {
	 	let dom = document;
	  	SP.Webparser.createDictFromSource(SPdata, dom);
	 }

	// ---------------------------------------
	// Read the DOM
	// ---------------------------------------
	function readDom(doc) {
		let parser = new DOMParser();
		let dom = parser.parseFromString(doc, "text/xml");
		console.log(dom);
	}

	// -----------------------------------------------
	// read key input and choose dict
	// -----------------------------------------------
	// this is event listener
	function readKeyInput(event) {
		// TODO: sprites mode is on prevent default function
		SP.Keyboard.suppressKey(event);

		// get the keyinput data and convert to the sprites key mapping 
		let code = event.code;
		let spritesKey = SP.Keymapping.convertToKeyMap(code);
		if(!spritesKey) {
	      return false;
	    } else {
	      spritesKey = spritesKey.split(" ");
	    }

	    SP.Keyboard.keyPressed(spritesKey);
	}

	// -----------------------------------------------
	// add text container to the website
	// -----------------------------------------------
	// This area contains the narration
	// Problem: overlapped with the existing absolute element
	function addTextContainer() {
		let textContainer = document.createElement('div');
		textContainer.setAttribute('id', 'sp_text_display_container');
		// display none
		textContainer.style.display = "none";

		let text = document.createElement('span');
		text.setAttribute('id', 'sp_text_display');
		text.innerHTML = 'Welcome to Sprties';
		textContainer.appendChild(text);

		// insert as a first child in the body
		let bodyList = document.body;
		bodyList.insertBefore(textContainer, bodyList.childNodes[0]);
	}

})();