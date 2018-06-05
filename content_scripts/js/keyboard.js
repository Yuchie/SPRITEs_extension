// -----------------------------------------------
// keyboard.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
// handle keyInput

SP.Keyboard = {

	keyPressed: function(spritesKey) {
		let ori_region = parseInt(spritesKey[0]);
	    let region = ori_region;
	    let Keynum = parseInt(spritesKey[1]);

	    let nextNode = SPdata.pageDic[Keynum][1];
	    SP.Node.processNode(nextNode);
	},

	suppressKey: function(event) {
		if(event) {
			event.preventDefault();
		}
	}
};