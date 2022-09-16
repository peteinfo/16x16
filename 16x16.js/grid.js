
// Variables
let u = 10;           // universal unit of measurement, updated from window width and height
let frameCounter = 0

// Full block: \u2588
const cursorChar = "\u2588" // The full block char


// Utilities
const mod = (value, m) => ((value % m) + m) % m

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


const setupGrid = (width, height) => {
  return {
    w: width, h: height,
    mode: undefined, // the current mode
    sequence: Array(width*height).fill('.'), // create string of length,
    cursor: moveTo(0, 0),
    forEach(func, withCursor = false) {
      this.sequence.forEach((char, index) => {
        let {x, y} = indexToXY({index})
        func(
          withCursor && this.cursor.index == index
          ? cursorChar
          : char,
        index, x, y)
      })
    },
    onKey(e) {
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
      this.cursor = moveBy(this.cursor, x, y)
    },
    moveTo(x = 0, y = 0) {
      this.cursor = moveTo(x, y)
    },
    update() {
      this.forEach((char, index, x, y) => this.mode.update(x, y, index, frameCounter))
      frameCounter++
    },
    setRandomCell(value) {
      this.sequence[Math.round(Math.random() * (this.sequence.length-1))] = value
    },
  }
}

const grid = setupGrid(16, 16)

const forNeighboursOf = (x, y, func = ({x, y, index}) => {}, includeDiagonal = false) => {
  // upper middle
  func(moveTo(x , y - 1))
  // upper right
  if (includeDiagonal)
    func(moveTo(x + 1, y - 1))
  // right
  func(moveTo(x + 1, y))
  // lower right
  if (includeDiagonal)
    func(moveTo(x + 1, y + 1))
  // lower middle
  func(moveTo(x, y + 1))
  // lower left
  if (includeDiagonal)
    func(moveTo(x - 1, y + 1))
  // left
  func(moveTo(x - 1, y))
  // upper left
  if (includeDiagonal)
    func(moveTo(x - 1, y - 1))
}

const seqWithCursor = (sequence, c) => sequence.map(
  (char, i) => i == c.index ? cursorChar : char
)

const asLines = (seq, width = 16) => new Array(width).fill('').map((_, i) =>
  seqWithCursor(seq).slice(i * width, i * width + width).join('')
).join('\n')

const randChar = () => String.fromCharCode(65 + Math.random() * 56)

const useMode = name => {
  if (!modes[name]) {
    console.log(`Could not find mode named "${name}".`)
    return
  }
  (grid.mode && grid.mode.onload && grid.mode.onload())
  grid.mode = modes[name]
  grid.mode.init()
}

let modes = {}
const defineMode = (name, func) => modes[name] = func(grid)

const preloadModes = () => Object.values(modes).forEach(mode => (mode.preload && mode.preload()))

const getMode = name => modes[name] || {}
const getModeName = grid => {
  return Object.entries(modes).find(([name, mode]) => {
    if (mode === grid.mode) return name
  })[0];
}
