defineMode("14-blank", grid => {
  let arcRenderer

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
  
  // const cols=[[200,30,30],
  //           [200,200,30],
  //           [30,200,200],
  //           [30,30,200],
  //           [130,200,130],
  //           [30,30,200],          
  //         ]

  const cols=[
    [201, 138, 2], //#c98a02
    [45, 100, 150], //#2d6496
    [197, 60, 66], //#C53C42
    [96, 122, 7], //#607a07
    [70, 54, 117], //#463675
    [158, 40, 91],  //#9e285b        
  ]

  const arcTypes={
    a:{rIn:0.0,rOut:0.3,col:cols[0]},
    b:{rIn:0.1,rOut:0.7,col:cols[1]},
    c:{rIn:0.2,rOut:0.5,col:cols[2]},
    d:{rIn:0.3,rOut:0.7,col:cols[3]},
    e:{rIn:0.4,rOut:0.6,col:cols[4]},
    f:{rIn:0.9,rOut:0.3,col:cols[5]},
    g:{rIn:0.5,rOut:0.9,col:cols[0]},
    h:{rIn:0.9,rOut:0.7,col:cols[1]},
    i:{rIn:0.5,rOut:0.9,col:cols[2]},
    j:{rIn:0.7,rOut:0.2,col:cols[3]},
    k:{rIn:0.6,rOut:0.4,col:cols[4]},
    l:{rIn:0.7,rOut:0.2,col:cols[5]},
  }
  class ArcRenderer{
    constructor(){
      this.arcs=[]
    }
    
    add(a,ri,ro,col){
      this.arcs.push(new ArcSpread(unitOf(8), unitOf(8),a,ri,ro,col));
    }
    
    run(){
      blendMode(ADD)
      for(var i=this.arcs.length-1; i>=0; i--){
        if(this.arcs[i].run()){
          this.arcs[i].show();
        } else {
          this.arcs.splice(i,1);
        }
      }
      blendMode(BLEND)
    };
  }

  function ArcSpread(x,y,a,ri,ro,col){
    var ttlMax=200;
    var ttl=ttlMax;
    var rt=ro-ri;
    var re=ro-rt;
    var as=0;
    var aGrow=0.01;
    // var colHue=frameCount%360;
    // var colSat=80;
    // var colBri=80;
    
    this.run=function(){
      ri+=(ro-ri)/100;
      rt=abs(ro*width/2-ri*width/2);
      re=ri*width/2+rt/4;
      as+=aGrow;
      ttl--;
      return true;
    };
    
    this.show=function(){
      strokeWeight(rt);
      stroke(col[0],col[1],col[2],150*ttl/ttlMax);
      strokeCap(SQUARE);
      noFill();
      arc(x,y,re*2,re*2,a-as, a+as);
      noStroke()
    }
  }

  class Playhead {
    constructor(min, max, speed) {
      this.pos = min
      this.min = min
      this.max = max
      this.posLast = min
      this.interval = speed

    }
  }

  let playhead = new Playhead(0, 15, 500)

  function tick() {
    // this function is triggered every interval
    playhead.pos = (playhead.pos + 16) % 256

    // does the index contain a note to play?
    
    for(let i=0; i<16; i++){
      if (grid.sequence[playhead.pos+i] != '.') {
        let arcType=arcTypes[grid.sequence[playhead.pos+i]]
        let a=(0.5+i-8)*PI/8-PI/2
        arcRenderer.add(a,arcType.rIn,arcType.rOut,arcType.col)
      }
    }

    timer = setTimeout(tick, playhead.interval)
  }

  return {

    title:
      "\nLEVEL 14: RADIALS\
       --------------------------- \
      a-l triggers a visual arc that fades",

      info:
      "\n[a-l] radial move \n\
      [arrow] move cursor\n\
      [delete] clear sample\n\
      [tab] last level\n\
      [enter] next level",

    showPrompt: false,

    preload() {
    },

    init() {
      arcRenderer=new ArcRenderer()
      samples = sampleFiles.map(x => new Howl({ src: [x + ".wav", x + ".mp3"] }))
      //setTimeout(tick, playhead.interval)
      timer = setTimeout(tick, playhead.interval)

      grid.sequence.fill('.')
    },
    // unload is called when the mode actually unloads
    unload() {
      arcRenderer=null
      // delete samples array
      samples.length = 0;
    },

    unload() {
      clearTimeout(timer)
    },

    onKey(key) {
      if (key.key.match(/^[a-l]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
      } else if (key.key == 'Enter') {
        // if Enter is pressed then jump playhead to that position
        //playhead.min = 16*cursor.y
      }
    },

    update(x, y, index) { },

    draw(frameCounter) {
      arcRenderer.run()
      fill(255, 165, 0, orangeAlpha)    // orange playhead
      let playheadPos=indexToPixelXY(playhead.pos)
      rect(playheadPos[0],playheadPos[1],unitOf(16),unitOfOne())
      // drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playhead.pos))
    },
  }
})
