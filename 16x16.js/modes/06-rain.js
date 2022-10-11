defineMode("rain", grid => {

  let playheads = []
  let timers = []      // for being able to cancel the setTimeout call on exit
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
    /* 10 - a */ "./samples/kalimba/10.mp3",
    /* 10 - a */ "./samples/kalimba/11.mp3",
    /* 10 - a */ "./samples/kalimba/12.mp3",
    /* 10 - a */ "./samples/kalimba/13.mp3",
    /* 10 - a */ "./samples/kalimba/14.mp3",
    /* 11 - b */ "./samples/drums/subtle-glitch/EP12-CRg13.mp3",
    /* 12 - c */ "./samples/drums/subtle-glitch/EP12-KCl09.mp3",
    /* 13 - d */ "./samples/drums/subtle-glitch/EP12-KCs12.mp3",
    /* 14 - e */ "./samples/drums/subtle-glitch/EP12-KCs16.mp3",
    /* 15 - f */ "./samples/drums/subtle-glitch/EP12-OH30.mp3",
    /* 16 - g */ "./samples/drums/subtle-glitch/EP12-SK17.mp3",
    /* 17 - h */ "./samples/drums/subtle-glitch/EP12-XTg04.mp3",
    /* 18 - i */ "./samples/drums/subtle-glitch/EP12-XTg18.mp3",
    /* 19 - j*/ "./samples/drums/subtle-glitch/EP12-XTl12.mp3",
    /* 20 - k */ "./samples/drums/basic/kick.mp3",
    /* 21 - l */ "./samples/drums/basic/type.mp3",
    /* 22 - m */ "./samples/drums/basic/tom.mp3",
    /* 23 - n */ "./samples/drums/subtle-glitch/EP12-1SR29.mp3",
    /* 24 - o */ "./samples/drums/subtle-glitch/EP12-2SR30.mp3",
    /* 25 - p */ "./samples/drums/subtle-glitch/EP12-CB03.mp3",
    /* 26 - q */ "./samples/drums/subtle-glitch/EP12-CB06.mp3",
    /* 27 - r */ "./samples/drums/subtle-glitch/EP12-CH13.mp3",
    /* 28 - s */ "./samples/drums/subtle-glitch/EP12-CPm14.mp3",
    /* 29 - t */ "./samples/drums/subtle-glitch/EP12-CPm20.mp3",
    /* 30 - u */ "./samples/vibes/10.mp3",
    /* 31 - v */ "./samples/vibes/00.mp3",
    /* 32 - w */ "./samples/vibes/01.mp3",
    /* 33 - x */ "./samples/drums/subtle-glitch/EP12-CH13.mp3",
    /* 34 - y */ "./samples/drums/subtle-glitch/EP12-CPm14.mp3",
    /* 35 - z */ "./samples/drums/subtle-glitch/EP12-CPm20.mp3"
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

      //samples[sampleToPlay].rate(1)
      //samples[sampleToPlay].stop()
      samples[sampleToPlay].play()
    }
    timers[n] = setTimeout(tick, playheads[n].interval, n)
  }

  return {
    title: "\nLEVEL 6: LIKE SAMPLES IN RAIN \n--------------------------- \
            Playheads stream down the window. Try to find some order in the noise.",
    info: "\n\
            [0-9] rain \
            [a-z] weather \
            \n\n\
            [tab] next level\
            [esc] last level\
            \
          \n",

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
      samples = sampleFiles.map(x => new Howl({ src: [x] }))
    },

    // unload is called when the mode actually unloads
    unload() {
      // delete samples array
      samples.length = 0;

      for (n = 0; n < timers.length; n++) {
        clearTimeout(timers[n])
      }
    },

    onKey(key) {
      if (key.key.match(/^[0-9a-z]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.advanceBy(1)
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
