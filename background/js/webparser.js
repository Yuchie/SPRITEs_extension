// -----------------------------------------------
// webparser.js
// -----------------------------------------------
// Author: Yuqian Sun
// Last Update: June 5th, 2018
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
						temp = temps[j];

						if(temp.tagName == "TH" || temp.tagName == "TD") {
							while(dic[rowCount].hasOwnProperty(colCount)) {
								// skip to the first available column value
								colCount += 1;
							}
							dic[rowCount][colCount] = temp;
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

	//create menu list
	createMenu: function(list) {
		let invalid_tags = ['B', 'I', 'U', 'DIV'];
		let subHeadingCount = 1;
		let dic = {};
		let sublists = list.children;
		//get each element in the list
		for (let i=0; i<sublists.length; i++) {
			sublist = sublists[i];
			if (sublist.tagName == "LI") {
				let subsublists = sublist.querySelectorAll('ul, ol');
				if (subsublists.length) {
					let subsubHeadingCount = 1;
					for (let j=0; j<subsublists.length; j++) {
						let subsublist = subsublists[j];
						dic[subHeadingCount] = {};
						if (subsublist.tagName == "UL" || subsublist.tagName == "OL") {
							//recursive funvtion for submenu
							dic[subHeadingCount][subsubHeadingCount] = SP.Webparser.createMenu(subsublist);
						} else {
							dic[subHeadingCount][subsubHeadingCount] = subsublist;
						}
						subsubHeadingCount += 1;
					}
				} else {
					dic[subHeadingCount] = sublist;
				}
				subHeadingCount += 1;
			}
		}
		return dic;
	},

	// create dict from the array of nodes
	createDictFromList: function (lists, menu = null) {
		// TODO: how to deal with input and button, form
		let invalid_tags = ['b', 'i', 'u', 'a', 'div'];
		pageDic_t = {};
		headerCount = 1;
		while (lists.length) {
			let list = lists.shift();
			let name = list.tagName.toLowerCase();
			if(list.getAttribute('aria-hidden') != 'true') {  // TODO: how to skip the element
				if(name.startsWith("h")) {
					//if the element is header
					pageDic_t[headerCount] = ['header', list];
					headerCount += 1;
				} else if (name == "ul" || name == "ol"){
					// if the element is list
					pageDic_t[headerCount] = ['menubar', {}]
					pageDic_t[headerCount][1] = SP.Webparser.createMenu(list);
					// if the element before menubar is header in menuDic, regard this as a title
					if(pageDic_t[headerCount-1][0] == 'header' && menu){
						headerCount--;
						let title = pageDic_t[headerCount][1].innerText;
						pageDic_t[headerCount] = pageDic_t[headerCount+1];
						pageDic_t[headerCount][1][0] = title;
						delete pageDic_t[headerCount+1];
					}
					headerCount += 1;
				} else if (name == "table"){
					//if the element is table
					pageDic_t[headerCount] = ['table', {}]
					pageDic_t[headerCount][1] = SP.Webparser.createTable(list);
					headerCount = headerCount + 1;
				} else if (name == "p"){
					if(list.innerHTML){
						pageDic_t[headerCount] = ['paragraph', list];
						headerCount += 1;
					}
				} else {
					if (invalid_tags.indexOf(name) >=  0) {
						let list_tmp = list.children;
						if(list_tmp.length) {
							list_tmp = Array.from(list_tmp);
							lists = list_tmp.concat(lists);
						} else {
							let text = list.textContent;
							if (text.trim()) {
								pageDic_t[headerCount] = ['textblock', list]; // TODO: list.textContent or list?
								headerCount += 1;
							}
						}
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
		// pagescroll = [0, 0, 0, 0];
		// menuscroll = [0, 0, 0, 0];
		// prevIndex = [];
		// activatedIndex = [];
		// prevDic = null;
		// activatedDic = null;
		// spritesSubmode = null;

		console.log("create dict finished");
	}
};