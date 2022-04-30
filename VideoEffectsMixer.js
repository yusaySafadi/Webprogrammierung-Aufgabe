
export default class VideoEffectsMixer{
    mixSelected;
    markedToMix;

  constructor() {
    this.allMixMarks =[];
    this.markedToMix =[];
    cutButton.addEventListener(
      "click",
      function (e) {
        if (!this.mixSelected) {
            
          this.mixSelected = true;
          this.markedToMix[0] = slider.value;
          console.log("nasdwwedqwe")
        } else {
          this.mixSelected = false;
          this.markedToMix[1] = slider.value;

          if(this.markedToMix[1]<this.markedToMix[0]){
              let temp = this.markedToMix[0];
              this.markedToMix[0] =this.markedToMix[1];
              this.markedToMix[1] = temp; 
          }
          this.markedToMix[2] = "greyScale"
          this.showCutArea(this.markedToMix);

          this.allCutMarks.push([...this.markedToMix]);
          if(this.allCutMarks.length > 1){
              this.sortMarks();
          }
        }
      }.bind(this)
    );
  }
  showMixArea(markedToMix) {
    let firstpercent = (markedToMix[0] / slider.max) * 100.0;
    let secondpercent = 100 - (markedToMix[1] / slider.max) * 100.0;

    let mixSection = document.createElement("div");
    mixSection.className = "selectedMix";

    mixSection.style.left = firstpercent+"%";
    mixSection.style.right = secondpercent + "%";

    timeRangeselectionDiv.appendChild(mixSection);

    //cutButton.innerHTML ="ok?";
  }

  sortMarks(){
      this.allMixMarks.sort((a,b) => a[0]-b[0]);
      console.log(this.allMixMarks)
  }

}