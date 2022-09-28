// A writing mode
defineMode("reflections", grid => {

  return {
    init() { },
    onKey(key) {
      if (key.key.match(/^[0-9]$/)) {
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

      push()
      translate(windowWidth / 2 - 8 * u, windowHeight / 2 - 8 * u)
      fill(x*10, y*1 , y*10, 200)
      ellipseMode(CENTER)
      // NEEEDS UPDATING
      //ellipse(x * Math.round(u*16 / grid.w) + u*0.2, y * Math.round(u*16 / grid.h) - u*0.05, grid.sequence[index]*10, grid.sequence[index]*10)
      pop();
    },
  }
})
