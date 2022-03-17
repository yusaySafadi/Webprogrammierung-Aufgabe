'use strict';

import Recorder from "./Recorder.js";


const player = document.getElementById("display");
let recordButton = document.querySelector("#record");
let stopButton = document.querySelector("#stop");
let cameraButon = document.querySelector("#camera");

let downloadButton = document.querySelector("button#download");
let videoList = document.querySelector("#videoList")
class Main {
  recorder;
  videos;
  constructor() {
    this.recorder = {};
    this.videos = [];
    var displayMediaOptions = {
      video: {
        cursor:
          "always",
      },
      audio: false,
    };

    recordButton.addEventListener("click", (e) => {
      navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then((stream) => {
        recordButton.disabled = true;


        this.recorder = new Recorder(stream, displayMediaOptions);
        this.recorder.start(1);

      })



    })

    downloadButton.addEventListener("click", () => {
      let video = this.recorder.getVideo();
      this.videos.push(video);
      let li = document.createElement("li");
      li.innerHTML = "video";
      videoList.append(li);
      li.addEventListener("click", (e) => {
        //video.download();
        video.showVideo(player);
        player.play();
      })

    })

  }


}
let main = new Main();