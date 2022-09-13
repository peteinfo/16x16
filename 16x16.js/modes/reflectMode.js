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
      noStroke()
      fill(x*10, y*1 , y*10, 200)
      ellipseMode(CENTER)
      ellipse(x * Math.round(width / grid.w), y * Math.round(height / grid.h), grid.sequence[index]*10, grid.sequence[index]*10)
    },
  }
})
