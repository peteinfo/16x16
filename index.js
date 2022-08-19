const cursor = "\u2588" // The full block char

// Full block: \u2588

let frameCounter = 0

const init = () => {
  initMode("Audio Test Mode")
  initMode("Just Write")

  document.onkeydown = (event) => {
    const { key, altKey, ctrlKey, shiftKey, timeStamp } = event
    grid.onKey({ key, altKey, ctrlKey, shiftKey, timeStamp })
    render()
  }
  main()
}
window.addEventListener('DOMContentLoaded', init)

const main = () => setInterval(render, 500)

const render = () => {
  grid.update()

  // Add the cursor to the sequence on every other frame
  const seq = mod(frameCounter, 2) == 0 ? grid.sequence : grid.sequence.map(
    (c, i) => i == grid.cursor.index ? cursor : c
  )
  // Split into lines for rendering in DOM
  const lines = new Array(16).fill('').map((_, i) =>
    seq.slice(i * 16, i * 16 + 16).join('')
  ).join('\n')

  document.querySelector('body').innerText = lines
  frameCounter++
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
    // console.log(e)
    switch (e.key) {
      case "ArrowRight":
        this.moveBy(1, 0)
        break;
      case "ArrowLeft":
        this.moveBy(-1, 0)
        break;
      case "ArrowUp":
        this.moveBy(0, -1)
        break;
      case "ArrowDown":
        this.moveBy(0, 1)
        break;
    }
    this.mode.onKey(e)
  },
  moveBy(x = 0, y = 0) {
    if (x != 0) {
      this.cursor.x = mod(this.cursor.index + x, 16)
    }
    if (y != 0) {
      this.cursor.y = mod(Math.floor((this.cursor.index + y * 16) / 16), 16)
    }
    this.cursor.index = mod(this.cursor.x + this.cursor.y * 16, 256)
  },
  moveTo(x = 0, y = 0) {
    this.cursor.index = mod(x + 16 * y, 256)
    this.cursor.x = mod(this.cursor.index, 16)
    this.cursor.y = mod(Math.floor((this.cursor.index) / 16), 16)
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

const initMode = name => (modes[name] && (grid.mode = modes[name]).init())

let modes = {}
const defineMode = (name, func) => modes[name] = func(grid)

// A mode generating random chars
defineMode("Random Mode", grid => {
  return {
    init() { },
    onKey(key) { },
    update(x, y) {
      return randChar()
    },
  }
})

// A writing mode
defineMode("Just Write", grid => {

  return {
    init() { },
    onKey(key) {
      if (key.key.match(/^[A-z0-9 .?!]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.moveBy(1, 0)
      }
    },
    update(x, y, index) {
      return grid.sequence[index]
    },
  }
})

// A writing mode
defineMode("Audio Test Mode", grid => {
  let samples = [
    "./samples/kick.wav",
    "./samples/type.wav",
  ]

  return {
    init() {
      samples = samples.map(loadSample)
    },
    onKey() {
      samples[Math.round(Math.random())].play()
    },
    update(x, y, index) {
      return grid.sequence[index]
    },
  }
})


// A mode is a self contained object with a reference to the current grid
// A writing mode
defineMode("Raining", grid => {

  return {
    init() { },
    onKey(key) { },
    update(x, y) { },
  }
})


// Utilities
const mod = (value, m) => ((value % m) + m) % m

const loadSample = url => new Audio(url)