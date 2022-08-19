const cursor = "\u2588" // The full block char

// Full block: \u2588

let frameCounter = 0

const makeGrid = (width, height) => {
  return {
    w: width, h: height,
    mode: undefined, // the current mode
    sequence: Array(width*height).fill('.'), // create string of length,
    cursor: {
      x: 0,
      y: 0,
      index: 0,
    },
    forEach(func) {
      this.sequence.forEach((char, index) => {
        let {x, y} = indexToXY({index})
        func(char, index, x, y)
      })
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
      this.cursor = move(this.cursor).by(x, y)
    },
    moveTo(x = 0, y = 0) {
      this.cursor = move(this.cursor).to(x, y)
    },
    update() {
      let x, y
      for (x = 0; x < 16; x += 1) {
        for (y = 0; y < 16; y += 1) {
          this.mode.update(x, y, y * 16 + x)
        }
      }
    },
  }
}

const renderGrid = grid => {
  grid.update(frameCounter)

  // Add the cursor to the sequence on every other frame
  // mod(frameCounter, 2) == 0 ? grid.sequence : 
  const seq = grid.sequence.map(
    (c, i) => i == grid.cursor.index ? cursor : c
  )
  // Split into lines for rendering in DOM
  const lines = new Array(16).fill('').map((_, i) =>
    seq.slice(i * 16, i * 16 + 16).join('')
  ).join('\n')

  frameCounter++
  return lines
}

const xyToIndex = ({x, y}) => mod(x + y * 16, 256)

const indexToXY = ({index}) => ({
  x: mod(index, 16),
  y: mod(Math.floor(index / 16), 16),
})


const moveBy = ({index}, xi = 0, yi = 0) => {
  let {x, y} = indexToXY({index})
  if (xi != 0) {
    x = mod(index + xi, 16)
  }
  if (yi != 0) {
    y = mod(Math.floor((index + yi * 16) / 16), 16)
  }
  return { x, y, index: xyToIndex({x, y})}
}

const moveTo = (x = 0, y = 0) => moveBy({index: 0}, x, y)

const moveToIndex = index => {
  const _index = mod(index, 256)
  return { ...indexToXY({_index}), _index }
}

const move = ({index = 0}) => ({
  by: (xi = 0, yi = 0) => moveBy({index}, xi, yi),
  to: (x = 0, y = 0) => moveTo({index}, x, y)
})


const randChar = () => String.fromCharCode(65 + Math.random() * 56)

const initMode = name => (modes[name] && (grid.mode = modes[name]).init())

let modes = {}
const defineMode = (name, func) => modes[name] = func({})

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

// A writing mode
defineMode("Just Write", grid => {

  return {
    init() { },
    onKey(key) {
      console.log(grid)
      if (key.key.match(/^[A-z0-9 .?!]$/)) {
        grid.sequence[grid.cursor.index] = key.key
        grid.moveBy(1, 0)
      }
    },
    update(x, y, index) {
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