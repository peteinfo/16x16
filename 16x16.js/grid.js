// Variables
let frameCounter = 0

// Full block: \u2588
const cursorChar = "\u2588" // The full block char


// Utilities
/**
 * Computes modulo with respect to negative numbers because of a quirk in JS
 * @param {number} value Left side of modulo
 * @param {number} m Right side of modulo
 * @returns number result of modulo
 */
const mod = (value, m) => ((value % m) + m) % m

/**
 * Transforms 2d grid coordinates into 1d sequence index.
 * @param {object} cursor {x, y} object i.e. a grid cursor
 * @returns number The corresponding index in the underlying sequence
 */
const xyToIndex = ({ x, y }) => mod(x + y * 16, 256)

/**
 * Adds sequence index to a 2D cursor object
 * @param {object} param0 The cursor object with x and y coordinates
 * @returns Cursor object with sequence index
 */
const withIndex = ({ x, y }) => ({ x, y, index: xyToIndex({ x, y }) })

/**
 * Transforms a sequence index into a 2D grid cursor object.
 * @param {object} cursor The cursor objecto to transform
 * @returns New cursor object
 */
const fromIndex = (index = 0) => ({
  x: mod(index, 16),
  y: mod(Math.floor(index / 16), 16),
  index: mod(index, 16 * 16),
})
/**
 * Transforms a sequence index into a 2D cursor object.
 * @param {object} cursor The cursor objecto to transform
 * @returns New cursor object
 */
const indexToXY = fromIndex

/**
 * Moves a cursor by x and y increments
 * @param {object} cursor The cursor objecto to transform
 * @param {number} xi Increment on the x axis
 * @param {number} yi  Increment on the y axis
 * @returns New cursor oject
 */
const moveBy = ({ index }, xi = 0, yi = 0) => {
  let { x, y } = fromIndex(index)
  return withIndex({
    x: !!xi ? mod(Math.floor(index + xi), 16) : x,
    y: !!yi ? mod(Math.floor((index + yi * 16) / 16), 16) : y,
  })
}

/**
 * Moves cursor object with 2D grid coordinates
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @returns New cursor object at given coordinates
 */
const moveTo = ({ /* old cursor not relevant */ }, x = 0, y = 0) => createCursor(x, y)

/**
 * Creates new cursor object with index incremented by given value
 * @param {object} param0 Cursor object to be transformed
 * @param {number} inc Increment on index of cursor
 * @returns New cursor object
 */
const moveByIndex = ({ index = 0 }, inc = 0) => fromIndex(index + inc)

/**
 * Creates a new cursor object with 2D grid coordinates
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @returns New cursor object at given coordinates
 */
const createCursor = (x = 0, y = 0) => withIndex({ x, y })

/**
 * Caculates cell value to pixel value with optional offset for center of cell
 * @param {int} cell Zero based cell index horizontal or vertical
 * @param {string} mode Currently either null, undefined, or 'center' (p5js 
 * @returns 
 */
const unitToPixel = (cell, mode = null) => Math.round(
  (mode == 'center' ? unitOf(0.5) : 0) + unitOf(cell)
)

/**
 * Transforms index position in grid space into coordinates in pixel space, i.e., for drawing operations.
 * @param {number} index positive index within bounds of sequence
 * @param {string} mode Currently either null, undefined, or 'center' (p5js constant CENTER) supported
 * @returns Array with x and y coordinates in pixel space based on grid units
 */
const indexToPixelXY = (index, mode = null) => {
  const { x, y } = fromIndex(index)
  return [unitToPixel(x, mode), unitToPixel(y, mode)]
}

/**
 * Creates a grid object.
 * @param {integer} width Number of grid columns
 * @param {integer} height Number of grid rows
 * @returns grid object
 */
