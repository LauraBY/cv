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
