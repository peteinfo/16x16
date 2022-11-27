defineMode("jump-back", grid => {

  let track
  let timer // for being able to cancel the setTimeout call on exit
  let samples
  let sampleFiles = [
     /* 00 - 0 */ "./samples/nothing/0",
    /* 01 - 1 */ "./samples/metal/01",
    /* 02 - 2 */ "./samples/metal/02",
    /* 03 - 3 */ "./samples/metal/03",
    /* 04 - 4 */ "./samples/metal/04",
    /* 05 - 5 */ "./samples/metal/05",
    /* 06 - 6 */ "./samples/metal/06",
    /* 07 - 7 */ "./samples/metal/07",
    /* 08 - 8 */ "./samples/metal/08",
    /* 09 - 9 */ "./samples/metal/09"
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

  return {
    level: true,
    title: "JUMP BACK \
      --------------------------- \
      A zero will jump the playhead back to the beginning of the row.",
      
    info: 
      "\n[1-9] chime\
      \n[0] goto start of row\
      \n[space] play row\
      \n[arrow] move cursor\
      \n[delete] clear sample\
      \n[tab] last level\n\
      [enter] next level",

    showPrompt: true,


    preload() {
    },

    init() {
      track = 0
      timer = setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
      samples = sampleFiles.map(x => new Howl({ src: [x + ".wav", x + ".mp3"] }))
    },
    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;
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

        track = grid.cursor.y
        print("jump to row " + 16 * grid.cursor.y)
        playhead.min = 16 * grid.cursor.y
        playhead.max = 16 * grid.cursor.y + 15
        playhead.pos = 16 * grid.cursor.y + playhead.pos % 16
      }
    },

    update(x, y, index) { },

    draw(frameCounter) {

      fill(0, 192, 0, 25)
      rectMode(CENTER)
      rect(unitOf(8), unitOf((track + 0.5)), unitOf(16), unitOf(0.83))

      fill(255, 165, 0, orangeAlpha)    // orange playhead
      drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playhead.pos))
    },
  }
})