const setupGrid = (width, height) => {
  return {
    description: "",
    w: width, h: height,
    mode: undefined, // the current mode
    sequence: Array(width * height).fill('.'), // create string of length,
    cursor: createCursor(0, 0),
    forEach(func, withCursor = false) {
      this.sequence.forEach((char, index) => {
        let { x, y } = fromIndex(index)
        func(
          withCursor && this.cursor.index == index
            //? cursorChar
            ? char
            : char,
          index, x, y)
      })
    },
    onKey(e) {
      //print(e) // print to look at key code
      switch (e.key) {
        case "ArrowRight":
          if (this.cursor.x == 15) {
            this.moveBy(0, 1)
          }
          this.moveBy(1, 0)
          break;
        case "ArrowLeft":
          if (this.cursor.x == 0) {
            this.moveBy(0, -1)
          }
          this.moveBy(-1, 0)
          break;
        case "ArrowUp":
          this.moveBy(0, -1)
          break;
        case "ArrowDown":
          this.moveBy(0, 1)
          break;
        case "Backspace":
          this.sequence[this.cursor.index] = '.'
          if (this.cursor.x == 0) {
            this.moveBy(0, -1)
          }
          this.moveBy(-1, 0)
          break;
        case " ":
          this.sequence[this.cursor.index] = '.'
          if (this.cursor.x == 15) {
            this.moveBy(0, 1)
          }
          this.moveBy(1, 0)
          break;
        /*
        case "Enter":
          // enter moves to first position of next line
          this.moveBy(0, 1)
          this.moveTo(0, this.cursor.y)
          break;
        */
      }
      this.mode.onKey(e)
    },
    moveBy(x = 0, y = 0) {
      this.cursor = moveBy(this.cursor, x, y)
    },
    moveTo(x = 0, y = 0) {
      this.cursor = moveTo(this.cursor, x, y)
    },
    advanceBy(inc) {
      this.cursor = moveByIndex(this.cursor, inc)
    },
    renderSequence() {
      if (this.mode.update) {
        this.forEach((char, index, x, y) => this.mode.update(x, y, index, frameCounter, char))
      }
      frameCounter++
    },
    drawMode() {
      (this.mode.draw && this.mode.draw(frameCounter))
    },
    setRandomCell(value) {
      this.sequence[Math.round(Math.random() * (this.sequence.length - 1))] = value
    },
  }
}

const grid = setupGrid(16, 16)

const isCursorAt = (grid, index) => grid.cursor.index === index

const forNeighboursOf = (x, y, func = ({ x, y, index }) => { }, includeDiagonal = false) => {
  // upper middle
  func(moveTo(x, y - 1))
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
  console.log('Loading mode', name)
  if (!modes[name]) {
    console.log(`Could not find mode named "${name}".`)
    return
  }
  if (grid.mode) {
    // console.log("Unloading mode", grid.mode)
    (grid.mode.unload && grid.mode.unload())
    grid.mode = null
  }
  (grid.mode && grid.mode.onload && grid.mode.onload())
  grid.mode = modes[name]
  grid.mode.init()
}

let modes = {}
const defineMode = (name, func) => modes[name] = { name, ...func(grid) }

const preloadModes = () => Object.values(modes).forEach(mode => (mode.preload && mode.preload()))

const pickRandom = array => {
  for (let index = 0; index < array.length; index++) {
    if (Math.random() > 0.5) return array[index]
  }
}

const allModes = () => Object.keys(modes).filter(m => m != 'prompt')

const randomMode = () => pickRandom(allModes())

const getMode = name => modes[name] || {}
const currentModeName = grid => {
  return Object.entries(modes).find(([name, mode]) => {
    if (mode === grid.mode) return name
  })[0];
}

const modeSwitcher = ({
  startupTime = 500,
  idleTime = 10000,
  transitionTime = 1000
}) => {

  let idleSince = 0
  let lastActive = 0

  let phase = 'preboot' // preboot, start, active, idle, switch

  const timer = (lastTime, limit) => {
    const time = Math.min(millis() - lastTime, limit)
    const progress = Math.min(time / limit, 1.0)
    const done = time == limit
    return [done, progress, time]
  }

  const active = () => {
    //console.log('switching from', phase, 'to active')
    if (phase != 'active' && phase != 'start') return
    phase = 'active'
    lastActive = millis()
  }

  const start = () => {
    //console.log('switching from', phase, 'to start')
    if (phase != null && phase != undefined && phase != 'preboot' && phase != 'switch') return
    phase = 'start'
    startedAt = millis()
    // move to back to the origin when starting a new mode
    // this keeps it out of the way in the prompt mode
    grid.moveTo(0, 0)
  }

  const idle = () => {
    //console.log('switching from', phase, 'to idle')
    if (phase == 'idle') return
    phase = 'idle'
    idleSince = millis()
  }

  return {
    active, start, idle,
    whatState: () => {
      switch (phase) {
        case 'start':
          var [done, ...values] = timer(startedAt, startupTime)
          if (done) active()
          return ['start', ...values]
        case 'active':
          var [done, ...values] = timer(lastActive, idleTime)
          if (done) idle()
          return ['active', ...values]
        case 'idle':
          var [done, ...values] = timer(idleSince, transitionTime)
          if (done) phase = 'switch'
          return ['idle', ...values]
        case 'switch':
          // use prompt mode when current is none prompt mode
          const isPrompt = grid.mode.isPrompt || false
          useMode(
            isPrompt
              ? randomMode()
              : 'prompt'
          )
          start()
          return ['switch', 1, 1]
      }
    }
  }
}

const modeDescription = grid => grid.mode.description || currentModeName(grid)

