
// -------------------
//    Long Sequence
// -------------------
// One long sequence, playing all steps in the grid.

// DISTORTION ISSUE:
// https://www.reddit.com/r/p5js/comments/opo5h3/comment/h6rnsu6/


defineMode("Long Sequence", grid => {

  let samples = [
    "./samples/silence.wav",
    "./samples/kick.wav",
    "./samples/type.wav",
    "./samples/tom.wav",
  ]

  let playhead01 = 0
  let playhead01_last = 0
  let firstKeyPressed = false

  return {

    preload() {
      soundFormats('wav', 'm4a');
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

      if (key.key.match(/^[1-3]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.moveBy(1, 0)
      } else if (key.key.match(/^[a-zA-Z4-90]$/)){
        grid.sequence[grid.cursor.index] = round(random(1, 3))
        grid.moveBy(1, 0)
      }
    },

    update(x, y, index) {

      // update the playhead position
      playhead01 = round((millis() / 200.0) % 256)

      // is playhead at current index?
      if ((playhead01 == index)) {

        // and does the index contain a note to play?
        if (grid.sequence[index] != '.') {

          // and finally has the playhead just moved into a new position? (to avoid repeats while playhead passes through a position) 
          if (playhead01_last != playhead01) {

            // Great! Let's play a note
            print("PLAY NOTE! index: " + index + " contains: " + grid.sequence[index])
            //samples[grid.sequence[index]].rate(2)
            samples[grid.sequence[index]].pan(0.1)
            samples[grid.sequence[index]].stop()
            samples[grid.sequence[index]].play()
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
