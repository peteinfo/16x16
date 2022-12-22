defineMode("parallels", grid => {

  let interval = 200
  let playheads = []
  let timer
  let samples
  let sampleFiles = [
    /* 00 - 0 */ "./samples/nothing/0",
    /* 01 - 1 */ "./samples/synth-gong/01",
    /* 02 - 2 */ "./samples/synth-gong/02",
    /* 03 - 3 */ "./samples/synth-gong/03",
    /* 04 - 4 */ "./samples/synth-gong/04",
    /* 05 - 5 */ "./samples/synth-gong/05",
    /* 06 - 6 */ "./samples/synth-gong/06",
    /* 07 - 7 */ "./samples/synth-gong/07",
    /* 08 - 8 */ "./samples/synth-gong/08",
    /* 09 - 9 */ "./samples/synth-gong/09",
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
    constructor(min, max) {
      this.pos = min
      this.min = min
      this.max = max
      this.posLast = min
    }
  }

  function tick(n) {

    // for all playheads (which are going at the same speed)
    for (n = 0; n < playheads.length; n++) {
      // this function is triggered every interval
      playheads[n].pos++;
      if (playheads[n].pos >= playheads[n].max) {
        playheads[n].pos = playheads[n].min
      }

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

        //samples[sampleToPlay].rate(1)
        //samples[sampleToPlay].stop()
        samples[sampleToPlay].stereo(-1 + 0.25*n)
        samples[sampleToPlay].volume(0.4)
        samples[sampleToPlay].play()
      }
    }
    timer = setTimeout(tick, interval)
  }

  return {
    level: true,
    title: "PARALLELS\n------------------\
            Eight tracks play simultaneously across the stereo field.",
    info: "\n[1-9] place sample\
            [arrows] move cursor\
            [delete] clear sample\n\
            [tab] prev level\n\
            [enter] next level",

    showPrompt: true,


    preload() {
    },

    init() {


      // init playhead array
      playheads = []
      for (n = 0; n < 8; n++) {
        playheads[n] = new Playhead(n * 32, n * 32 + 32)
      }
      grid.sequence.fill('.')
      samples = sampleFiles.map(x => new Howl({ src: [x + ".mp3"] }))

      timer = setTimeout(tick, interval)

    },

    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;

      clearTimeout(timer)

    },

    onKey(key) {
      if (key.key.match(/^[1-9]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
      }
    },

    update(x, y, index) { },

    draw(frameCounter) {

      fill(0, 192, 0, 25)
      rectMode(CENTER)
      for (n = 0; n < 8; n++) {
        rect(unitOf(8), unitOf((n + 0.5) * 2), unitOf(16), unitOf(1.83))
      }

      fill(255, 165, 0, orangeAlpha)    // orange playhead
      for (n = 0; n < playheads.length; n++) {
        drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playheads[n].pos))
      }
    },
  }
})
