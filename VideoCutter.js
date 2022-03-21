const cutButton = document.querySelector("#cut");
const slider = document.querySelector("#slider1");
let timeRangeselectionDiv = document.querySelector("#timeRangeSelection");
export default class VideoCutter {
  cutSelected;
  markedToCut;

  constructor() {
    this.allCutMarks =[];
    this.markedToCut =[];
    cutButton.addEventListener(
      "click",
      function (e) {
        if (!this.cutSelected) {
            
          this.cutSelected = true;
          this.markedToCut[0] = slider.value;
          console.log("nasdwwedqwe")
        } else {
          this.cutSelected = false;
          this.markedToCut[1] = slider.value;

          if(this.markedToCut[1]<this.markedToCut[0]){
              let temp = this.markedToCut[0];
              this.markedToCut[0] =this.markedToCut[1];
              this.markedToCut[1] = temp; 
          }

          this.showCutArea(this.markedToCut);

          this.allCutMarks.push([...this.markedToCut]);
          if(this.allCutMarks.length > 1){
              this.sortMarks();
          }
        }
      }.bind(this)
    );
  }
  showCutArea(markedToCut) {
    let firstpercent = (markedToCut[0] / slider.max) * 100.0;
    let secondpercent = 100 - (markedToCut[1] / slider.max) * 100.0;

    let cutSection = document.createElement("div");
    cutSection.className = "selectedCut";

    cutSection.style.left = firstpercent+"%";
    cutSection.style.right = secondpercent + "%";

    timeRangeselectionDiv.appendChild(cutSection);

    cutButton.innerHTML ="ok?";
  }

  sortMarks(){
      this.allCutMarks.sort((a,b) => a[0]-b[0]);
      console.log(this.allCutMarks)
  }

  
}
