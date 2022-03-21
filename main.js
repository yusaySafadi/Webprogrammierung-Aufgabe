'use strict';

import Recorder from "./Recorder.js";


const player = document.getElementById("display");
let recordButton = document.querySelector("#record");
let stopButton = document.querySelector("#stop");
let cameraButon = document.querySelector("#camera");
let cutButton = document.querySelector("#cut");
let slider = document.querySelector("#slider1");
let timeRangeselectionDiv = document.querySelector("#timeRangeSelection");
let isCutSelected = false;
let firstSlideValue = 0;

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

    cutButton.addEventListener("click", (e) =>{
      if(!isCutSelected){
        isCutSelected = true;
        firstSlideValue  = slider.value ;
    }else{
      let secondValue = slider.value;

      let firstpercent = (firstSlideValue/ slider.max)*100.00;
      let secondpercent = 100- ((secondValue /slider.max)*100.00);



      console.log(firstpercent)
      console.log(secondpercent)
      isCutSelected=false;

      let cutSection = document.createElement("div");
      cutSection.className = "selectedCut";
      cutSection.style.left = firstSlideValue +"%"
      cutSection.style.right = secondpercent + "%";

      timeRangeselectionDiv.appendChild(cutSection);



    }
  })
  
  }
}
let main = new Main();