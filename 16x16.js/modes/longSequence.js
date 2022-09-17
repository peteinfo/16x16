
// -------------------
//    Long Sequence
// -------------------
// One long sequence, playing all steps in the grid.
// Each note is a different sample?

defineMode("Long Sequence", grid => {

  let p1 = 0
  
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
