
// -------------------
//    MULTI TRACK
// -------------------

defineMode("short-sequence", grid => {

  let samples = [
    /* 00 - 0 */ "./samples/vibes/00.mp3",
    /* 01 - 1 */ "./samples/vibes/01.mp3",
    /* 02 - 2 */ "./samples/vibes/02.mp3",
    /* 03 - 3 */ "./samples/vibes/03.mp3",
    /* 04 - 4 */ "./samples/vibes/04.mp3",
    /* 05 - 5 */ "./samples/vibes/05.mp3",
    /* 06 - 6 */ "./samples/vibes/06.mp3",
    /* 07 - 7 */ "./samples/vibes/07.mp3",
    /* 08 - 8 */ "./samples/vibes/08.mp3",
    /* 09 - 9 */ "./samples/vibes/09.mp3",
    /* 10 - a */ "./samples/vibes/10.mp3",
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

  var sound

  class Playhead {
    constructor(min, max, speed) {
      this.pos = min
      this.min = min
      this.max = max
      this.posLast = min
      this.interval = speed

    }
  }

  let playhead = new Playhead(0, 15, 150)
  let firstKeyPressed = false

  function tick() {
    // this function is triggered every interval
    playhead.pos++;
    if (playhead.pos > playhead.max) {
      playhead.pos = playhead.min
    }
    setTimeout(tick, playhead.interval)
  }

  return {
    description: "level 1: one row at a time\n[0-9] vibes [a-z] drums\n[Enter] jumps playhead to row",
    preload() {
      samples = samples.map(loadSound)

      sound = new Howl({
        src: ['./samples/vibes/06.mp3']
      });
    },

    init() {
      setTimeout(tick, playhead.interval)
      grid.sequence.fill('.')
    },

    onKey(key) {

      // WEIRD BUG ALERT - NEEDS FIXING
      // The samples only play if you trigger one first here (!!)
      // So playing a silent sample on every keypress, just to make sure the others play.
      // Only need to do this once after first key press.
      if (!firstKeyPressed) {
        // play a sound to start it off?
        firstKeyPressed = true
      }
      if (key.key.match(/^[0-9a-z]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.advanceBy(1)
      }
      if (key.key == 'Enter') {
        // if Enter is pressed then jump playhead to that position
        //playhead.min = 16*cursor.y
        sound.rate(0.15)
        sound.volume(0.5)
        sound.play()
      }
    },

    update(x, y, index) { },

    draw(frameCounter) {

      // and does the index contain a note to play?
      if (grid.sequence[playhead.pos] != '.') {

        // and finally has the playhead just moved into a new position? (to avoid repeats while playhead passes through a position) 
        if (playhead.poslast != playhead.pos) {

          // Great! Let's play a note
          //print("PLAY NOTE! index: " + playhead01 + " contains: " + grid.sequence[playhead01])
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

          //samples[sampleToPlay].rate(2)
          samples[sampleToPlay].stop()
          samples[sampleToPlay].play()
        }
        // }
        // update the last position of the playhead
        playhead.posLast = playhead.pos
      }

      fill(255, 165, 0, 100)    // orange playhead
      drawChar(cursorChar, unitOf(0.75), ...indexToPixelXY(playhead.pos))
    },
  }
})
