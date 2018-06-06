// -----------------------------------------------
// node.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
// handle node

SP.Node = {
	// process the current node
	processNode: function(nextNode, narrateText = null) {
		if(nextNode) {
			if(narrateText) {
				SP.Sound.narrate(narrateText);
			} else {
				SP.Sound.narrate(nextNode.textContent);
			}
			this.highlightNode(nextNode);
		}
	},

	// highlight the chosen node
	highlightNode: function(nextNode) {
		let currentNode = SPdata.currentNode;

		// remove the highlight of current node
		if(currentNode) {
			currentNode.blur();
			currentNode.classList.remove('sphighlight');
		}

		// update the current node and highlight it
		SPdata.currentNode = nextNode;
	    SPdata.currentNode.focus();
	    SPdata.currentNode.classList.add('sphighlight');
	}
};