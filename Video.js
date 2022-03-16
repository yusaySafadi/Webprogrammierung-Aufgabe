'use strict';

import CanvasProcessor from "./CanvasProcessor.js";

export default class Video {

    length;
    originalDuration;
    source;
    blobs = [];

    constructor(blobs, originalDuration) {
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
        let canvasProcessor = new CanvasProcessor(outputCanvas, videoElement);


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


