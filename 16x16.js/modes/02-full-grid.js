defineMode("full-grid", grid => {

  let timer // for being able to cancel the setTimeout call on exit
  let samples
  let sampleFiles = [
    /* 00 - 0 */ "./samples/kalimba/00.mp3",
    /* 01 - 1 */ "./samples/kalimba/01.mp3",
    /* 02 - 2 */ "./samples/kalimba/02.mp3",
    /* 03 - 3 */ "./samples/kalimba/03.mp3",
    /* 04 - 4 */ "./samples/kalimba/04.mp3",
    /* 05 - 5 */ "./samples/kalimba/05.mp3",
    /* 06 - 6 */ "./samples/kalimba/06.mp3",
    /* 07 - 7 */ "./samples/kalimba/07.mp3",
    /* 08 - 8 */ "./samples/kalimba/08.mp3",
    /* 09 - 9 */ "./samples/kalimba/09.mp3",
    /* 10 - a */ "./samples/pads/01.mp3",
    /* 11 - b */ "./samples/pads/02.mp3",
    /* 12 - c */ "./samples/pads/03.mp3",
    /* 13 - d */ "./samples/pads/04.mp3",
    /* 14 - e */ "./samples/pads/05.mp3",
    /* 15 - f */ "./samples/pads/06.mp3",
    /* 16 - g */ "./samples/pads/07.mp3",
    /* 17 - h */ "./samples/pads/08.mp3",
    /* 18 - i */ "./samples/pads/09.mp3",
    /* 19 - j */ "./samples/pads/10.mp3",
    /* 20 - k */ "./samples/pads/11.mp3",
    /* 21 - l */ "./samples/pads/12.mp3",
    /* 22 - m */ "./samples/pads/13.mp3",
    /* 23 - n */ "./samples/pads/14.mp3",
    /* 24 - o */ "./samples/pads/15.mp3",
    /* 25 - p */ "./samples/pads/16.mp3",
    /* 26 - q */ "./samples/pads/17.mp3",
    /* 27 - r */ "./samples/pads/18.mp3",
    /* 28 - s */ "./samples/pads/19.mp3",
    /* 29 - t */ "./samples/pads/20.mp3",
    /* 30 - u */ "./samples/pads/21.mp3",
    /* 31 - v */ "./samples/pads/22.mp3",
    /* 32 - w */ "./samples/pads/23.mp3",
    /* 33 - x */ "./samples/pads/24.mp3",
    /* 34 - y */ "./samples/pads/25.mp3",
    /* 35 - z */ "./samples/pads/26.mp3"
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

  let playhead = new Playhead(0, 255, 200)

  function tick() {
    // this function is triggered every interval
    playhead.pos++;
    if (playhead.pos > playhead.max) {
      playhead.pos = playhead.min
    }

    // does the index contain a note to play?
    if (grid.sequence[playhead.pos] != '.') {

      // Great! Let's play a note
      print("PLAY NOTE! index: " + playhead.pos + " contains: " + grid.sequence[playhead.pos])
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
      samples[sampleToPlay].play()
    }
    timer = setTimeout(tick, playhead.interval)
  }

  return {
    title: "\nLEVEL 2: FULL GRID SEQUENCE \n--------------------------- \
            Lay out a sequence over the full grid. Take time to build it up. Have patience to hear it play. \
            \n\n\
            ",
    info: "\n [0-9] kalimba \
              [a-z] synth pad \
              \n\n\
              [>] next level\
              [<] last level",

    preload() {
    },

    init() {
      samples = sampleFiles.map(x => new Howl({ src: [x] }))
      timer = setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
    },
    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;
      clearTimeout(timer)

    },

    onKey(key) {
      if (key.key.match(/^[0-9a-z]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.advanceBy(1)
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
