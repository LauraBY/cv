'use strict'

let request = require("./request");
let player = require("./video");

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
