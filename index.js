let mode = null

const init = () => {
  mode = initMode(rainMode, grid)
  grid.moveBy(1, 1)
  console.log("yay", grid)
  grid.run()
  document.onkeydown = function(event) {
    const {key, altKey, ctrlKey, shiftKey, timeStamp} = event
    grid.onKey({key, altKey, ctrlKey, shiftKey, timeStamp})
  }
}

const grid = {
  w: 16,
  h: 16,
  sequence: Array(256), // create string of length,
  cursor: {
    x: 0,
    y: 0,
  },
  onKey(e) {
    console.log(e)
  },
  moveBy (x = 0, y = 0) {
    this.cursor.x += x
    this.cursor.y += y
  },
  moveTo ({x = 0, y = 0}) {
    this.cursor.x += x
    this.cursor.y += y
  },
  _ticker: undefined,
  run() {
    this._ticker = setInterval(this.tick.bind(this), 1000)
  },
  tick() {
    let x, y
    for (x=0; x<16; x+=1) {
      for (y=0; y<16; y+=1) {
        this.sequence[y*16+x] = randChar()
      }
    }
    this.render()
  },
  render() {
    const cells = document.querySelectorAll('#display>div')
    // console.log(this.sequence)
    cells.forEach((cell, i) => {
      cell.textContent = this.sequence[i]
      if (this.cursor.y*16+this.cursor.x == i) {
        cell.className = "cursor"
      } else {
        cell.className = ""
      }
    })

  }
}

const randChar = () => String.fromCharCode(65+Math.random()*57)

const initMode = (mode, grid) => {
  const newMode = {...mode, grid}
  newMode.init()
  return newMode
}

// A mode is a self contained object with a reference to the current grid
const rainMode = {
  grid: null,
  init: () => {},
  onKey: key => {
    console.log('rain mode had key press of ', key)
  },
}