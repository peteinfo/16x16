// A writing mode
defineMode("Reflect Mode", grid => {

  return {
    init() { },
    onKey(key) {
      if (key.key.match(/^[A-z0-9 .?!]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        
        // reflections
        grid.sequence[mod(grid.cursor.x - grid.cursor.y * 16, 256)] = key.key
        grid.sequence[mod(-grid.cursor.x + grid.cursor.y * 16, 256)] = key.key
        grid.sequence[mod(-grid.cursor.x - grid.cursor.y * 16, 256)] = key.key

        grid.moveBy(1, 0)
      }
    },
    update(x, y, index) {
    },
  }
})
