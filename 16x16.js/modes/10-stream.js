defineMode("stream", grid => {

  let timer // for being able to cancel the setTimeout call on exit
  let backgroundSample
  let samples
  let sampleFiles = [
    /* 00 - 0 */ "./samples/nothing/0",
    /* 01 - 1 */ "./samples/piano/01",
    /* 02 - 2 */ "./samples/piano/02",
    /* 03 - 3 */ "./samples/piano/03",
    /* 04 - 4 */ "./samples/piano/04",
    /* 05 - 5 */ "./samples/piano/05",
    /* 06 - 6 */ "./samples/piano/06",
    /* 07 - 7 */ "./samples/piano/07",
    /* 08 - 8 */ "./samples/piano/08",
    /* 09 - 9 */ "./samples/piano/09",
    // /* 10 - a */ "./samples/kalimba/10",
    // /* 10 - a */ "./samples/kalimba/11",
    // /* 10 - a */ "./samples/kalimba/12",
    // /* 10 - a */ "./samples/kalimba/13",
    // /* 10 - a */ "./samples/kalimba/14",
    // /* 11 - b */ "./samples/kalimba/15",
    // /* 12 - c */ "./samples/kalimba/16",
    // /* 13 - d */ "./samples/kalimba/17",
    // /* 14 - e */ "./samples/kalimba/18",
    // /* 15 - f */ "./samples/kalimba/19",
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

  let playhead = new Playhead(132, 140, 200)

  function tick() {
    // this function is triggered every interval

    // shift all notes down one row
    let tempArray = []
    for (n = 0; n < 16; n++) {
      tempArray[n] = grid.sequence[n + 240]
    }
    for (n = grid.sequence.length - 1; n > 15; n--) {
      grid.sequence[n] = grid.sequence[n - 16]
    }
    for (n = 0; n < 16; n++) {
      grid.sequence[n] = tempArray[n]
    }

    // now update the playhead
    playhead.pos++;
    if (playhead.pos > playhead.max) {
      playhead.pos = playhead.min
    }

    // does the index contain a note to play?
    if (grid.sequence[playhead.pos] != '.') {

      // Great! Let's play a note
      let sampleToPlay = '0'

      // Small fix to avoid out of bounds
      if (grid.sequence[playhead.pos] && grid.sequence[playhead.pos].match(/^[1-9]$/)) {
        sampleToPlay = grid.sequence[playhead.pos]
      }
      /*
      else if (grid.sequence[playhead.pos].match(/^[a-z]$/)) {
        // convert from ascii
        // as a is 97 in ascii, subtract 87 to shift to 10
        sampleToPlay = grid.sequence[playhead.pos].charCodeAt(0) - 87
      }
      */

      //samples[sampleToPlay].rate(1)
      //samples[sampleToPlay].stop()
      samples[sampleToPlay].volume(0.6)
      samples[sampleToPlay].play()
    }
    timer = setTimeout(tick, playhead.interval)
  }

  return {
    level: true,
    title: "DOWN STREAM \n---------------------\
            Samples dropped in the stream float down river.",
    info: "\n[1-9] place sample\n\
          [arrows] move cursor \n\
          [delete] clear sample\n\
          [tab] prev level\n\
          [enter] next level\
          ",

    showPrompt: true,

    preload() {
    },

    init() {
      timer = setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
      samples = sampleFiles.map(x => new Howl({ src: [x + ".wav", x + ".mp3"] }))
      backgroundSample = new Howl({
        src: ['./samples/long-samples/stream2.wav', './samples/long-samples/stream2.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.2
      })
      grid.moveTo(7,0)
    },
    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;
      backgroundSample.stop()
      clearTimeout(timer)
    },

    onKey(key) {
      if (key.key.match(/^[1-9]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
        // } else if (key.key == 'Enter') {
        //   // if Enter is pressed then jump playhead to that position

        //   print("jump to row " + 16 * grid.cursor.y)
        //   //playhead.pos = grid.cursor.
        //   playhead.min = 16 * grid.cursor.y
        //   playhead.max = 16 * grid.cursor.y + 15
        //   playhead.pos = 16 * grid.cursor.y + playhead.pos % 16
      }
    },

    update(x, y, index, frameCounter) {
    },

    draw(frameCounter) {
      fill(255, 165, 0, orangeAlpha)    // orange playhead
      drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playhead.pos))

      // wait to udpate the system
      //if (frameCounter % 20 != 0) return


    },
  }
})
