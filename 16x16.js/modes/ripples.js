defineMode("ripples", grid => {
  const ripples = {}
  const createRipple = () => ({
    r: 10,
    colour: [255, 255, 0, 127]
  })
  return {
    description: "this is a long sequence",
    preload() { },
    init() {

    },
    onKey(key) {
      if (key.key.match(/^[0-9a-z]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        if (!ripples[grid.cursor.index]) {
          ripples[grid.cursor.index] = createRipple()
        }
        grid.advanceBy(1)
      }
    },

    update(x, y, index) {

    },

    draw() {
      Object.entries(ripples).map(([key, ripple]) => {
        // Transform the ripple
        ripple.r = ripple.r + 1

        // House keeping
        if (ripples[key].r > 1000 ) {
          delete ripples[key]
        }

        // Draw the ripple
        const [x, y] = indexToPixelXY(key, CENTER)
        push()
        fill(...ripple.colour)
        ellipse(x, y, ripple.r)
        pop()
      })

    },
  }
})
