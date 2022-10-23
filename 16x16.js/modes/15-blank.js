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

      // Great! Let's play a note
      //print("PLAY NOTE! index: " + playhead.pos + " contains: " + grid.sequence[playhead.pos])
      let sampleToPlay = '0'

      // Small fix to avoid out of bounds
      if (grid.sequence[playhead.pos] && grid.sequence[playhead.pos].match(/^[0-9]$/)) {
        sampleToPlay = grid.sequence[playhead.pos]
      }
      else if (grid.sequence[playhead.pos].match(/^[a-z]$/)) {
        // convert from ascii
        // as a is 97 in ascii, subtract 87 to shift to 10
        sampleToPlay = grid.sequence[playhead.pos].charCodeAt(0) - 87
      }

      //samples[sampleToPlay].rate(1)
      //samples[sampleToPlay].stop()
      samples[sampleToPlay].volume(random(0.5, 0.9))   // 'humanise' or vary the volume slightly
      samples[sampleToPlay].play()
    }
    timer = setTimeout(tick, playhead.interval)
  }

  return {

    title:
      "\nLEVEL 15: UNDER CONSTRUCTION\
       --------------------------- \
      New mode coming soon!",

      info:
      "\n[1-9] ??? \n\
      [arrow key] move cursor\
      [backspace] clear sample\
      [space bar] next level",

    showPrompt: false,

    preload() {
    },

    init() {
      samples = sampleFiles.map(x => new Howl({ src: [x + ".wav", x + ".mp3"] }))
      //setTimeout(tick, playhead.interval)
      timer = setTimeout(tick, playhead.interval)

      grid.sequence.fill('.')
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
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
      } else if (key.key == 'Enter') {
        // if Enter is pressed then jump playhead to that position
        //playhead.min = 16*cursor.y
      }
    },

    update(x, y, index) { },

    draw(frameCounter) {
      fill(255, 165, 0, orangeAlpha)    // orange playhead
      drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playhead.pos))
    },
  }
})
