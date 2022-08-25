"use strict";

import Recorder from "./Recorder.js";
import CanvasProcessor from "./CanvasProcessor.js";
import VideoCutter from "./VideoCutter.js";

const outputCanvas = document.querySelector("#outputCanvas");
const stopButton = document.querySelector("#stop");
const effectsButton = document.querySelector("#effects");
const effectsOptionsButton = document.querySelector("#effectsOptionsButton");
const effectButtons = document.querySelectorAll(
  "#effectsOptionsButton > button"
);

let video;
let cameraVideo;
const player = document.getElementById("display");
const cameraPlayer = document.getElementById("cameraDisplay");
const slider = document.querySelector("#slider1");
const recordButtonOptions = document.querySelector("#record");
const recorderButton = document.querySelector("#recorder");
//const downloadButton = document.querySelector("button#download");
const finishButton = document.querySelector("#finish");
const cutButton = document.querySelector("#cut");

const cameraOption = document.querySelector("#cameraOption");
const microphoneOption = document.querySelector("#microphoneOption");

let cameraOptionSelected = false;
let microphoneOptionSelected = false;

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
const finalDisplayMediaOptions = {
  mimeType: "video/webm",
};

//DECLARED FUNCTIONS

//reset
function reset() {
  processor = new CanvasProcessor(outputCanvas, player, cameraPlayer);
  videoCutter = new VideoCutter();
  screenRecorder = null;
  cameraRecorder = null;
  canvasRecorder = null;
}
//Funktion zum Schneiden von den Markierten Abschnitten
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

//Blob an Server hochladen
function uploadToServer(recordedBlobs) {
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
  if (
    document.querySelector(".recordOptions").classList.contains("activeOptions")
  ) {
    document.querySelector(".recordOptions").classList.remove("activeOptions");
    document.querySelector(".container").classList.remove("containerCollapsed");
    document.querySelector(".effectsOptions").classList.remove("activeOptions");
  } else {
    document.querySelector(".recordOptions").classList.add("activeOptions");
    document.querySelector(".container").classList.add("containerCollapsed");
    document.querySelector(".effectsOptions").classList.remove("activeOptions");
  }
});

//Video aufnehmen
recorderButton.addEventListener("click", (e) => {
  cutButton.style.display = "none";
  finishButton.style.display = "none";
  effectsButton.style.display = "none";

  cameraOptionSelected = cameraOption.checked;
  microphoneOptionSelected = microphoneOption.checked;
  if (cameraOptionSelected) {
    if (microphoneOptionSelected) {
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
      })
      .catch((error) => console.log(error));
  }
  navigator.mediaDevices
    .getDisplayMedia(displayMediaOptions)
    .then((stream) => {
      screenRecorder = new Recorder(stream, displayMediaOptions, "screen");
      if (cameraRecorder != null) {
        cameraRecorder.start(1);
      }
      screenRecorder.start(1);
      recorderButton.style.display = "none";
      stopButton.style.display = "block";
    })
    .catch((error) => console.log(error));
});

//Sliderposition anpassen, wenn Video abspielt
player.addEventListener("timeupdate", function () {
  slider.value = player.currentTime;
});
//Videoaufnahme stoppen
stopButton.addEventListener("click", (e) => {
  recorderButton.style.display = "block";
  cutButton.style.display = "block";
  finishButton.style.display = "block";
  effectsButton.style.display = "block";
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
    player.play();
  } else {
    player.play();
  }
});
//Slider die Position vom echten Videoslider ändern lassen
slider.addEventListener("change", function (e) {
  player.currentTime = slider.value;
  if (cameraRecorder !== null) {
    cameraPlayer.currentTime = slider.value;
  }
});

//Video "rendern" und hochladen
finishButton.addEventListener("click", (e) => {
  //Canvas wird aufgenommen
  let canvasstream = outputCanvas.captureStream();
  //let camStream = cameraPlayer.mozCaptureStream(); //mozCaptureStream für Firefox

  let recStream = new MediaStream();
  recStream.addTrack(canvasstream.getVideoTracks()[0]);

  player.currentTime = 0;

  if (cameraRecorder !== null) {
    cameraPlayer.currentTime = 0;

    /**@type{AudioContext} */
    const audioCtx = new AudioContext();
    let dest = audioCtx.createMediaStreamDestination();
    let sourceNode = audioCtx.createMediaElementSource(cameraPlayer);
    sourceNode.connect(dest);
    sourceNode.connect(audioCtx.destination);
    let audioTrack = dest.stream.getAudioTracks()[0];
    recStream.addTrack(audioTrack);
    player.play();
    //cameraPlayer.load();
    cameraPlayer.play();
    //recStream.addTrack(camStream.getAudioTracks()[0]);

    if (microphoneOptionSelected) {
    }
  }

  canvasRecorder = new Recorder(recStream, {});
  canvasRecorder.start(1);
  player.addEventListener("timeupdate", playerCutting);
  //Wenn das Video fertig "gerendert" hat, hochladen
  player.addEventListener(
    "ended",
    (e) => {
      canvasRecorder.stop();
      canvasRecorder.download();
      uploadToServer(canvasRecorder.getRecordedBlobs());
      //reset();
    },
    { once: true }
  );
});

effectsButton.addEventListener("click", (e) => {
  if (
    document
      .querySelector(".effectsOptions")
      .classList.contains("activeOptions")
  ) {
    document.querySelector(".effectsOptions").classList.remove("activeOptions");
    document.querySelector(".container").classList.remove("containerCollapsed");
    document.querySelector(".recordOptions").classList.remove("activeOptions");
  } else {
    document.querySelector(".effectsOptions").classList.add("activeOptions");
    document.querySelector(".container").classList.add("containerCollapsed");
    document.querySelector(".recordOptions").classList.remove("activeOptions");
  }
});
effectButtons.forEach((element) => {
  element.addEventListener("click", (e) => {
    processor.frameMode = element.innerHTML.toLowerCase();
  });
});
