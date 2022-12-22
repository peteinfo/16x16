defineMode("rain", grid => {

  let playheads = []
  let timers = []      // for being able to cancel the setTimeout call on exit
  let backgroundSample
  let samples
  let sampleFiles = [
    /* 00 - 0 */ "./samples/nothing/0",
    /* 01 - 1 */ "./samples/synth-mow2/01",
    /* 02 - 2 */ "./samples/synth-mow2/02",
    /* 03 - 3 */ "./samples/synth-mow2/03",
    /* 04 - 4 */ "./samples/synth-mow2/04",
    /* 05 - 5 */ "./samples/synth-mow2/05",
    /* 06 - 6 */ "./samples/synth-mow2/06",
    /* 07 - 7 */ "./samples/synth-mow2/07",
    /* 08 - 8 */ "./samples/synth-mow2/08",
    /* 09 - 9 */ "./samples/synth-mow2/09",
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
    constructor(min, max, speed) {
      this.pos = min
      this.min = min
      this.max = max
      this.posLast = min
      this.interval = speed

    }
  }

  function tick(n) {

    // this function is triggered every interval
    playheads[n].pos = (playheads[n].pos + 16) % 256

    // does the index contain a note to play?
    if (grid.sequence[playheads[n].pos] != '.') {

      // Great! Let's play a note
      let sampleToPlay = '0'

      // Small fix to avoid out of bounds
      if (grid.sequence[playheads[n].pos] && grid.sequence[playheads[n].pos].match(/^[0-9]$/)) {
        sampleToPlay = grid.sequence[playheads[n].pos]
      }
      else if (grid.sequence[playheads[n].pos].match(/^[a-z]$/)) {
        // convert from ascii
        // as a is 97 in ascii, subtract 87 to shift to 10
        sampleToPlay = grid.sequence[playheads[n].pos].charCodeAt(0) - 87
      }

      if (sampleToPlay < 5) {
        samples[sampleToPlay].rate(0.5)
      }
      //samples[sampleToPlay].stop()
      samples[sampleToPlay].play()
    }
    timers[n] = setTimeout(tick, playheads[n].interval, n)
  }

  return {
    level: true,
    title: "LIKE SAMPLES IN RAIN \n----------------------------- \
            Playheads stream down the window. Try to find some order in the noise.",
    info: "\n\
            [1-9] place sample\n\
            [arrows] move cursor\n\
            [delete] clear sample\
            [tab] prev level\n\
            [enter] next level",

    showPrompt: true,


    preload() {
      //samples = sampleFiles.map(x => new Howl({ src: [x] }))
    },

    init() {
      // init playhead array
      playheads = []
      for (n = 0; n < 16; n++) {
        playheads[n] = new Playhead(n, 256, random(200.0, 300.0))
        timers[n] = setTimeout(tick, playheads[n].interval, n)
      }
      grid.sequence.fill('.')
      samples = sampleFiles.map(x => new Howl({ src: [x + ".mp3"] }))
      backgroundSample = new Howl({
        src: ['./samples/long-samples/rain-window.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.4
      })
      grid.moveTo(7, 8)
    },

    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0
      backgroundSample.stop()

      for (n = 0; n < timers.length; n++) {
        clearTimeout(timers[n])
      }
    },

    onKey(key) {
      if (key.key.match(/^[1-9]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
      }
    },

    update(x, y, index) { },

    draw(frameCounter) {
      fill(255, 165, 0, orangeAlpha)    // orange playhead
      for (n = 0; n < playheads.length; n++) {
        drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playheads[n].pos))
      }
    },
  }
})
