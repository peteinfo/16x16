defineMode("13-blank", grid => {

  let currentVal = 0

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
    // /* 10 - a */ "./samples/nothing/0",
    // /* 11 - b */ "./samples/nothing/0",
    // /* 12 - c */ "./samples/nothing/0",
    // /* 13 - d */ "./samples/nothing/0",
    // /* 14 - e */ "./samples/nothing/0",
    // /* 15 - f */ "./samples/nothing/0",
    // /* 16 - g */ "./samples/nothing/0",
    // /* 17 - h */ "./samples/nothing/0",
    // /* 18 - i */ "./samples/nothing/0",
    // /* 19 - j */ "./samples/nothing/0",
    // /* 20 - k */ "./samples/nothing/0",
    // /* 21 - l */ "./samples/nothing/0",
    // /* 22 - m */ "./samples/nothing/0",
    // /* 23 - n */ "./samples/nothing/0",
    // /* 24 - o */ "./samples/nothing/0",
    // /* 25 - p */ "./samples/nothing/0",
    // /* 26 - q */ "./samples/nothing/0",
    // /* 27 - r */ "./samples/nothing/0",
    // /* 28 - s */ "./samples/nothing/0",
    // /* 29 - t */ "./samples/nothing/0",
    // /* 30 - u */ "./samples/nothing/0",
    // /* 31 - v */ "./samples/nothing/0",
    // /* 32 - w */ "./samples/nothing/0",
    // /* 33 - x */ "./samples/nothing/0",
    // /* 34 - y */ "./samples/nothing/0",
    // /* 35 - z */ "./samples/nothing/0"
  ]

  
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
  let playhead = new Playhead(0, 15, 200)

  function tick() {

    // this function is triggered every interval

    playhead.pos++;
    if (playhead.pos > playhead.max) {
      playhead.pos = playhead.min
    }

    currentVal = 0

    // does the index contain a note to play?
    if (grid.sequence[playhead.pos] != '.') {

      let sampleToPlay = '0'

      // DETECT NUMBERS if there's a 1-9 in that position, play a sample
      if (grid.sequence[playhead.pos] && grid.sequence[playhead.pos].match(/^[1-9]$/)) {
        sampleToPlay = grid.sequence[playhead.pos]
        currentVal = grid.sequence[playhead.pos]
      }
      // DETECT LETTERS
      else if (grid.sequence[playhead.pos].match(/^[a-z]$/)) {
     
      }
      samples[sampleToPlay].volume(random(0.5, 0.9))   // 'humanise' or vary the volume slightly
      samples[sampleToPlay].play()
    }
    timer = setTimeout(tick, playhead.interval)
  }

  return {

    title:
      "\nLEVEL 13: UNDER CONSTRUCTION\
       --------------------------- \
      New mode coming soon!",

    info:
      "\n[1-9] synth blip \n\
      [arrow] move cursor\n\
      [space] jump to row\n\
      [delete] clear sample\n\
      [tab] last level\n\
      [enter] next level",

    showPrompt: false,

    preload() {
    },

    init() {
      samples = sampleFiles.map(x => new Howl({ src: [x + ".wav", x + ".mp3"] }))
      timer = setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
    },

    // unload is called when the mode unloads
    unload() {
      clearTimeout(timer) // clears timer
      samples.length = 0; // clears samples
    },

    onKey(key) {
      // key pressed
      if (key.key.match(/^[1-9]$/)) {
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

      // example of drawing a circle to screen
      fill(200, 40 + 10*currentVal, 40+ 25*currentVal, 100)
      ellipseMode(CENTER)
      ellipse(unitOf(8), unitOf(8), unitOf(10+ currentVal*3), unitOf(10+currentVal*3))

      fill(255, 165, 0, orangeAlpha)    // orange playhead
      drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playhead.pos))

    },
  }
})
