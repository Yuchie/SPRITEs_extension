// -----------------------------------------------
// keyboard.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 6th, 2018
// handle keyInput

SP.Keyboard = {

	keyPressed: function(spritesKey) {
		let region = parseInt(spritesKey[0]);
	    let keyNum = parseInt(spritesKey[1]);

	    // switch between pageDic and menuDic
	    if(region == -1 || region == 1) {
	    	if(SPdata.dicMode != region) {
	    		SPdata.dicMode = region;
	    		SPdata.prevIndex = [0, 0, 0, 0];
	    		SPdata.activatedIndex = [0, 0, 0, 0];
	    		SPdata.menubar = false;
	    		SPdata.table = false;
	    		SPdata.paragraph = false;
	    	}
	    }
	    let curDic;
	    let curScroll;
	    if(SPdata.dicMode == -1) {
	    	curDic = SPdata.menuDic;
	    	curScroll = SPdata.menuscroll;
	    } else if(SPdata.dicMode == 1) {
	    	curDic = SPdata.pageDic;
	    	curScroll = SPdata.pagescroll;
	    } else {
	    	return false;
	    }

	    let narrateText = null;
	    let nextNodeList = null;
	    let nextNode = null;
	    let activated = false;
	    
	    // --------------------------------------
	    // Browsing Mode
	    // --------------------------------------
	    if(SPdata.keyboardMode == 0) {
	    	if(region == -1 || region == 1) {
	    		let index = 0;
	    		// init all the mode and scroll used for other than browsing
				SPdata.menubar = false;
				SPdata.table = false;
				SPdata.paragraph = false;
				for (let i=1; i<SPdata.activatedIndex.length; i++) {
					SPdata.activatedIndex[i] = 0;
				}
				for (let i=1; i<curScroll.length; i++) {
					curScroll[i] = 0;
				}

	    		// first and last keyNum is used for scrolling
	    		if(keyNum == 0) {
	    			curScroll[0] -= 1;
			        if (curScroll[0] >= 0) {
			          	narrateText = "previous set of elements selected";
			        } else {
			          	narrateText = "This is the top";
			          	curScroll[0] += 1;
			        }
	    		} else if(keyNum > region_num[region]) {
	    			curScroll[0] += 1;
	    			//check whether there's space remain in that level
					if (curScroll[0] < Object.keys(curDic).length/region_num[region]) {
						narrateText = "next set of elements selected";
					} else {
						narrateText = "This is the last";
						curScroll[0] -= 1;
					}

	    		} else {
	    			index = curScroll[0]*region_num[region]+keyNum;
	    			if (SPdata.prevIndex[0] == index) {
	    				// if pressed the twice, the element is activated
	    				SPdata.activatedIndex[0] = index;
	    				activated = true;
	    			}
	    			nextNodeList = curDic[index];

	    			if(!nextNodeList) {
	    				narrateText = "No element exists";
	    			}
	    		}
	    		for(let i=0; i<SPdata.prevIndex.length; i++) {
	    			if(i == 0) {
	    				SPdata.prevIndex[i] = index;
	    			} else {
	    				SPdata.prevIndex[i] = 0;
	    			}
	    		}
	    	}
	    }


	    // ----------------------------------------
	    // menubar mode & paragraph mode
	    // ----------------------------------------
	    if(SPdata.menubar || SPdata.paragraph) {
	    	if(region == 2) {
	    		let index = 0;

	    		// update the curDic to the current menubar
	    		// TODO: what if the region is more than 3, so menubar has menubar inside
	    		// the case the list is link. How to click link?
	    		curDic = curDic[SPdata.activatedIndex[0]][2];

	    		// first and last keyNum is used for scrolling
	    		if(keyNum == 0) {
	    			curScroll[1] -= 1;
			        if (curScroll[1] >= 0) {
			          	narrateText = "previous set of elements selected";
			        } else {
			          	narrateText = "This is the top";
			          	curScroll[1] += 1;
			        }
	    		} else if(keyNum > region_num[region]) {
	    			curScroll[1] += 1;
	    			//check whether there's space remain in that level
					if (curScroll[1] < Object.keys(curDic).length/region_num[region]) {
						narrateText = "next set of elements selected";
					} else {
						narrateText = "This is the last";
						curScroll[1] -= 1;
					}

				} else {
					index = curScroll[1]*region_num[region]+keyNum;
	    			nextNodeList = curDic[index];

	    			if(!nextNodeList) {
	    				narrateText = "No element exists";
	    			}
				}

    			for(let i=0; i<SPdata.prevIndex.length; i++) {
	    			if(i == 1) {
	    				SPdata.prevIndex[i] = index;
	    			} else {
	    				SPdata.prevIndex[i] = 0;
	    			}
	    		}
	    	}
	    }


	    // ----------------------------------------
	    // table mode
	    // ----------------------------------------
	    if(SPdata.table) {
	    	if(region == 0) {
	    		let index = 0;

	    		// update the curDic to the current menubar
	    		curDic = curDic[SPdata.activatedIndex[0]][2];

	    		// first and last keyNum is used for scrolling
	    		if(keyNum == 0) {
	    			curScroll[1] -= 1;
			        if (curScroll[1] >= 0) {
			          	narrateText = "previous set of rows selected";
			        } else {
			          	narrateText = "This is the top";
			          	curScroll[1] += 1;
			        }
	    		} else if(keyNum > region_num[region]) {
	    			curScroll[1] += 1;
	    			//check whether there's space remain in that level
					if (curScroll[1] < Object.keys(curDic).length/region_num[region]) {
						narrateText = "next set of rows selected";
					} else {
						narrateText = "This is the last";
						curScroll[1] -= 1;
					}

				} else {
					index = curScroll[1]*region_num[region]+keyNum;
	    			nextNodeList = curDic[index][0];
	    			if(SPdata.prevIndex[1] == index) {
	    				// if pressed the twice, the row is activated
	    				SPdata.activatedIndex[1] = index;
	    				activated = true;
	    				narrateText = "row " + index + " activated";
	    			} else {
	    				let column = Object.keys(curDic[index]).length - 1;
	    				narrateText = "row " + index + " with " + column + " columns";
	    			}

	    			if(!nextNodeList) {
	    				narrateText = "No row exists";
	    			}
				}

				for(let i=0; i<SPdata.prevIndex.length; i++) {
	    			if(i == 1) {
	    				SPdata.prevIndex[i] = index;
	    			} else {
	    				SPdata.prevIndex[i] = 0;
	    			}
	    		}
	    	} else if(region == 2) {
	    		// choose row
	    		let index = 0;

	    		// update the curDic to the current menubar
	    		curDic = curDic[SPdata.activatedIndex[0]][2][SPdata.activatedIndex[1]];

	    		// first and last keyNum is used for scrolling
	    		if(keyNum == 0) {
	    			curScroll[2] -= 1;
			        if (curScroll[2] >= 0) {
			          	narrateText = "previous set of columns selected";
			        } else {
			          	narrateText = "This is the top";
			          	curScroll[2] += 1;
			        }
	    		} else if(keyNum > region_num[region]) {
	    			curScroll[2] += 1;
	    			//check whether there's space remain in that level
					if (curScroll[2] < Object.keys(curDic).length/region_num[region]) {
						narrateText = "next set of columns selected";
					} else {
						narrateText = "This is the last";
						curScroll[2] -= 1;
					}

				} else {
					index = curScroll[2]*region_num[region]+keyNum;
	    			nextNodeList = curDic[index];
	    			if(nextNodeList) {
		    			let row = SPdata.activatedIndex[1];
		    			narrateText = "row " + row + " column " + index + " " + nextNodeList.textContent;
		    		} else {
		    			narrateText = "no column exits";
		    		}
				}

				for(let i=0; i<SPdata.prevIndex.length; i++) {
	    			if(i == 2) {
	    				SPdata.prevIndex[i] = index;
	    			} else {
	    				SPdata.prevIndex[i] = 0;
	    			}
	    		}
	    	}
	    }


	    // update scroll number
	    if(SPdata.dicMode == -1) {
	    	SPdata.menuscroll = curScroll;
	    } else if(SPdata.dicMode == 1) {
	    	SPdata.pagescroll = curScroll;
	    }

	    if(nextNodeList) {
	    	if(nextNodeList.length > 1) {
		    	switch(nextNodeList[0]){
		    		case 'header':
		    			nextNode = nextNodeList[1];
			    		let headNum = nextNode.tagName[1];
			    		narrateText = 'heading' + headNum + ' ' + nextNode.textContent;
		    			break;
		    		case 'menubar':
		    			nextNode = nextNodeList[1];
		    			if(activated) {
		    				SPdata.menubar = true;
		    				narrateText = 'menubar activated';
		    			} else {
			    			let length = Object.keys(nextNodeList[2]).length;
			    			narrateText = 'menubar with ' + length + ' items';
			    			if(nextNodeList[2][0]) {
			    				let title = nextNodeList[2][0];
			    				narrateText = title + ' ' + narrateText;
			    			}
			    		}
		    			break;
		    		case 'table':
		    			nextNode = nextNodeList[1];
		    			if(activated) {
		    				SPdata.table = true;
		    				narrateText = 'table activated';
		    				// default row is 1
		    				SPdata.activatedIndex[1] = 1;
		    			} else {
			    			let row = Object.keys(nextNodeList[2]).length;
			    			narrateText = 'table with ' + row + ' rows';
			    		}
		    			break;
		    		case 'paragraph':
		    			nextNode = nextNodeList[1];
		    			if(activated) {
		    				SPdata.paragraph = true;
		    				narrateText = 'paragraph activated';
		    			}
		    			break;
		    		case 'textblock':
		    			nextNode = nextNodeList[1];
		    			break;
		    		default:
		    			break;
		    	}
	    	} else {
	    		nextNode = nextNodeList;
	    	}
	    }

	    if(nextNode) {
	    	SP.Node.processNode(nextNode, narrateText);
	    } else if(narrateText) {
    		SP.Sound.narrate(narrateText);
    		return true;
    	} else {
    		return false;
    	}

	},

	suppressKey: function(event) {
		if(event) {
			event.preventDefault();
		}
	}
};