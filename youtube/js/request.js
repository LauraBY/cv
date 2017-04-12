'use strict'

let pagination = require("./pagination");
let player = require("./video");

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
