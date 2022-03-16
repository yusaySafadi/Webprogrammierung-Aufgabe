export default class CanvasProcessor {


    constructor(canvasElement, videoElement) {
        this.video = videoElement;
        this.canvas = canvasElement;

        /**@type{CanvasRenderingContext2D} */
        this.canvasCtx = this.canvas.getContext("2d");

        this.video.addEventListener("play", function (e) {
            this.width = this.video.videoWidth / 2;
            this.height = this.video.videoHeight / 2;
            this.timerCallback();
        }.bind(this), false);
    }

    timerCallback() {

        if (this.video.paused || this.video.ended) {
            return;
        }
        this.computeFrame();
        setTimeout(() => {
            this.timerCallback();
        }, 0);
    }

    computeFrame() {
        console.log("ffsdf")
        this.canvasCtx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    }



}