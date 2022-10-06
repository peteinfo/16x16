// A mode generating random chars
defineMode("random", grid => {
  return {
    init() { },
    onKey(key) { },
    update(x, y, index) {
      grid.mode.sequence[index] = randChar()
    },
  }
})

