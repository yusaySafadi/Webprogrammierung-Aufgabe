"use strict";

import Recorder from "./Recorder.js";
import CanvasProcessor from "./CanvasProcessor.js";
import VideoCutter from "./VideoCutter.js";

const outputCanvas = document.querySelector("#outputCanvas");

let stopButton = document.querySelector("#stop");
let cameraButon = document.querySelector("#camera");

let isCutSelected = false;

let videoList = document.querySelector("#videoList");
let recorders = [];
let markedToCut = [];
//let videos = [];
let video;
let cameraVideo;
let clicked = false;
const player = document.getElementById("display");
const cameraPlayer = document.getElementById("cameraDisplay");
const slider = document.querySelector("#slider1");
const recordButtonOptions = document.querySelector("#record");
const recorderButton = document.querySelector("#recorder");
const downloadButton = document.querySelector("button#download");
const finishButton = document.querySelector("#finish");

const cameraOption = document.querySelector("#cameraOption");

const processor = new CanvasProcessor(outputCanvas, player, cameraPlayer);
let videoCutter = new VideoCutter();
let screenRecorder = null;
let cameraRecorder = null;
let canvasRecorder;

const displayMediaOptionsCamera = {
  video: { width: { min: 1280 }, height: { min: 720 } },
};
const displayMediaOptions = {
  video: {
    cursor: true,
  },
};
//DECLARED FUNCTIONS
function playerCutting() {
  if (videoCutter.allCutMarks.length > 0) {
    if (
      player.currentTime > videoCutter.allCutMarks[0][0] &&
      player.currentTime < videoCutter.allCutMarks[0][1]
      
    ) {
      player.currentTime = videoCutter.allCutMarks[0][1];
      videoCutter.allCutMarks.shift();
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
//EVENT LISTENERS
recordButtonOptions.addEventListener("click", (e) => {
  document.querySelector(".recordOptions").classList.toggle("activeOptions");
  document.querySelector(".container").classList.toggle("containerCollapsed");
});
recorderButton.addEventListener("click", (e) => {
  if (cameraOption.checked) {
    navigator.mediaDevices
      .getUserMedia(displayMediaOptionsCamera)
      .then((stream) => {
        cameraRecorder = new Recorder(
          stream,
          displayMediaOptionsCamera,
          "camera"
        );
      });
  }
  navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then((stream) => {
    screenRecorder = new Recorder(stream, displayMediaOptions, "screen");
    if (cameraRecorder != null) {
      cameraRecorder.start(1);
    }
    screenRecorder.start(1);
  });
});
downloadButton.addEventListener("click", (e) => {
  /*videos.push(video);
  let li = document.createElement("li");
  li.innerHTML = "video";
  videoList.append(li);
  li.addEventListener("click", (e) => {
    //video.download();
    video.showVideo();
    player.play();
  });*/
});
player.addEventListener("timeupdate", function () {
  slider.value = player.currentTime;
});
stopButton.addEventListener("click", (e) => {
  if (cameraRecorder !== null) {
    cameraRecorder.stop();
  }
  if (screenRecorder !== null) {
    screenRecorder.stop();
    video = screenRecorder.getVideo();
  }
  
  video.showVideo();
  if (cameraRecorder !== null) {
    cameraVideo = cameraRecorder.getVideo();
    cameraVideo.showVideo();
    cameraPlayer.play();
  }
  //player.play();
});
slider.addEventListener("change", function (e) {
  player.currentTime = slider.value;
});

finishButton.addEventListener("click", (e) => {
  let canvasstream = outputCanvas.captureStream();
  canvasRecorder = new Recorder(canvasstream, displayMediaOptions);
  player.currentTime = 0;
  player.play();
  if (cameraRecorder !== null) {
    cameraPlayer.currentTime = 0;
    cameraPlayer.play();
  }

  canvasRecorder.start(1);
  player.addEventListener("timeupdate", playerCutting);
  player.addEventListener(
    "ended",
    (e) => {
      canvasRecorder.stop();
      canvasRecorder.download();
      /*
      let formData = new FormData();
      let blobs = new Blob(canvasRecorder.getRecordedBlobs());
      console.log(blobs);
      formData.append("blobFile", blobs);
  
      fetch("videoServer.php", {
        method: "POST",
        body: formData,
      }).then(() => {
        alert("streamed video file uploaded");
        
      });*/
    },
    { once: true }
  );
});
