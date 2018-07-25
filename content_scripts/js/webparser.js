// -----------------------------------------------
// webparser.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 6th, 2018
// Description: used for change dom to dict

SP.Webparser = {

	// create table
	createTable: function(list) {
		let rowCount = 1;
		let colCount = 1;
		let dic = {};
		let tables = list.tBodies;
		//acquire each element in table
		for(let t=0; t<tables.length; t++) {
			let sublists = tables[t].children;
			for (let i=0; i<sublists.length; i++) {
				sublist = sublists[i];
				//check whether it can be a row in the table
				if(sublist.tagName == "TR"){
					//if table doesn't have the content of that row, initialize it
					if(!dic.hasOwnProperty(rowCount)){
						dic[rowCount] = {};
					}

					temps = sublist.children;
					colCount = 1;

					//acquire each tuple
					for (let j=0; j<temps.length; j++) {
						if(j == 0) {
							dic[rowCount][0] = sublist;
						}

						temp = temps[j];

						if(temp.tagName == "TH" || temp.tagName == "TD") {
							while(dic[rowCount].hasOwnProperty(colCount)) {
								// skip to the first available column value
								colCount += 1;
							}

							let subtemplists = temp.children;
							dic[rowCount][colCount] = {};
							if (subtemplists.length) {
								let subtempHeadingCount = 1;
								for (let j=0; j<subtemplists.length; j++) {
									let subtemplist = subtemplists[j];
									dic[rowCount][colCount][subtempHeadingCount] = subtemplist;
									subtempHeadingCount += 1;
								}
								// if there's only one element
								if (Object.keys(dic[rowCount][colCount]).length == 1) {
									dic[rowCount][colCount] = dic[rowCount][colCount][1];
								}
							} else {
								dic[rowCount][colCount] = temp;
							}

							let colspan = parseInt(sublist.colSpan);
							if(!colspan) {
								colspan = 1;
							}
							for (let k=1; k<colspan; k++) {
								dic[rowCount][colCount+k] = 'colspan';
							}
							let rowspan = parseInt(sublist.rowSpan);
							if(!rowspan) {
								rowspan = 1;
							}
							for (let k=1; k<rowspan; k++) {
								if(!dic.hasOwnProperty(rowCount+k)){
									dic[rowCount+k] = new Array();
								}
								dic[rowCount+k][colCount] = list;
							}
							if(colspan>1 && rowspan>1) {
								for (let k=1; k<colspan; k++) {
									for (let l=1; l<rowspan; l++) {
										dic[rowCount+l][colCount+k] = 'colspan';
									}
								}
							}
							colCount = colCount + colspan;
						}
					}
					rowCount += 1;
				}
			}
		}

		return dic;
	},

	// see how many tables are in the tbody element
	_createTable: function(list) {
		// there is a possibility that table has multiple tbodys
		let subHeadingCount = 1;
		let dic = {};
		dic[0] = "table";
		let sublists = list.getElementsByTagName("TBODY");
		//create table depending on the number of TBODY inside of the table element
		for (let i=0; i<sublists.length; i++) {
			sublist = sublists[i];
			//create each table
			dic[subHeadingCount] = SP.Webparser.createTableIn(sublist);
			subHeadingCount += 1;
		}
		return dic;
	},

	//create list
	createList: function(list) {
		let invalid_tags = ['B', 'I', 'U', 'DIV'];
		let subHeadingCount = 1;
		let dic = {};
		let sublists = list.children;
		//get each element in the list
		for (let i=0; i<sublists.length; i++) {
			sublist = sublists[i];
			if (sublist.tagName == "LI") {
				let subsublists = sublist.children;
				dic[subHeadingCount] = {};
				if (subsublists.length) {
					let subsubHeadingCount = 1;
					for (let j=0; j<subsublists.length; j++) {
						let subsublist = subsublists[j];
						if (subsublist.tagName == "UL" || subsublist.tagName == "OL") {
							//recursive funvtion for sublist
							dic[subHeadingCount][subsubHeadingCount] = ['list', subsublist, {}];
							dic[subHeadingCount][subsubHeadingCount] = SP.Webparser.createList(subsublist);
						} else {
							dic[subHeadingCount][subsubHeadingCount] = this.createDictFromList([subsublist]);
							if(Object.keys(dic[subHeadingCount][subsubHeadingCount]).length == 1) {
								dic[subHeadingCount][subsubHeadingCount] = dic[subHeadingCount][subsubHeadingCount][1];
							} else {
								let temp = dic[subHeadingCount][subsubHeadingCount];
								dic[subHeadingCount][subsubHeadingCount] = ['list', subsublist, {}];
								dic[subHeadingCount][subsubHeadingCount][2] = temp;
							}
						}
						subsubHeadingCount += 1;
					}
					// if there's only one element
					if (Object.keys(dic[subHeadingCount]).length == 1) {
						dic[subHeadingCount] = dic[subHeadingCount][1];
					}
				} else {
					dic[subHeadingCount] = sublist;
				}
				if (Object.keys(dic[subHeadingCount]).length != 0) {
					subHeadingCount += 1;
				}
			}
		}
		return dic;
	},

	// create dict from the array of nodes
	createDictFromList: function (lists, menu = null) {
		// TODO: how to deal with input and button, form
		// link, the text in the div with other children node
		let invalid_tags = ['b', 'i', 'u', 'div', 'section', 'article', 'a', 'span'];
		let invalid_text_tags = ['b', 'i', 'u', 'a', 'span'];
		let pageDic_t = {};
		let headerCount = 1;
		while (lists.length) {
			let list = lists.shift();
			let name = list.tagName.toLowerCase();
			if(list.getAttribute('aria-hidden') != 'true' && list.style.display != "none") {  // TODO: how to skip the element
				if(name.startsWith("h")) {
					//if the element is header
					pageDic_t[headerCount] = ['header', list];
					headerCount += 1;
				} else if (name == "ul" || name == "ol"){
					// if the element is list
					pageDic_t[headerCount] = ['list', list, {}]
					pageDic_t[headerCount][2] = SP.Webparser.createList(list);
					// if the element before list is header in menuDic, regard this as a title
					if (headerCount > 1) {
						if(pageDic_t[headerCount-1][0] == 'header' && menu){
							headerCount--;
							let title = pageDic_t[headerCount][1].textContent;
							pageDic_t[headerCount] = pageDic_t[headerCount+1];
							pageDic_t[headerCount][2][0] = title;
							delete pageDic_t[headerCount+1];
						}
					}
					// if no element is inside then, delete
					if (Object.keys(pageDic_t[headerCount][2]).length == 0) {
						delete pageDic_t[headerCount];
					} else {
						headerCount += 1;
					}
				} else if (name == "table"){
					//if the element is table
					pageDic_t[headerCount] = ['table', list, {}]
					pageDic_t[headerCount][2] = SP.Webparser.createTable(list);
					// if no element is inside then, delete
					if (Object.keys(pageDic_t[headerCount][2]).length == 0) {
						delete pageDic_t[headerCount];
					} else {
						headerCount += 1;
					}
				} else if (name == "p"){
					if(list.textContent.trim()){
						let linkList = Array.from(list.getElementsByTagName("a"));
						linkList.unshift(null); // make it starts from 1
						pageDic_t[headerCount] = ['paragraph', list, linkList];
						headerCount += 1;
					}
				} else if (name == "img"){
					//if the element is image
					pageDic_t[headerCount] = ['image', list];
					headerCount += 1;
				} else {
					if (invalid_tags.indexOf(name) >=  0) {
						let lists_tmp = list.children;
						if(lists_tmp.length) {
							let lists_tmp_tmp = Array.from(lists_tmp);
							let all = true;

							while (lists_tmp_tmp.length) {
								let list_tmp_tmp = lists_tmp_tmp.shift();
								let name_tmp = list_tmp_tmp.tagName.toLowerCase();
								if (invalid_text_tags.indexOf(name_tmp) < 0) {
									if (invalid_tags.indexOf(name_tmp) >= 0 && list_tmp_tmp.children.length) {
										lists_tmp_tmp = (Array.from(list_tmp_tmp.children)).concat(lists_tmp_tmp);
									} else {
										all = false;
										break;
									}
								}
							}
							
							if (all) {
								let text = list.innerText;
								if (text.trim()) {
									let linkList = Array.from(list.getElementsByTagName("a"));
									linkList.unshift(null); // make it starts from 1
									pageDic_t[headerCount] = ['textblock', list, linkList]; // TODO: list.textContent or list?
									headerCount += 1;
								}
							} else {
								console.log(lists_tmp);
								lists = (Array.from(lists_tmp)).concat(lists);
							}

						} else {
							let text = list.innerText;
							if (text.trim()) {
								let linkList = Array.from(list.getElementsByTagName("a"));
								linkList.unshift(null); // make it starts from 1
								pageDic_t[headerCount] = ['textblock', list, linkList]; // TODO: list.textContent or list?
								headerCount += 1;
							}
						}
					// } else {
					// 	let text = list.textContent;
					// 	if (text.trim()) {
					// 		pageDic_t[headerCount]
					// 	}
					}
				}
			}
		}
		return pageDic_t;
	},

	//create table with label and that element
	createDictFromSource: function (data, Doc) {
		// initialize pageDic
		data.pageDic = {};
		data.menuDic = {};

		let lists = Doc.body.children;
		let menulists = Doc.querySelectorAll('[role = "navigation"]');
		lists = Array.from(lists);
		data.pageDic = SP.Webparser.createDictFromList(lists);
		menulists = Array.from(menulists);
		data.menuDic = SP.Webparser.createDictFromList(menulists, 1);

		// initialized previous dict
		// activatedIndex = [];
		// prevDic = null;
		// activatedDic = null;

		SP.Sound.narrate("page loaded");
		// used for check
		// console.log(data.pageDic);
		// console.log(data.menuDic);
	}
};