let mode = null

let cells = null

let cursor = document.querySelector('#cursor')

const init = () => {
  cursor = document.querySelector('#cursor')
  cells = document.querySelectorAll('#display>div')
  grid.mode = initMode(writeMode, grid)
  // grid.mode = initMode(randMode, grid)
  document.onkeydown = (event) => {
    const { key, altKey, ctrlKey, shiftKey, timeStamp } = event
    grid.onKey({ key, altKey, ctrlKey, shiftKey, timeStamp })
    render()
  }
  main()
}

const main = () => {
  setInterval(render, 1000)
}

const render = () => {
  grid.update()
  const lines = new Array(16).fill('').map((_, i) => 
  grid.sequence.slice(i*16, i*16+15).join('')
  )
  const body = lines.join('\n')
  console.log(body)
  
  document.querySelector('#display').innerText = body
  
  cursor.setAttribute("style", `left: calc((1ch + 10px) * ${grid.cursor.x}); top: ${grid.cursor.y * 1.5}rem;`)

  // Render the cursor
  // cells.forEach((cell, index) => {
  //   // render the content
  //   cell.textContent = grid.sequence[index]
  //   // render the cursor
  //   cell.className = grid.cursor.index == index ? "cursor" : ""
  // })
}

const grid = {
  w: 16,
  h: 16,
  mode: undefined, // the current mode
  sequence: Array(256).fill('.'), // create string of length,
  cursor: {
    x: 0,
    y: 0,
    index: 0,
  },
  onKey(e) {
    console.log(e)
    switch (e.key) {
      case "ArrowRight":
        this.moveBy(1,0)
        break;
      case "ArrowLeft":
        this.moveBy(-1,0)
        break;
      case "ArrowUp":
        this.moveBy(0,-1)
        break;
      case "ArrowDown":
        this.moveBy(0,1)
        break;
    }
    this.mode.onKey(e)
  },
  moveBy(x = 0, y = 0) {
    this.cursor.x += x
    this.cursor.y += y
    // Yes, this is so complicated because JS modulo does not wrap on negative numbers
    this.cursor.index = ((this.cursor.index + x + y * 16 % 256) + 256) % 256
  },
  moveTo({ x = 0, y = 0 }) {
    this.cursor.x = x
    this.cursor.y = y
    this.cursor.index = (x + 16 * y) % 256
  },
  update() {
    let x, y
    for (x = 0; x < 16; x += 1) {
      for (y = 0; y < 16; y += 1) {
        const index = y * 16 + x
        this.sequence[index] = this.mode.update(x, y, index)
      }
    }
  },
}

const randChar = () => String.fromCharCode(65 + Math.random() * 56)

const initMode = (mode, grid) => {
  const newMode = { ...mode, grid }
  newMode.init()
  return newMode
}


// A mode generating random chars
const randMode = {
  init() { },
  onKey(key) { },
  update(x, y) {
    return randChar()
  },
}

const writeMode = {
  init() { },
  onKey(key) {
    if (key.key.match(/^[A-z0-9 .?!]$/)) {
      this.grid.sequence[this.grid.cursor.index] = key.key
      this.grid.moveBy(1,0)
    }
  },
  update(x, y, index) {
    return this.grid.sequence[index]
  },
}


// A mode is a self contained object with a reference to the current grid
const rainMode = {
  init() { },
  onKey(key) { },
  update(x, y) {
  },
}