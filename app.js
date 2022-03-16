"use strict";
var player = document.getElementById("display");
let recordButton = document.querySelector("#record");
let stopButton = document.querySelector("#stop");
let cameraButon = document.querySelector("#camera");

let canvas = document.querySelector("#canvas");
const downloadButton = document.querySelector("button#download");

let startTime;
let endTime;
let timeDiff;

//let context = canvas.getContext("2d");

let cameraStream = null;
let recordedBlobs = [];
let mediaRecorder;
var options = { mimeType: "video/webm; codecs=vp9" };
var displayMediaOptions = {
  video: {
    cursor: "always",
  },
  audio: false,
};
recordButton.addEventListener(
  "click",
  (e) => {
    startCapture();
  },
  false
);

stopButton.addEventListener(
  "click",
  (evt) => {
    mediaRecorder.stop();
  },
  false
);
async function startCapture() {
  try {
    let stream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
    canvas.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;

    mediaRecorder.onstop = stopCapture;
    mediaRecorder.start();
    stopButton.style.display= "block";
    startTime = new Date;
  } catch (error) {
    console.error("Error" + error);
  }
}

function stopCapture() {
  endTime = new Date();
  timeDiff = endTime - startTime;
  console.log(timeDiff);
  stopButton.style.display="none";

}

function handleDataAvailable(event) {
  console.log("handleDataAvailable", event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}


downloadButton.addEventListener("click", () => {
  const blob = new Blob(recordedBlobs, { type: "video/webm" });
  const url = window.URL.createObjectURL(blob);
  player.src = url;
  player.play();
  console.log(player.duration);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "test.webm";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

/*
player.addEventListener(
  "play",
  () => {
    requestAnimationFrame(updateCanvas());
  },
  false
);

function updateCanvas() {
  if (player.ended || player.paused) {
    return;
  }
  context.drawImage(player, 0, 0, player.width, player.height);
  requestAnimationFrame(updateCanvas());
}
recordButton.addEventListener("click", () => {
  mediaRecorder = new MediaRecorder(cameraStream, { mimeType: "video/webm" });

  mediaRecorder.addEventListener("dataavaiable", (e) => {
    recorded.push(e.data);
  });
  //mediaRecorder.start();
  recordButton.style.background = "red";
});
cameraButon.addEventListener("click", async () => {
  cameraStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  player.srcObject = cameraStream;
});
*/
