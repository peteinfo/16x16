defineMode("off-the-grid", grid => {

  let track
  let driftX
  let drfitY
  let timer // for being able to cancel the setTimeout call on exit
  let backgroundSample
  let samples
  let sampleFiles = [
     /* 00 - 0 */ "./samples/nothing/0",
    /* 01 - 1 */ "./samples/mars-strange/01",
    /* 02 - 2 */ "./samples/mars-strange/02",
    /* 03 - 3 */ "./samples/mars-strange/03",
    /* 04 - 4 */ "./samples/mars-strange/04",
    /* 05 - 5 */ "./samples/mars-strange/05",
    /* 06 - 6 */ "./samples/mars-strange/06",
    /* 07 - 7 */ "./samples/mars-strange/07",
    /* 08 - 8 */ "./samples/mars-strange/08",
    /* 09 - 9 */ "./samples/mars-strange/09"
    // /* 10 - a */ "./samples/metal/01",
    // /* 10 - a */ "./samples/metal/02",
    // /* 10 - a */ "./samples/metal/03",
    // /* 10 - a */ "./samples/metal/04",
    // /* 10 - a */ "./samples/metal/05",
    // /* 11 - b */ "./samples/metal/06",
    // /* 12 - c */ "./samples/metal/07",
    // /* 13 - d */ "./samples/metal/08",
    // /* 14 - e */ "./samples/metal/09",
    // /* 15 - f */ "./samples/metal/09",
    // /* 16 - g */ "./samples/kalimba/20",
    // /* 17 - h */ "./samples/kalimba/21",
    // /* 18 - i */ "./samples/kalimba/22",
    // /* 19 - j*/  "./samples/kalimba/23",
    // /* 20 - k */ "./samples/kalimba/24",
    // /* 21 - l */ "./samples/kalimba/25",
    // /* 22 - m */ "./samples/kalimba/26",
    // /* 23 - n */ "./samples/kalimba/27",
    // /* 24 - o */ "./samples/kalimba/28",
    // /* 25 - p */ "./samples/kalimba/00",
    // /* 26 - q */ "./samples/kalimba/01",
    // /* 27 - r */ "./samples/kalimba/02",
    // /* 28 - s */ "./samples/kalimba/03",
    // /* 29 - t */ "./samples/kalimba/04",
    // /* 30 - u */ "./samples/kalimba/05",
    // /* 31 - v */ "./samples/kalimba/06",
    // /* 32 - w */ "./samples/kalimba/07",
    // /* 33 - x */ "./samples/kalimba/08",
    // /* 34 - y */ "./samples/kalimba/09",
    // /* 35 - z */ "./samples/kalimba/10"
  ]

  class Playhead {
    constructor(min, max, speed) {
      this.pos = min
      this.min = min
      this.max = max
      this.posLast = min
      this.interval = speed

    }
  }

  let playhead = new Playhead(0, 15, 200)

  function tick() {
    // this function is triggered every interval

    playhead.pos++;
    if (playhead.pos > playhead.max) {
      playhead.pos = playhead.min
    }

    // does the index contain a note to play?
    if (grid.sequence[playhead.pos] != '.') {

      // Small fix to avoid out of bounds
      if (grid.sequence[playhead.pos] && grid.sequence[playhead.pos].match(/^[0]$/)) {
        playhead.pos = 16 * floor(playhead.pos / 16)
      }

      let sampleToPlay = '0'

      if (grid.sequence[playhead.pos] && grid.sequence[playhead.pos].match(/^[1-9]$/)) {
        sampleToPlay = grid.sequence[playhead.pos]
        samples[sampleToPlay].play()
      }
    }
    timer = setTimeout(tick, playhead.interval)
  }

  const jumpToRow = () => {
    track = grid.cursor.y
    print("jump to row " + 16 * grid.cursor.y)
    playhead.min = 16 * grid.cursor.y
    playhead.max = 16 * grid.cursor.y + 15
    playhead.pos = 16 * grid.cursor.y + playhead.pos % 16
  }

  return {
    level: true,
    title: 
      "OFF GRID\n------------------\n\
      The sequencing has taken it's toll on the grid. The foundations become loose and Brownian motion jiggles the grid into a state of higher entropy.",

    info:
      "\n[1-9] place sample\
      \n[0] goto start of row\
      \n[space] select row\
      \n[arrows] move cursor\
      \n[delete] clear sample\
      \n[tab] prev level\n\
      [enter] next level",

    showPrompt: true,
    hideGrid: true,


    preload() {
    },

    init() {
      grid.moveTo(7,7)
      jumpToRow()
      // track = 7
      timer = setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
      backgroundSample = new Howl({
        src: ['./samples/long-samples/telex.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.4
      })
      samples = sampleFiles.map(x => new Howl({ src: [x + ".mp3"] }))

      // create a drift array to nudge the grids off
      driftX = Array(grid.sequence.length).fill(0)
      driftY = Array(grid.sequence.length).fill(0)
    },
    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;
      backgroundSample.stop()
      clearTimeout(timer)
    },

    onKey(key) {
      if (key.key.match(/^[0]$/)) {
        //grid.sequence[grid.cursor.index] = key.key
      }
      if (key.key.match(/^[0-9]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
      } else if (key.key == ' ') {
        // if space is pressed then jump playhead to that position
        jumpToRow()
      }
    },

    update(x, y, index) { },

    draw(frameCounter) {

      // render the grid! (copied over from sketch.js)
      const fontSize = unitOf(0.75)
      noStroke()
      grid.forEach((char, index) => {

        driftX[index] += random(-0.5, 0.5)
        driftY[index] += random(-0.5, 0.5)

        const [x, y] = indexToPixelXY(index)
        // draw character at grid space
        if (grid.mode.paleGrid) {
          fill(0, 100, 0)
        } else {
          fill(0, 192, 0)
        }
        drawChar(char, fontSize, x + driftX[index], y + driftY[index])
        // if cursor position, draw flashing cursor block
        if (isCursorAt(grid, index)) {
          fill(0, 255, 0, blinking(150, 100))
          drawChar(cursorChar, fontSize, x + driftX[index], y + driftY[index]);
        }
      }, true)

      // selected row
      fill(0, 192, 0, 25)
      rectMode(CENTER)
      rect(unitOf(8), unitOf((track + 0.5)), unitOf(16), unitOf(0.83))

      // orange playhead
      fill(255, 165, 0, orangeAlpha)    
      const [x, y] = indexToPixelXY(playhead.pos)
      drawChar(cursorChar, unitOf(0.75), x + driftX[playhead.pos], y + driftY[playhead.pos])
    },
  }
})
