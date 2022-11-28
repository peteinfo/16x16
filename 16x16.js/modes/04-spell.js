defineMode("spell", grid => {

  let track
  let timer // for being able to cancel the setTimeout call on exit
  let samples
  let sampleFiles = [
    /* 00 - 0 */ "./samples/nothing/0",
    /* 01 - 1 */ "./samples/drumkit-808-clean/02",
    /* 02 - 2 */ "./samples/drumkit-808-clean/03",
    /* 03 - 3 */ "./samples/drumkit-808-clean/04",
    /* 04 - 4 */ "./samples/drumkit-808-clean/05",
    /* 05 - 5 */ "./samples/drumkit-808-clean/06",
    /* 06 - 6 */ "./samples/drumkit-808-clean/07",
    /* 07 - 7 */ "./samples/drumkit-808-clean/08",
    /* 08 - 8 */ "./samples/drumkit-808-clean/09",
    /* 09 - 9 */ "./samples/drumkit-808-clean/01",
    /* 10 - a */ "./samples/alphabet/a",
    /* 11 - b */ "./samples/alphabet/b",
    /* 12 - c */ "./samples/alphabet/c",
    /* 13 - d */ "./samples/alphabet/d",
    /* 14 - e */ "./samples/alphabet/e",
    /* 15 - f */ "./samples/alphabet/f",
    /* 16 - g */ "./samples/alphabet/g",
    /* 17 - h */ "./samples/alphabet/h",
    /* 18 - i */ "./samples/alphabet/i",
    /* 19 - j */ "./samples/alphabet/j",
    /* 20 - k */ "./samples/alphabet/k",
    /* 21 - l */ "./samples/alphabet/l",
    /* 22 - m */ "./samples/alphabet/m",
    /* 23 - n */ "./samples/alphabet/n",
    /* 24 - o */ "./samples/alphabet/o",
    /* 25 - p */ "./samples/alphabet/p",
    /* 26 - q */ "./samples/alphabet/q",
    /* 27 - r */ "./samples/alphabet/r",
    /* 28 - s */ "./samples/alphabet/s",
    /* 29 - t */ "./samples/alphabet/t",
    /* 30 - u */ "./samples/alphabet/u",
    /* 31 - v */ "./samples/alphabet/v",
    /* 32 - w */ "./samples/alphabet/w",
    /* 33 - x */ "./samples/alphabet/x",
    /* 34 - y */ "./samples/alphabet/y",
    /* 35 - z */ "./samples/alphabet/z"
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
      samples[sampleToPlay].play()
    }
    timer = setTimeout(tick, playhead.interval)
  }

  return {
    level: true,
    title: 
      "SPELL & SPEAK\n-----------------------\
      Alphabetical sequencing with an 808 on the side.",
    info: 
      "\n[1-9] place sample\n\
      [a-z] say letter\n\
      [space] select row\n\
      [arrows] move cursor\n\
      [delete] clear sample\n\
      [tab] prev level\n\
      [enter] next level",

    showPrompt: true,

    preload() {
    },

    init() {
      track = 0
      timer = setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
      samples = sampleFiles.map(x => new Howl({ src: [x + ".wav", x + ".mp3"] }))
      grid.moveTo(7,0)
    },
    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;
      clearTimeout(timer)
    },

    onKey(key) {
      if (key.key.match(/^[1-9a-z]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        //grid.advanceBy(1)
      } else if (key.key == ' ') {
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
