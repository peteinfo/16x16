// -------------------
//        16x16
// -------------------

// https://github.com/peteinfo/16x16

let mainFont

const { active, start, idle, whatState } = modeSwitcher({
  startupTime: 500,
  idleTime: 20000,
  transitionTime: 1000,
})

function preload() {
  preloadModes()
  //mainFont = loadFont('/fonts/Courier_New/Courier_New_Bold.ttf')
  mainFont = loadFont('/fonts/Andale_Mono/Andale_Mono.ttf')

}

function setup() {
  textFont(mainFont)
  //textFont('Andale Mono') // can also try Courier or look at other mono fonts?
  createCanvas(windowWidth, windowHeight)
  //frameRate(24)

  // Note: Not needed, `grid` is already initialised; TODO: this chould chnage to user initialisation.
  // setupGrid(16, 16)

  useMode("Ripples")
  //useMode("Long Sequence")
  //useMode("Random Access")
  //useMode("Prompt Mode")
  //useMode("Reflect Mode")
  //useMode("Just Write")
  //useMode("Test Sounds")
  //useMode("Game of Life")
  //useMode("Wondering Cursor")
  //useMode("Random Mode")

  // To debug a a mode do not call start() and just useMode instead and make adjustments to the background in draw()
  start()
}

// returns value alternating based on time
const blinking = (on, off) => (millis() % 1000) > 500 ? on : off

// shortest width divided by 25 (leaving a border of 2 on each side around grid)
const unitOfOne = () => Math.min(windowWidth, windowHeight) / 25
const unitOf = scale => unitOfOne() * scale


function draw() {
  const [phase, progress] = whatState()
  background(0)
  renderGrid(windowWidth / 2 - unitOf(8), windowHeight / 2 - unitOf(8), unitOf(16), unitOf(16))
  if (phase == 'start') {
    background(0, (1 - progress) * 255)
  }
  else if (phase == 'idle') {
    background(0, (progress) * 255)
  }
  else if (phase != 'active') {
    background(0)
  }
}

function windowResized() {
  // update the canvas size when the window is resized
  resizeCanvas(windowWidth, windowHeight)
}


function keyPressed(e) {
  if (e.key == 'Escape') {
    print('MODE CHANGE')
    idle()
    return
  }
  active()
  grid.onKey(e)
}

const drawChar = (c, fontSize, x, y) => (textSize(fontSize), text(c, x + fontSize * 1 / 3, y + fontSize))


const renderGrid = (x = 0, y = 0) => {
  grid.renderSequence()

  push()
  translate(x, y)


  const fontSize = unitOf(0.75)

  // draw border around grid
  /*
  push()
  stroke(0, 192, 0)
  noFill()
  rect(x, y, width, height)
  pop()
  */

  // Let the mode draw itself
  push()
  grid.drawMode()
  pop()


  noStroke()
  grid.forEach((char, index) => {
    const [x, y] = indexToPixelXY(index)

    // draw character at grid space
    fill(0, 192, 0)
    drawChar(char, fontSize, x, y)
    // if cursor position, draw flashing cursor block
    if (isCursorAt(grid, index)) {
      fill(blinking(200, 100))
      drawChar(cursorChar, fontSize, x, y);
    }
  }, true)

  fill(0, 192, 0)
  drawChar(modeDescription(grid), fontSize * 0.75, unitOf(0.125), unitOf(16) + fontSize / 2)
  pop()
}
