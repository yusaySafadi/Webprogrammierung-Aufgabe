export default class CanvasProcessor {
  constructor(canvasElement, videoElement, cameraVideo) {
    this.cameraVideo = cameraVideo;
    this.video = videoElement;
    this.canvas = canvasElement;
    this.frameMode = "normal";
    this.canvas.width = 1280;
    this.canvas.height = 720;
    this.scale = 0;
    /**@type{CanvasRenderingContext2D} */
    this.canvasCtx = this.canvas.getContext("2d");

    this.video.addEventListener("play", this.onPlay.bind(this), false);
    this.cameraVideo.addEventListener("play", this.onPlay.bind(this), false);
    this.video.addEventListener(
      "loadedmetadata",
      this.onLoadedMetaData.bind(this)
    );
    document
      .querySelector("#camera")
      .addEventListener("click", this.onClickEvent.bind(this));
  }

  onClickEvent(event) {
    if (this.frameMode === "normal") {
      this.frameMode = "greyScale";
    } else {
      this.frameMode = "normal";
    }
  }

  onLoadedMetaData(event) {
   
    
  }
  onPlay(event) {
    this.timerCallback();
  }

  timerCallback() {
    /*
        if (this.video.paused || this.video.ended) {
            return;
        }*/
    this.computeFrame();
    setTimeout(() => {
      this.timerCallback();
    }, 0);
  }

  computeFrame() {
    this.scale = Math.min(this.canvas.width / this.video.videoWidth, this.canvas.height / this.video.videoHeight);
    //console.log("ffsdf")
    //console.log(this.video.currentTime);
    this.canvasCtx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    this.canvasCtx.drawImage(this.cameraVideo,0,0,this.canvas.width/2, this.canvas.height/2)
    console.log(this.scale)
    if (this.frameMode === "greyScale") {
      let frame = this.canvasCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var l = frame.data.length / 4;

      for (var i = 0; i < l; i++) {
        var grey =
          (frame.data[i * 4 + 0] +
            frame.data[i * 4 + 1] +
            frame.data[i * 4 + 2]) /
          3;

        frame.data[i * 4 + 0] = grey;
        frame.data[i * 4 + 1] = grey;
        frame.data[i * 4 + 2] = grey;
      }
      this.canvasCtx.putImageData(frame, 0, 0);
    }
  }
}
