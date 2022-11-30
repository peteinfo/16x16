defineMode("sculpture", grid => {

  let timer // for being able to cancel the setTimeout call on exit
  let samples
  let sampleFiles = [
    /* 00 - 0 */ "./samples/kalimba/00",
    /* 01 - 1 */ "./samples/kalimba/01",
    /* 02 - 2 */ "./samples/kalimba/02",
    /* 03 - 3 */ "./samples/kalimba/03",
    /* 04 - 4 */ "./samples/kalimba/04",
    /* 05 - 5 */ "./samples/kalimba/05",
    /* 06 - 6 */ "./samples/kalimba/06",
    /* 07 - 7 */ "./samples/kalimba/07",
    /* 08 - 8 */ "./samples/kalimba/08",
    /* 09 - 9 */ "./samples/kalimba/09",
    /* 10 - a */ "./samples/pads/01",
    /* 11 - b */ "./samples/pads/02",
    /* 12 - c */ "./samples/pads/03",
    /* 13 - d */ "./samples/pads/04",
    /* 14 - e */ "./samples/pads/05",
    /* 15 - f */ "./samples/pads/06",
    /* 16 - g */ "./samples/pads/07",
    /* 17 - h */ "./samples/pads/08",
    /* 18 - i */ "./samples/pads/09",
    /* 19 - j */ "./samples/pads/10",
    /* 20 - k */ "./samples/pads/11",
    /* 21 - l */ "./samples/pads/12",
    /* 22 - m */ "./samples/pads/13",
    /* 23 - n */ "./samples/pads/14",
    /* 24 - o */ "./samples/pads/15",
    /* 25 - p */ "./samples/pads/16",
    /* 26 - q */ "./samples/pads/17",
    /* 27 - r */ "./samples/pads/18",
    /* 28 - s */ "./samples/pads/19",
    /* 29 - t */ "./samples/pads/20",
    /* 30 - u */ "./samples/pads/21",
    /* 31 - v */ "./samples/pads/22",
    /* 32 - w */ "./samples/pads/23",
    /* 33 - x */ "./samples/pads/24",
    /* 34 - y */ "./samples/pads/25",
    /* 35 - z */ "./samples/pads/26"
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
      samples[sampleToPlay].volume(0.2)
      samples[sampleToPlay].play()
    }
    timer = setTimeout(tick, playhead.interval)
  }

  return {
    level: true,
    title: "THE SCULPTURE\n----------------------\n\
      A pristine block of samples stands in front of you. Use the delete key to chip away and release the form within.",
      
    info: 
      "\n[arrows] move cursor\
      \n[delete] chip away\
      \n[tab] prev level\n\
      [enter] next level",

    showPrompt: true,


    preload() {
    },

    init() {
      samples = sampleFiles.map(x => new Howl({ src: [x + ".wav", x + ".mp3"] }))
      timer = setTimeout(tick, playhead.interval)
      //grid.sequence.fill('.')
      for (n in grid.sequence) {
        let ascii = Math.floor(random(48, 84))
        if (ascii > 57) ascii += 39
        grid.sequence[n] = String.fromCharCode(ascii)
      }
      grid.moveTo(7,7)
    },
    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;
      clearTimeout(timer)

    },

    onKey(key) {
      if (key.key.match(/^[0-9a-z]$/)) {
        //grid.sequence[grid.cursor.index] = key.key
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
