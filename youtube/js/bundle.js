var home =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	let request = __webpack_require__(1);
	let player = __webpack_require__(3);

	document.querySelector("#search").addEventListener("submit", function(evt) {
	    request.requertResults();
	    evt.preventDefault();
	}, false);

	let linkPrev = document.querySelector(".pagination .prev");
	let linkNext = document.querySelector(".pagination .next");

	linkPrev.addEventListener("click", function(evt) {
	    request.reqsuertResults(linkPrev.dataset.token);
	    evt.preventDefault();
	}, false);

	linkNext.addEventListener("click", function(evt) {
	    request.requertResults(linkNext.dataset.token);
	    evt.preventDefault();
	}, false);

	document.querySelector(".video .close").addEventListener("click", function() {
	    let video = document.querySelector(".video");
	    video.classList.add("hide");
	    player.stop();
	}, false);

	exports.player = player;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	let pagination = __webpack_require__(2);
	let player = __webpack_require__(3);

	const apiSearchUrl = "https://www.googleapis.com/youtube/v3/search";
	const apiVideosUrl = "https://www.googleapis.com/youtube/v3/videos";
	const key = "AIzaSyA8EeU2jUSXTJgi8RjGOjIkUeEzhbzP6t0";

	module.exports = {
	    requertResults: requertResults,
	    getResults: getResults
	}

	let req = new XMLHttpRequest();

	function requertResults(token) {
	    let q = document.getElementById("query").value;
	    let url = apiSearchUrl + "?" + "key=" + key + "&part=snippet&type=video&maxResults=6&q=" + q;

	    if (typeof token != "undefined") {
	        url += "&pageToken=" + token;
	    }

	    req.onload = getResults;
	    req.open("get", url, true);
	    req.send();
	}

	function getResults() {
	    let res = JSON.parse(req.responseText);

	    let ul = document.querySelector(".result");
	    ul.innerHTML = "";

	    for (let i = 0; i < res.items.length; i++) {
	        let newLi = document.createElement("li");
	        newLi.innerHTML = "<h4>" + res.items[i].snippet.title + "</h4>";
	        newLi.innerHTML += "<a href=\"#\" data-videoid=\"" + res.items[i].id.videoId + "\"><img src='" + res.items[i].snippet.thumbnails.medium.url + "' alt=\"видео\"></a>";
	        ul.appendChild(newLi);
	    }

	    document.querySelectorAll(".result a").forEach(function(link) {
	        link.addEventListener("click", function(evt) {
	            let video = document.querySelector(".video");
	            video.classList.remove("hide");

	            player.play(this.dataset.videoid);

	            evt.preventDefault();
	        }, false);
	    });

	    let ids = [];
	    res.items.forEach(function (item) {
	      ids.push(item.id.videoId);
	    });
	    getStatistics(ids);

	    pagination.pagination(res);
	}

	function getStatistics(ids) {
	  let url = apiVideosUrl + "?" + "key=" + key + "&part=statistics&id=" + ids.join(",");

	  req.onload = outputStatistics;
	  req.open("get", url, true);
	  req.send();
	}

	function outputStatistics() {
	  let res = JSON.parse(req.responseText);

	  let videos = document.querySelectorAll(".result li");

	  videos.forEach(function (video) {
	      let videoId = video.querySelector("a").dataset.videoid;

	      let item = res.items.find(function(element) {
	        if (element.id == videoId) {
	          return true;
	        } else {
	          return false;
	        }
	      });

	      let statistics = document.createElement("ul");
	      statistics.classList.add("discription");
	      statistics.innerHTML = "<li class='views'>" + "Views: " + item.statistics.viewCount + "</li>";
	      statistics.innerHTML += "<li class='like'>" + "Likes: " + item.statistics.likeCount + "</li>";
	      statistics.innerHTML += "<li class='dislike'>" + "Dislikes: " + item.statistics.dislikeCount + "</li>";
	      video.appendChild(statistics);
	  });
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict'

	module.exports = {
	    pagination: function(res) {
	        let prev = document.querySelector(".pagination .prev");
	        let next = document.querySelector(".pagination .next");

	        if (typeof res.prevPageToken == "undefined") {
	            prev.classList.remove("active");
	            prev.dataset.token = "";
	        } else {
	            prev.classList.add("active");
	            prev.dataset.token = res.prevPageToken;
	        }

	        if (typeof res.nextPageToken == "undefined") {
	            next.classList.remove("active");
	            next.dataset.token = "";
	        } else {
	            next.classList.add("active");
	            next.dataset.token = res.nextPageToken;
	        }
	    }
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict'

	module.exports = {
	    player: null,

	    init: function() {
	        this.player = new YT.Player("player", {
	            height: "390",
	            width: "640"
	        });
	    },

	    play: function(videoId) {
	        this.player.loadVideoById(videoId);
	        this.player.playVideo();
	    },

	    stop: function() {
	        this.player.stopVideo();
	    }
	}


/***/ }
/******/ ]);