
// -------------------
//    Long Sequence
// -------------------
// One long sequence, playing all steps in the grid.
// Each note is a different sample?

defineMode("Long Sequence", grid => {

  var p1 = 4

  return {
    init() { },

    onKey(key) {
      if (key.key.match(/^[A-z0-9 .?!]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.moveBy(1, 0)
      }
    },

    update(x, y, index) {

      p1 = round((millis()/100.0)%256)

      // if cursor position, draw flashing cursor block
      if (p1 == index) {
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
