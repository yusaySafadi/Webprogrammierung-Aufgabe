import Video from "./Video.js";

export default class Recorder {
  #mediaRecorder;
  ispaused;
  finished;
  constructor(stream, options,inputMedia) {
    this.stream =stream;
    this.inputMedia = inputMedia;
    this.startTime = 0;
    this.endTime = 0;
    this.finished=false;
    this.recordedBlobs = [];
    this.#mediaRecorder = new MediaRecorder(this.stream, options);
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
    
    this.ispaused = false;
  }
  handleStop(event) {
    
    this.finished = true;
    
    console.log("was????")
    this.stream.getTracks().forEach(track =>{
      track.stop()})
    
  
  }

  start(timeslice) {
    this.#mediaRecorder.start(timeslice);
    this.startTime = new Date();
  }
  stop() {
    this.#mediaRecorder.stop();
    this.endTime = new Date();
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
    console.log(this.endTime)
    let duration = this.endTime - this.startTime;
    console.log(duration);
    return new Video(this.recordedBlobs, duration, this.inputMedia);
  }
  getRecordedBlobs(){
    return this.recordedBlobs;
  }
}
