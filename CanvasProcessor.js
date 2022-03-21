export default class CanvasProcessor {
  constructor(canvasElement, videoElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.frameMode = "normal";

    /**@type{CanvasRenderingContext2D} */
    this.canvasCtx = this.canvas.getContext("2d");

    this.video.addEventListener("play", this.onPlay.bind(this), false);
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
    this.canvas.width = 1280;
    this.canvas.height = 720;
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
    //console.log("ffsdf")
    //console.log(this.video.currentTime);
    this.canvasCtx.drawImage(this.video, 0, 0, 1280, 720);
    if (this.frameMode === "greyScale") {
      let frame = this.canvasCtx.getImageData(0, 0, 1280, 720);
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
