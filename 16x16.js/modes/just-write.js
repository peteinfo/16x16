// A writing mode
defineMode("just-write", grid => {

  return {
    init() { },
    onKey(key) {
      if (key.key.match(/^[A-z0-9 .?!]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.moveBy(1, 0)
      }
    },
    update(x, y, index) {
    },
  }
})
