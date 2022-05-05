"use strict";

const timeRangeSelection = document.querySelector("#timeRangeSelection");
const timeSlider = document.getElementById("slider1");
const player = document.getElementById("display");
const cameraPlayer = document.getElementById("cameraDisplay");
let startElement = document.querySelector("#currentTime");
let endElement = document.querySelector("#endTime");
export default class Video {
  length;
  originalDuration;
  source;
  
  blobs = [];

  constructor(blobs, originalDuration,inputMedia) {
    this.inputMedia = inputMedia;
    this.processor = {};
    this.blobs = blobs;
    this.originalDuration = originalDuration;
    this.length = blobs.length;
  }
  showVideo() {
    const blob = new Blob(this.blobs);
    const url = window.URL.createObjectURL(blob);
    if(this.inputMedia ==="screen"){
      player.src = url;
    } else{
      cameraPlayer.src = url;
    }
    
    this.showSlider();
  }

  download() {
    const blob = new Blob(this.blobs);
    const url = window.URL.createObjectURL(blob);
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
  }

  showSlider() {
    timeSlider.min = 0;
    timeSlider.max = this.originalDuration / 1000;
    timeSlider.width = outputCanvas.width;
    timeSlider.step = 0.001;
    timeSlider.style.display = "block";
    timeRangeSelection.style.width = "1280px";

    //startElement.innerHTML = 0;
    //endElement.innerHTML = this.originalDuration;

  }
}
