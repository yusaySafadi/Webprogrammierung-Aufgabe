import Video from "./Video.js";

export default class Recorder {
  #mediaRecorder;
  ispaused;
  constructor(stream, options) {
    this.startTime = 0;
    this.endTime = 0;
    this.recordedBlobs = [];
    this.#mediaRecorder = new MediaRecorder(stream, options);
    this.#mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
    this.#mediaRecorder.onstart = this.handleStart.bind(this);
    this.#mediaRecorder.onstop = this.handleStop.bind(this);
    this.#mediaRecorder.onpause = this.handlePause.bind(this);
    this.#mediaRecorder.onresume = this.handleResume.bind(this);
  }

  pause() {
    this.#mediaRecorder.pause();
  }
  resume() {
    this.#mediaRecorder.resume();
  }
  handlePause(event) {
    console.log("pause");
    this.ispaused = true;
  }
  handleResume(event) {
    this.ispaused = false;
  }
  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }
  handleStart(event) {
    this.startTime = new Date();
    this.ispaused = false;
  }
  handleStop(event) {
    this.endTime = new Date();
  }

  start(timeslice) {
    this.#mediaRecorder.start(timeslice);
  }
  stop() {
    this.#mediaRecorder.stop();
  }
  download() {
    const blob = new Blob(this.recordedBlobs);
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
  getVideo() {
    let duration = this.endTime - this.startTime;
    return new Video(this.recordedBlobs, duration);
  }
}
