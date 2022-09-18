
// -------------------
//    Long Sequence
// -------------------
// One long sequence, playing all steps in the grid.

defineMode("Long Sequence", grid => {

  var playhead01 = 0
  var playhead01_last = 0

  return {
    init() { },

    onKey(key) {
      if (key.key.match(/^[A-z0-9 .?!]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.moveBy(1, 0)
      }
    },

    update(x, y, index) {
      
      // update the playhead position
      playhead01 = round((millis()/100.0)%256)

      // play sound if playhead position has changed and there is a note at that location to play
      if (playhead01 != playhead01_last) {
        //print("SOUND PLAYED")
        print(index)
      }

      // update playhead_last
      playhead01_last = playhead01

      // if cursor position, draw flashing cursor block
      if (playhead01 == index) {
          fill(255, 165, 0, 100)
          push()
          translate(windowWidth / 2 - 8 * u, windowHeight / 2 - 8 * u)
          textSize(u*0.75)
          text(cursorChar, x * Math.round(u*16 / grid.w), y * Math.round(u*16 / grid.h))
          pop()
      }

    },
  }
})
