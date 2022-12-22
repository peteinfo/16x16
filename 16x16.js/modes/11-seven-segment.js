defineMode("seven-segment", grid => {

  let backgroundSample

  let currentVal = 0
  let rapples = []
  let isRunning = false
  const osbX = 500, osbY = 500;
  let osb
  let render7seg
  const cols = [
    [201, 138, 2], //#c98a02
    [45, 100, 150], //#2d6496
    [197, 60, 66], //#C53C42
    [96, 122, 7], //#607a07
    [70, 54, 117], //#463675
    [158, 40, 91],  //#9e285b        
  ]
  let intensity = 1;

  let timer // for being able to cancel the setTimeout call on exit


  class Rapple {
    //a rapple is a persistent animated object  
    // that corresponds to a currently active grid position
    // it has an associated object that renders the rapple


    constructor(index, x, y, val) {
      this.index = index
      this.x = x
      this.y = y
      this.val = val
      this.renderer = new RappleRenderer(x, y, cols[Math.floor(Math.random() * cols.length)])
      this.on = false
    }

    check(val) {
      let prev = this.val
      this.val = val
      if (val == '.') {
        this.on = false
      } else {
        if (prev !== val) {
          this.on = true
          this.renderer.update(cols[Math.floor(Math.random() * cols.length)])
        }
      }
    }

    run(osb) {
      if (this.on) {
        this.renderer.show(osb, this.val)
      }
    }

    blank(osb) {
      if (this.on) {
        this.renderer.blank(osb)
      }
    }

  }

  class RappleRenderer {
    //this is a renderer class so that we can have different styles of rapple
    //that we can associate with the rapple itself
    constructor(x, y, col) {
      this.step = unitOfOne()
      this.x = x
      this.y = y
      this.col = col
      this.speed = random(10, 40)
      this.change = random(10, 100)
      this.period = random(50, 100)
    }

    update(col) {
      this.col = col
      this.speed = random(50, 100)
      this.change = random(5, 200)
      this.period = random(100, 250)
    }

    show(osb, val) {
      this.step = unitOfOne()
      let n = 100;
      let nVal = parseInt(val, 10)
      let orientation = nVal < 5 ? 0 : 1
      let rel = ((nVal % 5) + 1) * 2
      let intensity = 0.6 + sin((frameCount % this.period) * TWO_PI / this.period) * 0.4
      osb.fill(this.col[0], this.col[1], this.col[2], 255 * intensity);
      if (orientation) {
        osb.beginShape();
        for (var i = 0; i < n + 1; i++) {
          osb.vertex((this.x + 0.5) * this.step - noise(this.x * 10 + i * osb.width / (n * 500) + frameCount / (this.speed * rel), frameCount / this.change) * this.step * rel + this.step * rel * 0.6, i * osb.width / n);
        }
        for (var i = n; i >= 0; i--) {
          osb.vertex((this.x + 0.5) * this.step + noise((this.x + 30) * 10 + i * osb.width / (n * 500) + frameCount / ((this.speed * rel) * 1.1), frameCount / this.change) * this.step * rel - this.step * rel * 0.6, i * osb.width / n);
        }
        osb.endShape(CLOSE);

      } else {
        osb.beginShape();
        for (var i = 0; i < n + 1; i++) {
          osb.vertex(i * osb.width / n, (this.y + 0.5) * this.step - noise(this.y * 10 + i * osb.width / (n * 500) + frameCount / (this.speed * rel), frameCount / this.change) * this.step * rel + this.step * rel * 0.6);
        }
        for (var i = n; i >= 0; i--) {
          osb.vertex(i * osb.width / n, (this.y + 0.5) * this.step + noise((this.y + 30) * 10 + i * osb.width / (n * 500) + frameCount / ((this.speed * rel) * 1.1), frameCount / this.change) * this.step * rel - this.step * rel * 0.6);
        }
        osb.endShape(CLOSE);
      }

      // osb.fill(235,135,0,100)
      // osb.noStroke()
      // osb.ellipse((this.x+0.5)*this.step, (this.y+0.5)*this.step, this.step)
    }

    //create a black disk behind the active grid position, 
    //so that you can still read the digit
    blank(osb) {
      osb.blendMode(BLEND)
      osb.fill(0, 180)
      osb.noStroke()
      osb.ellipse((this.x + 0.15) * this.step, (this.y + 0.15) * this.step, this.step)
    }

    run() {

    }
  }

  function Render7Seg(na, nd) {
    let stepIndex = 0;
    let numSteps = nd;//steps[stepIndex];
    let step = unitOfOne();
    let segmentPos = [
      [0.5, 0.1],
      [0.7, 0.3],
      [0.7, 0.7],
      [0.5, 0.9],
      [0.3, 0.7],
      [0.3, 0.3],
      [0.5, 0.5]
    ];
    let offsets = [];
    let offRel = 0.05;
    let cols = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    offsets = [[cos(0) * step * offRel, sin(0) * step * offRel],
    [cos(TWO_PI / 3) * step * offRel, sin(TWO_PI / 3) * step * offRel],
    [cos(2 * TWO_PI / 3) * step * offRel, sin(2 * TWO_PI / 3) * step * offRel]];

    function unitOfOne() {
      return min(windowWidth, windowHeight) / 26;
    }

    function unitOf(scale) {
      return unitOfOne() * scale;
    }


    this.runGrid = function (img) {
      img.loadPixels(img);
      let nx = floor(img.width / step);
      let ny = floor(img.height / step);
    };


    this.run = function (img, bright) {
      // img.loadPixels();
      step = unitOfOne();
      let relScale = img.width / unitOf(16);
      push();
      // translate(windowWidth/2-unitOf(8),windowHeight/2-unitOf(8));
      for (let l = 0; l < na * nd; l++) {
        let i = (l % na) * step;
        let j = floor(l / na) * step;
        push();
        translate(i, j);
        for (let k = 0; k < 7; k++) {
          let x = floor(segmentPos[k][0] * step);
          let y = floor(segmentPos[k][1] * step);
          const pixelIndex = (floor((i + x) * relScale) + floor((j + y) * relScale) * img.width) * 4;
          const r = img.pixels[pixelIndex + 0];
          const g = img.pixels[pixelIndex + 1];
          const b = img.pixels[pixelIndex + 2];
          segmentShape(k, step, [r, g, b], bright);
        }
        pop()
      }
      pop();
    };

    function segmentShape(type, step, shades, bright) {
      var minShade = 8;
      let fade = 215;
      var rel = 0.12;
      // for(var i=0; i<3; i++){
      push();
      // translate(offsets[i][0],offsets[i][1]);
      // stroke(max(minShade,shades[0]*cols[i][0]),max(minShade,shades[1]*cols[i][1]),max(minShade,shades[2]*cols[i][2]),fade*bright);
      stroke(max(minShade, shades[0]), max(minShade, shades[1]), max(minShade, shades[2]), fade * bright);
      strokeWeight(step * 0.15);
      if (type % 3 == 0) {
        line((segmentPos[type][0] - rel) * step, segmentPos[type][1] * step, (segmentPos[type][0] + rel) * step, segmentPos[type][1] * step);
      } else {
        line((segmentPos[type][0]) * step, (segmentPos[type][1] - rel) * step, (segmentPos[type][0]) * step, (segmentPos[type][1] + rel) * step);
      }
      pop();
      // }  
    }
  }

  class Playhead {
    // the playhead class is for the orange playhead
    // this mode uses just one, but it's possible to have multiple
    constructor(min, max, speed) {
      this.pos = min
      this.min = min
      this.max = max
      this.posLast = min
      this.interval = speed

    }
  }

  // create a playhead that goes across the top row only 0-15 at a speed of 200ms per step
  let playhead = new Playhead(0, 15, 1000)

  function tick() {

    // this function is triggered every interval
    // intensity=1

    timer = setTimeout(tick, playhead.interval)
  }

  return {

    level: true,
    title:
      "SEVEN SEGMENT\n-----------------------\n\
      Let's go back to just controlling the visuals. Place numbers in the grid to compose evolving seven segment visuals.",

    info:
      "\n[0-9] place visuals\n\
      [arrows] move cursor\n\
      [space] jump to row\n\
      [delete] clear sample\n\
      [tab] prev level\n\
      [enter] next level",

    showPrompt: false,

    preload() {
      //sample = loadSound('./samples/long-samples/windchime.mp3')
    },

    init() {
      isRunning = true
      timer = setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
      osb = createGraphics(osbX, osbY)
      render7seg = new Render7Seg(16, 16)
      rapples = grid.sequence.map((s, i) => {
        let gridPos = fromIndex(i)
        return new Rapple(gridPos.index, gridPos.x, gridPos.y, s)
      })
      backgroundSample = new Howl({
        src: ['./samples/long-samples/hiddenconstruct-wavedisk.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.4
      })
      grid.moveTo(7, 7)
    },

    // unload is called when the mode unloads
    unload() {
      isRunning = false
      clearTimeout(timer) // clears timer
      rapples = []
      osb = null
      render7seg = null
      //sample.stop()
      backgroundSample.stop()
    },

    onKey(key) {
      // key pressed
      if (key.key.match(/^[0-9]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1) // use this for typewriter move
      } else if (key.key == ' ') {
        // ... do something when space bar is pressed!
        // such as jump to a different row
        print("jump to row " + 16 * grid.cursor.y)
        playhead.min = 16 * grid.cursor.y
        playhead.max = 16 * grid.cursor.y + 15
        playhead.pos = 16 * grid.cursor.y + playhead.pos % 16
      }
      if (isRunning) {
        rapples[grid.cursor.index].check(grid.sequence[grid.cursor.index])
      }
    },

    update(x, y, index) {

      // this is called once for every grid element every frame
      // best not put any draw calls in here
      // but good for updating the grid in modes such as Game of Life / Cellular Automata 
    },

    draw(frameCounter) {
      // draw is called once per frame, put usual draw calls below
      // can access current frame which can be handy for timing things
      //print("current frame = " + frameCounter)

      osb.blendMode(BLEND);
      osb.background(0);
      osb.blendMode(ADD);
      if (isRunning) {
        rapples.forEach(rapple => rapple.run(osb))
        rapples.forEach(rapple => rapple.blank(osb))
      }
      let img = osb.get()
      img.loadPixels()

      // render pale background rotating 7segs
      push()
      translate(unitOf(8), unitOf(8));
      scale(2);
      rotate(frameCount * PI / 1000);
      translate(-unitOf(8), -unitOf(8));
      blendMode(ADD);
      render7seg.run(img, 0.25);//0.2
      blendMode(BLEND);
      pop()

      //render 7segment over grid
      blendMode(ADD);
      render7seg.run(img, 0.9);
      blendMode(BLEND);


      //don't show playhead
      // fill(255, 165, 0, orangeAlpha)    // orange playhead
      // drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playhead.pos))

    },
  }
})
