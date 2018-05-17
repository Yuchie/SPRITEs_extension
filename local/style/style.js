"use strict";

window.onload = function() {
	document.getElementById('title').innerHTML = decodeURI(query.split('&')[0]);
	document.getElementById('url').innerHTML = query.split('&')[1];
};