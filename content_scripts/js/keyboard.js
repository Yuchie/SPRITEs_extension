// -----------------------------------------------
// keyboard.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 17th, 2018
// handle keyInput

SP.Keyboard = {

	// ----------------------------------------------------
	// keyPressed function
	// ----------------------------------------------------
	// basic web browsing using pressed key 
	keyPressed: function(spritesKey) {
		let region = parseInt(spritesKey[0]);
	    let keyNum = parseInt(spritesKey[1]);

	    // switch between pageDic and menuDic
	    if(region == -1 || region == 1) {
	    	// if current dic is different from the previous dic, initialize the values
	    	if(SPdata.dicMode != region) {
	    		SPdata.dicMode = region;
	    		SPdata.activatedIndex = [0, 0, 0, 0];
	    		SPdata.menubar = false;
	    		SPdata.table = false;
	    		SPdata.paragraph = false;
	    		if(region == -1) {
	    			SPdata.prevMenuIndex = [0, 0, 0, 0];
	    		} else if (region == 1) {
	    			SPdata.prevPageIndex = [0, 0, 0, 0];
	    		}
	    	}
	    }
	    let curDic;
	    let curScroll;
	    let prevIndex;
	    if(SPdata.dicMode == -1) {
	    	curDic = SPdata.menuDic;
	    	prevIndex = SPdata.prevMenuIndex;
	    	curScroll = SPdata.menuscroll;
	    } else if(SPdata.dicMode == 1) {
	    	curDic = SPdata.pageDic;
	    	prevIndex = SPdata.prevPageIndex;
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
	    			if (prevIndex[0] == index) {
	    				// if pressed the twice, the element is activated
	    				SPdata.activatedIndex[0] = index;
	    				activated = true;
	    			}
	    			nextNodeList = curDic[index];

	    			if(!nextNodeList) {
	    				narrateText = "No element exists";
	    			}
	    		}
	    		for(let i=0; i<prevIndex.length; i++) {
	    			if(i == 0) {
	    				prevIndex[i] = index;
	    			} else {
	    				prevIndex[i] = 0;
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

    			for(let i=0; i<prevIndex.length; i++) {
	    			if(i == 1) {
	    				prevIndex[i] = index;
	    			} else {
	    				prevIndex[i] = 0;
	    			}
	    		}
	    	}
	    }


	    // ----------------------------------------
	    // table mode
	    // ----------------------------------------
	    // TODO: caption for table
	    // TODO: the link in tuple, list items
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
	    			if(prevIndex[1] == index) {
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

				for(let i=0; i<prevIndex.length; i++) {
	    			if(i == 1) {
	    				prevIndex[i] = index;
	    			} else {
	    				prevIndex[i] = 0;
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

				for(let i=0; i<prevIndex.length; i++) {
	    			if(i == 2) {
	    				prevIndex[i] = index;
	    			} else {
	    				prevIndex[i] = 0;
	    			}
	    		}
	    	}
	    }


	    // update scroll number and prevIndex
	    if(SPdata.dicMode == -1) {
			SPdata.prevMenuIndex = prevIndex;
	    	SPdata.menuscroll = curScroll;
	    } else if(SPdata.dicMode == 1) {
			SPdata.prevPageIndex = prevIndex;
	    	SPdata.pagescroll = curScroll;
	    }

	    if(nextNodeList) {
	    	if(nextNodeList.length > 1) {
	    		nextNode = nextNodeList[1];
		    	switch(nextNodeList[0]){
		    		case 'header':
			    		let headNum = nextNode.tagName[1];
			    		narrateText = 'heading' + headNum + ' ' + nextNode.textContent;
		    			break;
		    		case 'menubar':
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
		    			if(activated) {
		    				SPdata.paragraph = true;
		    				narrateText = 'paragraph activated';
		    			}
		    			break;
		    		case 'textblock':
		    			break;
		    		default:
		    			console.log("unexpected web element in dic");
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


	// ----------------------------------------------------
	// keyPressedSearchMode function
	// ----------------------------------------------------
	// the web browsing in the search mode
	keyPressedSearchMode: function(spritesKey) {

		let region = parseInt(spritesKey[0]);
	    let keyNum = parseInt(spritesKey[1]);

	    // switch between pageDic and menuDic
	    if(region == -1 || region == 1) {
	    	// if current dic is different from the previous dic, initializa the values
	    	if(SPdata.dicMode != region) {
	    		SPdata.dicMode = region;
	    		SPdata.activatedIndex = [0, 0, 0, 0];
	    		SPdata.menubar = false;
	    		SPdata.table = false;
	    		SPdata.paragraph = false;
	    		if(region == -1) {
	    			SPdata.prevMenuIndex = [0, 0, 0, 0];
	    		} else if (region == 1) {
	    			SPdata.prevPageIndex = [0, 0, 0, 0];
	    		}
	    	}
	    }
	    let curDic;
	    let searchDic;
	    let prevIndex;
	    let curScroll;
	    if(SPdata.dicMode == -1) {
	    	curDic = SPdata.menuDic;
	    	searchDic = SPdata.searchResultMenuDic;
	    	prevIndex = SPdata.prevMenuIndex;
	    	curScroll = SPdata.menuscroll;
	    } else if(SPdata.dicMode == 1) {
	    	curDic = SPdata.pageDic;
	    	searchDic = SPdata.searchResultPageDic;
	    	prevIndex = SPdata.prevPageIndex;
	    	curScroll = SPdata.pagescroll;
	    } else {
	    	return false;
	    }

	    let narrateText = null;
	    let searchResultList = null;
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
			          	narrateText = "This is the top of the search results";
			          	curScroll[0] += 1;
			        }
	    		} else if(keyNum > region_num[region]) {
	    			curScroll[0] += 1;
	    			//check whether there's space remain in that level
					if (curScroll[0] < Object.keys(searchDic).length/region_num[region]) {
						narrateText = "next set of elements selected";
					} else {
						narrateText = "This is the last of the search results";
						curScroll[0] -= 1;
					}

	    		} else {
	    			index = curScroll[0]*region_num[region]+keyNum;
	    			if (prevIndex[0] == index) {
	    				// if pressed the twice, the element is activated
	    				SPdata.activatedIndex[0] = index;
	    				activated = true;
	    			}
	    			searchResultList = searchDic[index];
	    			if(!searchResultList) {
	    				narrateText = "No element exists";
	    			} else {
	    				nextNodeList = curDic[searchResultList[0]];
	    			}

	    		}
	    		for(let i=0; i<prevIndex.length; i++) {
	    			if(i == 0) {
	    				prevIndex[i] = index;
	    			} else {
	    				prevIndex[i] = 0;
	    			}
	    		}
	    	}
	    }


	    // ----------------------------------------
	    // menubar mode
	    // ----------------------------------------
	    if(SPdata.menubar) {
	    	if(region == 2) {
	    		let index = 0;

	    		// update the curDic to the current menubar
	    		// TODO: what if the region is more than 3, so menubar has menubar inside
	    		// the case the list is link. How to click link?
	    		curDic = curDic[searchDic[SPdata.activatedIndex[0]][0]][2];
	    		searchDic = searchDic[SPdata.activatedIndex[0]][2];

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
	    			index = curScroll[0]*region_num[region]+keyNum;
	    			if (prevIndex[1] == index) {
	    				// if pressed the twice, the element is activated
	    				SPdata.activatedIndex[1] = index;
	    				activated = true;
	    			} else {
	    				let occurence = searchDic[index];
	    				narrateText = occurence + " occurence in this item " + index;
	    			}

	    			if(!nextNodeList) {
	    				narrateText = "No element exists";
	    			}
				}

    			for(let i=0; i<prevIndex.length; i++) {
	    			if(i == 1) {
	    				prevIndex[i] = index;
	    			} else {
	    				prevIndex[i] = 0;
	    			}
	    		}
	    	}
	    }


	    // update scroll number and prevIndex
	    if(SPdata.dicMode == -1) {
			SPdata.prevMenuIndex = prevIndex;
	    	SPdata.menuscroll = curScroll;
	    } else if(SPdata.dicMode == 1) {
			SPdata.prevPageIndex = prevIndex;
	    	SPdata.pagescroll = curScroll;
	    }

	    if(nextNodeList) {
	    	if(nextNodeList.length > 1) {
	    		nextNode = nextNodeList[1];
	    		if (activated) {
			    	switch(nextNodeList[0]){
			    		case 'header':
				    		let headNum = nextNode.tagName[1];
				    		narrateText = 'heading' + headNum + ' ' + nextNode.textContent;
			    			break;
			    		case 'menubar':
		    				SPdata.menubar = true;
		    				let length = Object.keys(nextNodeList[2]).length;
		    				narrateText = 'menubar with ' + length + ' items activated';
		    				if(nextNodeList[2][0]) {
			    				let title = nextNodeList[2][0];
			    				narrateText = title + ' ' + narrateText;
			    			}
			    			break;
			    		case 'table':
		    				SPdata.table = true;
		    				let row = Object.keys(nextNodeList[2]).length;
		    				narrateText = 'table with ' + row + ' rows activated';
		    				// default row is 1
		    				SPdata.activatedIndex[1] = 1;
			    			break;
			    		case 'paragraph':
			    			break;
			    		case 'textblock':
			    			break;
			    		default:
			    			console.log("unexpected web element in dic");
			    			break;
			    	}
			    } else {
			    	// narrate the occurence
			    	narrateText = searchResultList[1] + ' occurence in this ' + nextNodeList[0];
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


	// ----------------------------------------------------
	// keywordInput function
	// ----------------------------------------------------
	// input the keyword
	keywordInput: function(e) {

		let key = e.key;
		let keyCode = e.keyCode;
		let narrateText = "";
		let keyword = SPdata.keyword;

		switch (keyCode){
			case 8:
				// the input key is backspace
				if (keyword.length == 0) {
					narrateText = "search keyword is empty";
				} else {
					let key = keyword[keyword.length - 1];
					SPdata.keyword = keyword.slice(0, -1);
					narrateText = "delete " + key;
				}
				break;
			case 13:
				// the input key is enter
				if (keyword == "") {
					narrateText = "Keyword is empty. Please type keyword to search";
				} else {
					SPdata.keywordInputMode = false;
					narrateText = "Search " + keyword;
					SPdata.searchResultPageDic = this.search(SPdata.pageDic, keyword);
					SPdata.searchResultMenuDic = this.search(SPdata.menuDic, keyword);

					// update scroll
					let index;
					SPdata.pagescroll = this.setScroll(SPdata.prevPageIndex[0], SPdata.searchResultPageDic, region_num[1]);
					SPdata.menuscroll = this.setScroll(SPdata.prevMenuIndex[0], SPdata.searchResultMenuDic, region_num[-1]);

				}
				break;
			default:
				if(keyCode >= 48 && keyCode <= 90) {
					SPdata.keyword += key;
					narrateText = key;
				} else {
					console.log("unexpected keyinput in search keyword");
				}
				break;
		}

		SP.Sound.narrate(narrateText);
		chrome.runtime.sendMessage({"message": "storeKeyword", "from": "content", "keyword": keyword});

	},



	// ----------------------------------------------------
	// setScroll function
	// ----------------------------------------------------
	// set the scroll to include the previndex
	// return the scroll
	setScroll: function(index, dic, regionNum) {

		let scroll = [0, 0, 0, 0];
		for (let i=1; i<=Object.keys(dic).length; i++) {
			if (dic[i][0] >= index) {
				scroll[0] = (i-1)/regionNum;
				break;
			}
		}

		return scroll;

	},


	// ----------------------------------------------------
	// menuSearch function
	// ----------------------------------------------------
	// Search the menu whether the specific tuple has the keyword.
	// The occurence and the array of index is returned
	menuSearch: function(menubar, keyword) {

		let totalOccurence = 0;
		let searchResultIndex = {};

		// TODO: whether include title or not
		for (let i=0; i<=Object.keys(menubar).length; i++) {
			if(menubar[i]) {
				let text;
				if (i == 0) {
					text = menubar[i];
				} else {
					text = menubar[i].textContent;
				}
				let occurence = ((text.toLowerCase()).match(new RegExp(keyword, 'gi')) || []).length;
				searchResultIndex[i] = occurence;
				totalOccurence += occurence;
			}
		}

		return [totalOccurence, searchResultIndex];

	},


	// ----------------------------------------------------
	// tableSearch function
	// ----------------------------------------------------
	// Search the table whether the specific tuple has the keyword.
	// The occurence and the dic with the row and column are returned
	tableSearch: function(table, keyword) {

		let occurence = 0;
		let searchResultRow = [];
		let searchResultColumn = [];
		let tableResultDic = {};

		for (let i=1; i<=Object.keys(table).length; i++) {
			let subTable = table[i];
			// be careful the first tuple '0' is the parent dom
			for (let j=1; j<=Object.keys(subTable).length-1; j++) {
				if((subTable[j].textContent.toLowerCase()).match(keyword)) {
					occurence++;
					searchResultRow.push(i);
					searchResultColumn.push(j);
				}
			}
		}

		tableResultDic['row'] = searchResultRow;
		tableResultDic['culumn'] = searchResultColumn;

		return [occurence, tableResultDic];

	},


	// ----------------------------------------------------
	// search function
	// ----------------------------------------------------
	// Search the whole dic whether it has the keyword
	// The result is returned
	search: function(dic, keyword) {

		let resultDic_t = {};
		let headerCount = 1;

		for (let i=1; i<=Object.keys(dic).length; i++) {
			let subDic = dic[i];
			let name = subDic[0];
			let content = subDic[1];
			let occurence = 0;
			switch(name) {
				case 'header':
					occurence = ((content.innerText.toLowerCase()).match(new RegExp(keyword, 'gi')) || []).length;
					if (occurence) {
						resultDic_t[headerCount] = [i, occurence];
						headerCount++;
					}
					break;
				case 'menubar':
					let menuResult = this.menuSearch(subDic[2], keyword);
					let menuResultDic = menuResult[1];
					occurence = menuResult[0];
					if (occurence) {
						resultDic_t[headerCount] = [i, occurence, menuResultDic];
						headerCount++;
					}
					break;
				case 'table':
					let tableResult = this.tableSearch(subDic[2], keyword);
					let tableResultDic = tableResult[1];
					occurence = tableResult[0];
					if (occurence) {
						resultDic_t[headerCount] = [i, occurence, tableResultDic];
						headerCount++;
					}
					break;
				case 'paragraph':
					occurence = ((content.innerText.toLowerCase()).match(new RegExp(keyword, 'gi')) || []).length;
					if (occurence) {
						resultDic_t[headerCount] = [i, occurence];
						headerCount++;
					}
					break;
				case 'textblock':
					occurence = ((content.innerText.toLowerCase()).match(new RegExp(keyword, 'gi')) || []).length;
					if (occurence) {
						resultDic_t[headerCount] = [i, occurence];
						headerCount++;
					}
					break;
				default:
					console.log("unexpected web element in dic");
					break;
			}
		}

		return resultDic_t;

	},

	suppressKey: function(event) {
		if(event) {
			event.preventDefault();
		}
	}
};