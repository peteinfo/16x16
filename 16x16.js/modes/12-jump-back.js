defineMode("jump-back", grid => {

  let track
  let timer // for being able to cancel the setTimeout call on exit
  let samples
  let sampleFiles = [
    /* 00 - 0 */ "./samples/metal/01.wav",
    /* 01 - 1 */ "./samples/metal/01.wav",
    /* 02 - 2 */ "./samples/metal/02.wav",
    /* 03 - 3 */ "./samples/metal/03.wav",
    /* 04 - 4 */ "./samples/metal/04.wav",
    /* 05 - 5 */ "./samples/metal/05.wav",
    /* 06 - 6 */ "./samples/metal/06.wav",
    /* 07 - 7 */ "./samples/metal/07.wav",
    /* 08 - 8 */ "./samples/metal/08.wav",
    /* 09 - 9 */ "./samples/metal/09.wav",
    /* 10 - a */ "./samples/metal/01.wav",
    /* 10 - a */ "./samples/metal/02.wav",
    /* 10 - a */ "./samples/metal/03.wav",
    /* 10 - a */ "./samples/metal/04.wav",
    /* 10 - a */ "./samples/metal/05.wav",
    /* 11 - b */ "./samples/metal/06.wav",
    /* 12 - c */ "./samples/metal/07.wav",
    /* 13 - d */ "./samples/metal/08.wav",
    /* 14 - e */ "./samples/metal/09.wav",
    /* 15 - f */ "./samples/metal/09.wav",
    /* 16 - g */ "./samples/kalimba/20.mp3",
    /* 17 - h */ "./samples/kalimba/21.mp3",
    /* 18 - i */ "./samples/kalimba/22.mp3",
    /* 19 - j*/  "./samples/kalimba/23.mp3",
    /* 20 - k */ "./samples/kalimba/24.mp3",
    /* 21 - l */ "./samples/kalimba/25.mp3",
    /* 22 - m */ "./samples/kalimba/26.mp3",
    /* 23 - n */ "./samples/kalimba/27.mp3",
    /* 24 - o */ "./samples/kalimba/28.mp3",
    /* 25 - p */ "./samples/kalimba/00.mp3",
    /* 26 - q */ "./samples/kalimba/01.mp3",
    /* 27 - r */ "./samples/kalimba/02.mp3",
    /* 28 - s */ "./samples/kalimba/03.mp3",
    /* 29 - t */ "./samples/kalimba/04.mp3",
    /* 30 - u */ "./samples/kalimba/05.mp3",
    /* 31 - v */ "./samples/kalimba/06.mp3",
    /* 32 - w */ "./samples/kalimba/07.mp3",
    /* 33 - x */ "./samples/kalimba/08.mp3",
    /* 34 - y */ "./samples/kalimba/09.mp3",
    /* 35 - z */ "./samples/kalimba/10.mp3"
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

      if (grid.sequence[playhead.pos].match(/^[a-z]$/)) {
        // Great! Let's play a note
        print("PLAY NOTE! index: " + playhead.pos + " contains: " + grid.sequence[playhead.pos])
        let sampleToPlay = '0'

        // convert from ascii
        // as a is 97 in ascii, subtract 87 to shift to 10
        sampleToPlay = grid.sequence[playhead.pos].charCodeAt(0) - 87

        //samples[sampleToPlay].rate(1)
        //samples[sampleToPlay].stop()
        samples[sampleToPlay].play()
      }


    }



    timer = setTimeout(tick, playhead.interval)
  }

  return {
    title: 
      "\nLEVEL 12: JUMP BACK \
      --------------------------- \
      A zero will jump the playhead back to the beginning of the row.",
      
    info: 
      "\n[0] jump to start\
      \n[enter] play row\
      \n[a-z] percussion\
      \n[arrow key] move cursor\
      \n[space bar] next level",

    showPrompt: true,


    preload() {
    },

    init() {
      track = 0
      timer = setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
      samples = sampleFiles.map(x => new Howl({ src: [x] }))
    },
    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;
      clearTimeout(timer)
    },

    onKey(key) {
      if (key.key.match(/^[0]$/)) {
        grid.sequence[grid.cursor.index] = key.key
      }
      if (key.key.match(/^[1-9a-z]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
      } else if (key.key == 'Enter') {
        // if Enter is pressed then jump playhead to that position

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
