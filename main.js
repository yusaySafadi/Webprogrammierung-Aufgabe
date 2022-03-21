"use strict";

import Recorder from "./Recorder.js";
import CanvasProcessor from "./CanvasProcessor.js";
import VideoCutter from "./VideoCutter.js";
const outputCanvas = document.querySelector("#outputCanvas");

let stopButton = document.querySelector("#stop");
let cameraButon = document.querySelector("#camera");


let isCutSelected = false;
let firstSlideValue = 0;

let videoList = document.querySelector("#videoList");
class Main {
  recorder;
  videos;
  newRecorder;
  clicked;

  constructor() {
    this.markedToCut = [];
    this.clicked = false;
    this.player = document.getElementById("display");
    this.slider = document.querySelector("#slider1");
    this.recordButton = document.querySelector("#record");
    this.downloadButton = document.querySelector("button#download");
    this.finishButton = document.querySelector("#finish");
 
    this.processor = new CanvasProcessor(outputCanvas, this.player);
    this.videoCutter = new VideoCutter();

    this.videos = [];
    this.displayMediaOptions = {
      video: {
        cursor: "always",
      },
      audio: false,
    };

    this.recordButton.onclick = this.recordButtonClick.bind(this);
    this.downloadButton.onclick = this.downloadButtonClick.bind(this);

    this.finishButton.onclick = this.finishButtonClick.bind(this);


    this.player.addEventListener(
      "timeupdate",
      function () {
        this.slider.value = this.player.currentTime;
      }.bind(this)
    );

    this.slider.addEventListener(
      "change",
      function (e) {
        this.player.currentTime = this.slider.value;
      }.bind(this)
    );
  }

  finishButtonClick(event) {
    if (!this.clicked) {
      this.clicked = true;
      let canvasstream = outputCanvas.captureStream();
      this.newRecorder = new Recorder(canvasstream, this.displayMediaOptions);
      this.player.currentTime = 0;
      this.player.play();
      this.newRecorder.start(1);
      this.player.ontimeupdate = this.playerCut.bind(this);
    } else {
      this.newRecorder.stop();
      this.clicked = false;
      this.newRecorder.download();
    }
  }

  playerCut(event) {
    if(this.videoCutter.allCutMarks.length >0){
      if (
        this.player.currentTime > this.videoCutter.allCutMarks[0][0] &&
        this.player.currentTime < this.videoCutter.allCutMarks[0][1]
      ) {
        this.player.currentTime = this.videoCutter.allCutMarks[0][1];
        this.videoCutter.allCutMarks.shift();
      }

    }
    
    /*
      if(this.player.currentTime >= this.markedToCut[0] && this.newRecorder.ispaused === false){
        this.newRecorder.pause();
      }
      if(this.player.currentTime >= this.markedToCut[1] && this.newRecorder.ispaused === true){
        this.newRecorder.resume();
      }*/
  }
  downloadButtonClick(event) {
    let video = this.recorder.getVideo();
    this.videos.push(video);
    let li = document.createElement("li");
    li.innerHTML = "video";
    videoList.append(li);
    li.addEventListener("click", (e) => {
      //video.download();
      video.showVideo();
      this.player.play();
    });
  }

  recordButtonClick(event) {
    navigator.mediaDevices
      .getDisplayMedia(this.displayMediaOptions)
      .then((stream) => {
        this.recordButton.disabled = true;

        this.recorder = new Recorder(stream, this.displayMediaOptions);
        this.recorder.start(1);
      });
  }
}
let main = new Main();
