defineMode("15-blank", grid => {

  let timer // for being able to cancel the setTimeout call on exit
  let samples
  let sampleFiles = [
    /* 00 - 0 */ "./samples/nothing/0",
    /* 01 - 1 */ "./samples/synth-plip/01",
    /* 02 - 2 */ "./samples/synth-plip/02",
    /* 03 - 3 */ "./samples/synth-plip/03",
    /* 04 - 4 */ "./samples/synth-plip/04",
    /* 05 - 5 */ "./samples/synth-plip/05",
    /* 06 - 6 */ "./samples/synth-plip/06",
    /* 07 - 7 */ "./samples/synth-plip/07",
    /* 08 - 8 */ "./samples/synth-plip/08",
    /* 09 - 9 */ "./samples/synth-plip/09",
    /* 10 - a */ "./samples/nothing/0",
    /* 11 - b */ "./samples/nothing/0",
    /* 12 - c */ "./samples/nothing/0",
    /* 13 - d */ "./samples/nothing/0",
    /* 14 - e */ "./samples/nothing/0",
    /* 15 - f */ "./samples/nothing/0",
    /* 16 - g */ "./samples/nothing/0",
    /* 17 - h */ "./samples/nothing/0",
    /* 18 - i */ "./samples/nothing/0",
    /* 19 - j */ "./samples/nothing/0",
    /* 20 - k */ "./samples/nothing/0",
    /* 21 - l */ "./samples/nothing/0",
    /* 22 - m */ "./samples/nothing/0",
    /* 23 - n */ "./samples/nothing/0",
    /* 24 - o */ "./samples/nothing/0",
    /* 25 - p */ "./samples/nothing/0",
    /* 26 - q */ "./samples/nothing/0",
    /* 27 - r */ "./samples/nothing/0",
    /* 28 - s */ "./samples/nothing/0",
    /* 29 - t */ "./samples/nothing/0",
    /* 30 - u */ "./samples/nothing/0",
    /* 31 - v */ "./samples/nothing/0",
    /* 32 - w */ "./samples/nothing/0",
    /* 33 - x */ "./samples/nothing/0",
    /* 34 - y */ "./samples/nothing/0",
    /* 35 - z */ "./samples/nothing/0"
  ]

  let disturber

  class Playhead {
    constructor(min, max, speed) {
      this.pos = min
      this.min = min
      this.max = max
      this.posLast = min
      this.interval = speed

    }
  }

  function Disturber(w,h){
    let yPos=[];
    let vel=[];
    let numBlobs=500;
    for(let i=0; i<numBlobs; i++){
      yPos[i]=0;
      vel[i]=0;
    }
    let dampMin=0.01;
    let dampMax=0.4;
    let damp=0.1;
    let strengthMin=0.01;
    let strengthMax=0.4;
    let strength=0.1;
    let step;
    let numRotations=1;
    let disturber={x:w/2,y:h/2,ey:h/2};
    let homeY=w/2;
    step=w/numBlobs;
    
    
    this.run=function(){
      noStroke();
      //renderSurface()
      push()
      translate(unitOf(8), unitOf(8))
      scale(width/w,height/h)
      translate(-unitOf(8), -unitOf(8))
      renderSurface()
      pop()
      disturber.ey+=(homeY-disturber.ey)/25
    }

    function renderSurface(){
      beginShape()
      for(let i=1; i<numBlobs; i++){
        let xPos=i*step;
        // show the 'disturber' if you want to 
        // fill(255  );
        // ellipse(disturber.x,disturber.ey,5);
        let distFromMouse=abs(xPos-disturber.x)/width;
        strength=map(distFromMouse,0,1,strengthMin,strengthMax);
        damp=map(distFromMouse,0,1,dampMin,dampMax);
        vel[i]+=(disturber.ey-yPos[i])*strength/7;     // PETE: I've slowed it down a bit
        yPos[i]+=vel[i];
        vertex(xPos, 300 + yPos[i]/2);      // PETE: playing with vertical position
        vel[i]*=(1-damp);
      }
      vertex(w, h)
      vertex(0,h)
      fill(0, 255, 155, 25)       // PETE: I've made it green
      noStroke();
      endShape()
    }
    
    this.disturb=function(x,y){
      let ex=w*x/unitOf(16)
      disturber.x+=(x-disturber.x)/1;
      disturber.y=y;
      disturber.ey+=(disturber.y-disturber.ey)/1;
    }
  }
  

  let playhead = new Playhead(0, 15, 800)// 0.8sec seems about right

  function tick() {
    // this function is triggered every interval
    playhead.pos = (playhead.pos + 16) % 256

    // check for just one active cell in this playhead row
    // determine the x position and the value
    let activePos=-1
    let valAsNum=-1
    for(let i=0; i<16; i++){
      if (grid.sequence[playhead.pos+i] != '.') {
        let cellVal=grid.sequence[playhead.pos+i]
        valAsNum=parseInt(cellVal,10)
        activePos=i
        break
      }
    }
    if(activePos>-1){
      disturber.disturb((activePos+1)*(unitOfOne()), 1.3*unitOf(16)*valAsNum/9)
    } 
    // console.log(playhead.pos, fromIndex(playhead.pos).y, activePos, valAsNum)
    //disturb the surface at this x position and this value as a disturbance magnitude and direction
    //1 to 9=-4 to 4, 5 is neutral?
    timer = setTimeout(tick, playhead.interval)
  }

  return {

    level: true,
    title: 
      "WAVEPOOL\n\-----------------\n\
      Back to visuals. Create some waves by placing numbers one to nine.",

      info:
      "\n[1-9] make wave\n\
      [arrows] move cursor\n\
      [delete] calm down\n\
      [tab] prev level\n\
      [enter] next level",

    showPrompt: false,

    preload() {
    },

    init() {
      samples = sampleFiles.map(x => new Howl({ src: [x + ".wav", x + ".mp3"] }))
      //setTimeout(tick, playhead.interval)
      timer = setTimeout(tick, playhead.interval)
      disturber=new Disturber(unitOf(16), unitOf(16))
      grid.sequence.fill('.')
      grid.moveTo(7,7)
    },
    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;
    },

    unload() {
      clearTimeout(timer)
    },

    onKey(key) {
      if (key.key.match(/^[1-9]$/)) {
        //we can only have one active cell in each row so clear the row before assigning the new value
        let row=fromIndex(grid.cursor.index).y
        for(let i=0; i<16; i++){
          // console.log(xyToIndex({x:i,y:row}))
          grid.sequence[xyToIndex({x:i,y:row})]='.'
        }
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
      } else if (key.key == 'Enter') {
        // if Enter is pressed then jump playhead to that position
        //playhead.min = 16*cursor.y
      }
    },

    update(x, y, index) { },

    draw(frameCounter) {
      disturber.run()
      fill(255, 165, 0, orangeAlpha)    // orange playhead
      let playheadPos=indexToPixelXY(playhead.pos)
      rect(playheadPos[0],playheadPos[1],unitOf(16),unitOfOne())
    },
  }
})
