// A cursor wonders across the grid and seeds cells
defineMode("wandering-cursor", grid => {
  const randDirection = () => Math.round(Math.random() * 3 - 1)
  let ticker = null
  let lastTyped = randChar()
  return {
    preload() {

    },
    init() {
      grid.sequence = new Array(grid.w*grid.h).fill('')
      ticker = setInterval(() => {
        grid.moveBy(randDirection(), randDirection())
        grid.sequence[grid.cursor.index] = lastTyped
      }, 100)
    },
    unload() {
      clearInterval(ticker)
    },
    onKey(key) {
      if (key.key.match(/^[A-z0-9 .?!]$/)) {
        // grid.sequence[grid.cursor.index] = key.key
        lastTyped = key.key
      }
    },
    update(x, y, index, frameCounter) {
      // wait for half a second to udpate the system
      if (frameCounter % 60  != 0) return
      // follow the rules
      const isLive = grid.sequence[index] !== ''
      let liveNeighbours = 0
      forNeighboursOf(x, y, ({index}) => {
        if (grid.sequence[index] !== '') liveNeighbours++
      }, false)
      if(liveNeighbours < 2) {
        grid.sequence[index] = ''
      }
      else if(liveNeighbours >= 2 && liveNeighbours <= 3) {
        // cell survives
        // grid.sequence[index] = grid.sequence[index]
      }
      else if(liveNeighbours > 3) {
        grid.sequence[index] = ''
      }
      else if (!isLive && liveNeighbours == 3) {
        // cell is born
        grid.sequence[index] = lastTyped
      }
    },
  }
})
