// -----------------------------------------------
// keymapping.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
// convert the key input to the physical key mapping
// temporary use

SP.Keymapping = {

	// spritesKeymap is in the order of [region number-the number in the region]
	initSpritesKeymapping: function() {
		spritesKeymap["Digit2"] = "-1 0";
		spritesKeymap["Digit3"] = "-1 1";
		spritesKeymap["Digit4"] = "-1 2";
		spritesKeymap["Digit5"] = "-1 3";
		spritesKeymap["Digit6"] = "-1 4";
		spritesKeymap["Digit7"] = "-1 5";
		spritesKeymap["Digit8"] = "-1 6";
		spritesKeymap["Digit9"] = "-1 7";
		spritesKeymap["Digit0"] = "-1 8";
		spritesKeymap["Minus"] = "-1 9";
		spritesKeymap["Equal"] = "-1 10";
		spritesKeymap["Digit1"] = "0 0";
		spritesKeymap["Tab"] = "0 1";
		spritesKeymap["ControlLeft"] = "0 2";
		spritesKeymap["ShiftLeft"] = "0 3";
		spritesKeymap["MetaLeft"] = "0 4";
		spritesKeymap["Backspace"] = "1 0";
		spritesKeymap["Enter"] = "1 1";
		spritesKeymap["ShiftRight"] = "1 2";
		spritesKeymap["ArrowRight"] = "1 3";
		spritesKeymap["KeyQ"] = "2 0";
		spritesKeymap["KeyW"] = "2 1";
		spritesKeymap["KeyE"] = "2 2";
		spritesKeymap["KeyR"] = "2 3";
		spritesKeymap["KeyT"] = "2 4";
		spritesKeymap["KeyY"] = "2 5";
		spritesKeymap["KeyU"] = "2 6";
		spritesKeymap["KeyI"] = "2 7";
		spritesKeymap["KeyO"] = "2 8";
		spritesKeymap["KeyP"] = "2 9";
		spritesKeymap["BracketLeft"] = "2 10";
		spritesKeymap["BracketRight"] = "2 11";
		spritesKeymap["KeyA"] = "3 0";
		spritesKeymap["KeyS"] = "3 1";
		spritesKeymap["KeyD"] = "3 2";
		spritesKeymap["KeyF"] = "3 3";
		spritesKeymap["KeyG"] = "3 4";
		spritesKeymap["KeyH"] = "3 5";
		spritesKeymap["KeyJ"] = "3 6";
		spritesKeymap["KeyK"] = "3 7";
		spritesKeymap["KeyL"] = "3 8";
		spritesKeymap["Semicolon"] = "3 9";
		spritesKeymap["Quote"] = "3 10";
		spritesKeymap["Backslash"] = "3 11";
		spritesKeymap["KeyZ"] = "4 0";
		spritesKeymap["KeyX"] = "4 1";
		spritesKeymap["KeyC"] = "4 2";
		spritesKeymap["KeyV"] = "4 3";
		spritesKeymap["KeyB"] = "4 4";
		spritesKeymap["KeyN"] = "4 5";
		spritesKeymap["KeyM"] = "4 6";
		spritesKeymap["Comma"] = "4 7";
		spritesKeymap["Period"] = "4 8";
		spritesKeymap["Slash"] = "4 9";
		spritesKeymap["IntlRo"] = "4 10";
		region_num[-1] = 9;
		region_num[0] = 3;
		region_num[1] = 2;
		region_num[2] = 10;
		region_num[3] = 10;
		region_num[4] = 9;
	},

	convertToKeyMap: function(key) {
		return spritesKeymap[key];
	}

}