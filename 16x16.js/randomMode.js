// A mode generating random chars
defineMode("Random Mode", grid => {
  return {
    init() { },
    onKey(key) { },
    update(x, y, index) {
      grid.mode.sequence[index] = randChar()
    },
  }
})

