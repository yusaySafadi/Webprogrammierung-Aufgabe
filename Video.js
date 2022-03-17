'use strict';

import CanvasProcessor from "./CanvasProcessor.js";

export default class Video {

    length;
    originalDuration;
    source;
    processor;
    blobs = [];

    constructor(blobs, originalDuration) {
        this.processor = {}
        this.blobs = blobs;
        this.originalDuration = originalDuration;
        this.length = blobs.length;

    }
    showVideo(videoElement) {
        const blob = new Blob(this.blobs)
        const url = window.URL.createObjectURL(blob)
        videoElement.src = url;
        console.log(videoElement.duration);


        let startElement = document.querySelector("#currentTime");
        let endElement = document.querySelector("#endTime");

        startElement.innerHTML = 0;
        endElement.innerHTML = this.originalDuration;

        videoElement.addEventListener("timeupdate", (e) => {
            startElement.innerHTML = videoElement.currentTime;
        })


        const outputCanvas = document.querySelector("#outputCanvas");
        this.processor = new CanvasProcessor(outputCanvas, videoElement);
        const timeRangeSelection = document.querySelector("#timeRangeSelection");
        const timeSlider = document.createElement("input");
        timeSlider.type = "range";
        timeSlider.min = 0;
        timeSlider.max = this.originalDuration /1000;
        timeSlider.id = "slider1";
        timeSlider.className = "slider";
        timeSlider.width = outputCanvas.width;
        timeSlider.step = 0.1;

        timeRangeSelection.appendChild(timeSlider)
        timeRangeSelection.style.width = "1280px";

        timeSlider.addEventListener("change", (e) => {
            console.log(timeSlider.value);
            videoElement.currentTime = timeSlider.value;
        })





    }
    download() {

        const blob = new Blob(this.blobs)
        const url = window.URL.createObjectURL(blob)
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
}


