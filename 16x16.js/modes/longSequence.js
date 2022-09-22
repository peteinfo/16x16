
// -------------------
//    Long Sequence
// -------------------
// One long sequence, playing all steps in the grid.

// DISTORTION ISSUE:
// https://www.reddit.com/r/p5js/comments/opo5h3/comment/h6rnsu6/


defineMode("Long Sequence", grid => {

  let samples = [
    /* 00 - 0 */ "./samples/interface/silence.mp3",
    /* 01 - 1 */ "./samples/drums/basic/kick.mp3",
    /* 02 - 2 */ "./samples/drums/basic/type.mp3",
    /* 03 - 3 */ "./samples/drums/basic/tom.mp3",
    /* 04 - 4 */ "./samples/drums/subtle-glitch/EP12-1SR29.mp3",
    /* 05 - 5 */ "./samples/drums/subtle-glitch/EP12-2SR30.mp3",
    /* 06 - 6 */ "./samples/drums/subtle-glitch/EP12-CB03.mp3",
    /* 07 - 7 */ "./samples/drums/subtle-glitch/EP12-CB06.mp3",
    /* 08 - 8 */ "./samples/drums/subtle-glitch/EP12-CH13.mp3",
    /* 09 - 9 */ "./samples/drums/subtle-glitch/EP12-CPm14.mp3",
    /* 10 - a */ "./samples/drums/subtle-glitch/EP12-CPm20.mp3",
    /* 11 - b */ "./samples/drums/subtle-glitch/EP12-CRg13.mp3",
    /* 12 - c */ "./samples/drums/subtle-glitch/EP12-KCl09.mp3",
    /* 13 - d */ "./samples/drums/subtle-glitch/EP12-KCs12.mp3",
    /* 14 - e */ "./samples/drums/subtle-glitch/EP12-KCs16.mp3",
    /* 15 - f */ "./samples/drums/subtle-glitch/EP12-OH30.mp3",
    /* 16 - g */ "./samples/drums/subtle-glitch/EP12-SK17.mp3",
    /* 17 - h */ "./samples/drums/subtle-glitch/EP12-XTg04.mp3",
    /* 18 - i */ "./samples/drums/subtle-glitch/EP12-XTg18.mp3",
    /* 19 - j*/ "./samples/drums/subtle-glitch/EP12-XTl12.mp3",
    // REPEATS 
    /* 20 - k */ "./samples/drums/subtle-glitch/EP12-CRg13.mp3",
    /* 21 - l */ "./samples/drums/subtle-glitch/EP12-KCl09.mp3",
    /* 22 - m */ "./samples/drums/subtle-glitch/EP12-KCs12.mp3",
    /* 23 - n */ "./samples/drums/subtle-glitch/EP12-KCs16.mp3",
    /* 24 - o */ "./samples/drums/subtle-glitch/EP12-OH30.mp3",
    /* 25 - p */ "./samples/drums/subtle-glitch/EP12-SK17.mp3",
    /* 26 - q */ "./samples/drums/subtle-glitch/EP12-XTg04.mp3",
    /* 27 - r */ "./samples/drums/subtle-glitch/EP12-XTg18.mp3",
    /* 28 - s */ "./samples/drums/subtle-glitch/EP12-XTl12.mp3",
    /* 29 - t */ "./samples/drums/subtle-glitch/EP12-1SR29.mp3",
    /* 30 - u */ "./samples/drums/subtle-glitch/EP12-2SR30.mp3",
    /* 31 - v */ "./samples/drums/subtle-glitch/EP12-CB03.mp3",
    /* 32 - w */ "./samples/drums/subtle-glitch/EP12-CB06.mp3",
    /* 33 - x */ "./samples/drums/subtle-glitch/EP12-CH13.mp3",
    /* 34 - y */ "./samples/drums/subtle-glitch/EP12-CPm14.mp3",
    /* 35 - z */ "./samples/drums/subtle-glitch/EP12-CPm20.mp3"
  ]

  let playhead01 = 0
  let playhead01_last = 0
  let firstKeyPressed = false

  return {

    preload() {
      //soundFormats('mp3');
      samples = samples.map(loadSound)
    },

    init() {
    },

    playSample() {
    },

    onKey(key) {

      // WEIRD BUG ALERT - NEEDS FIXING
      // The samples only play if you trigger one first here (!!)
      // So playing a silent sample on every keypress, just to make sure the others play.
      // Only need to do this once after first key press.
      if (!firstKeyPressed) {
        samples[0].play()
        firstKeyPressed = true
      }

      if (key.key.match(/^[0-9a-z]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.moveBy(1, 0)
      }
    },

    update(x, y, index) {

      // update the playhead position
      playhead01 = round((millis() / 250.0) % 256)

      // is playhead at current index?
      if ((playhead01 == index)) {

        // and does the index contain a note to play?
        if (grid.sequence[index] != '.') {

          // and finally has the playhead just moved into a new position? (to avoid repeats while playhead passes through a position) 
          if (playhead01_last != playhead01) {

            // Great! Let's play a note
            print("PLAY NOTE! index: " + index + " contains: " + grid.sequence[index])
            
            let sampleToPlay = '0'

            if (grid.sequence[index].match(/^[0-9]$/)) {
              sampleToPlay = grid.sequence[index]
            }
            else if (grid.sequence[index].match(/^[a-z]$/)) {
              print(grid.sequence[index])
              //sampleToPlay = grid.sequence[index]
            }

            //samples[sampleToPlay].rate(2)
            samples[sampleToPlay].pan(0.1)
            samples[sampleToPlay].stop()
            samples[sampleToPlay].play()
          }
        }
        // update the last position of the playhead
        playhead01_last = playhead01
      }

      // if playhead is at current index, then draw the playhead
      if (playhead01 == index) {
        fill(255, 165, 0, 100)    // orange playhead
        push()
        translate(windowWidth / 2 - 8 * u, windowHeight / 2 - 8 * u)
        textSize(u * 0.75)
        text(cursorChar, x * Math.round(u * 16 / grid.w), y * Math.round(u * 16 / grid.h))
        pop()
      }
    },
  }
})
