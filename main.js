"use strict";

import Recorder from "./Recorder.js";
import CanvasProcessor from "./CanvasProcessor.js";
import VideoCutter from "./VideoCutter.js";

const outputCanvas = document.querySelector("#outputCanvas");
const stopButton = document.querySelector("#stop");
const effectsButton = document.querySelector("#effects");
const effectsOptionsButton = document.querySelector("#effectsOptionsButton");
const effectButtons= document.querySelectorAll("#effectsOptionsButton > button");

let video;
let cameraVideo;
const player = document.getElementById("display");
const cameraPlayer = document.getElementById("cameraDisplay");
const slider = document.querySelector("#slider1");
const recordButtonOptions = document.querySelector("#record");
const recorderButton = document.querySelector("#recorder");
const downloadButton = document.querySelector("button#download");
const finishButton = document.querySelector("#finish");
const cutButton = document.querySelector("#cut");

const cameraOption = document.querySelector("#cameraOption");
const microphoneOption =document.querySelector("#microphoneOption");

let cameraOptionSelected = false;
let microphoneOptionSelected= false;

let processor = new CanvasProcessor(outputCanvas, player, cameraPlayer);
let videoCutter = new VideoCutter();
let screenRecorder = null;
let cameraRecorder = null;
let canvasRecorder = null;

const displayMediaOptionsCamera = {
  audio: true,
  video: { width: { min: 1280 }, height: { min: 720 } },
  mimeType: "video/webm;codecs=vp8,opus",
};
const displayMediaOptions = {
  audio: true,
  video: {
    cursor: true,
  },
  
};

//DECLARED FUNCTIONS
function reset(){
  processor = new CanvasProcessor(outputCanvas, player, cameraPlayer);
  videoCutter = new VideoCutter();
  screenRecorder = null;
  cameraRecorder = null;
  canvasRecorder = null;
}
function playerCutting() {
  if (videoCutter.allCutMarks.length > 0) {
    if (
      player.currentTime > videoCutter.allCutMarks[0][0] &&
      player.currentTime < videoCutter.allCutMarks[0][1]
    ) {
      player.currentTime = videoCutter.allCutMarks[0][1];
      cameraPlayer.currentTime = videoCutter.allCutMarks[0][1];
      videoCutter.allCutMarks.shift();
    }
  }
}

function uploadToServer(recordedBlobs){

  let formData = new FormData();
  let blobs = new Blob(recordedBlobs);
  formData.append("blobFile", blobs);
  fetch("videoServer.php", {
    method: "POST",
    body: formData,
  }).then(() => {
    alert("streamed video file uploaded");
    
  });
}

//EVENT LISTENERS
recordButtonOptions.addEventListener("click", (e) => {
  if( document.querySelector(".recordOptions").classList.contains("activeOptions")){
    document.querySelector(".recordOptions").classList.remove("activeOptions");
    document.querySelector(".container").classList.remove("containerCollapsed")
    document.querySelector(".effectsOptions").classList.remove("activeOptions");
  }else{
    document.querySelector(".recordOptions").classList.add("activeOptions");
    document.querySelector(".container").classList.add("containerCollapsed")
    document.querySelector(".effectsOptions").classList.remove("activeOptions");
  }
  
});
recorderButton.addEventListener("click", (e) => {
  cameraOptionSelected = cameraOption.checked;
  microphoneOptionSelected = microphoneOption.checked;
  if (cameraOptionSelected) {
    if(microphoneOptionSelected){
      displayMediaOptionsCamera.video = true;
    }
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
    recorderButton.style.display="none";
    stopButton.style.display ="block";
  });
});

player.addEventListener("timeupdate", function () {
  slider.value = player.currentTime;
});
stopButton.addEventListener("click", (e) => {
  recorderButton.style.display = "block";
  cutButton.style.display ="block";
  finishButton.style.display="block";

  stopButton.style.display = "none";

  if (cameraRecorder !== null) {
    cameraRecorder.stop();
  }
  screenRecorder.stop();
  video = screenRecorder.getVideo();

  video.showVideo();

  if (cameraRecorder !== null) {
    cameraVideo = cameraRecorder.getVideo();
    cameraVideo.showVideo();
    cameraPlayer.play();
    //player.play();
  }else{
    //player.play();
  }
  
  
});

slider.addEventListener("change", function (e) {
  player.currentTime = slider.value;
  if(cameraRecorder !==null){
    cameraPlayer.currentTime = slider.value;

  }
});

finishButton.addEventListener("click", (e) => {
  let canvasstream = outputCanvas.captureStream();
  let recStream = new MediaStream();
  recStream.addTrack(canvasstream.getVideoTracks()[0]);

  player.currentTime = 0;
  player.play();
  if (cameraRecorder !== null ) {
    cameraPlayer.currentTime = 0;
    cameraPlayer.play();
    if(microphoneOptionSelected){
      let camStream = cameraPlayer.mozCaptureStream();
      recStream.addTrack(camStream.getAudioTracks()[0]);
    }
    
  }

  canvasRecorder = new Recorder(recStream, displayMediaOptions);
  canvasRecorder.start(1);
  player.addEventListener("timeupdate", playerCutting);
  player.addEventListener(
    "ended",
    (e) => {
      canvasRecorder.stop();
      canvasRecorder.download();
      uploadToServer(canvasRecorder.getRecordedBlobs());
      reset();
    },
    { once: true }
  );
  
});

effectsButton.addEventListener("click", (e) => {
  if( document.querySelector(".effectsOptions").classList.contains("activeOptions")){
    document.querySelector(".effectsOptions").classList.remove("activeOptions");
    document.querySelector(".container").classList.remove("containerCollapsed");
    document.querySelector(".recordOptions").classList.remove("activeOptions");
    
  }else{
    document.querySelector(".effectsOptions").classList.add("activeOptions");
    document.querySelector(".container").classList.add("containerCollapsed");
    document.querySelector(".recordOptions").classList.remove("activeOptions");
  }
 

  
  
});
effectButtons.forEach(element => {
  element.addEventListener("click",e => {
    console.log("")
    processor.frameMode = element.innerHTML.toLowerCase();
  })
});
