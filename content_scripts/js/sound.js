// -----------------------------------------------
// sound.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
// handle sound

SP.Sound = {
	narrate: function(narrateText) {
		window.speechSynthesis.cancel();  // Clear any existing speech utterance playing

		// ** Temperory fix **
		document.getElementById('sp_text_display').innerHTML = narrateText; // to display text on interface

		var msg = new SpeechSynthesisUtterance(narrateText);  // Create a new instance of text in Speech Synthesis format
		var voices = window.speechSynthesis.getVoices();
		msg.rate = 2.0; // 0.1 to 10
		window.speechSynthesis.speak(msg);  // Play text to user
	}
};