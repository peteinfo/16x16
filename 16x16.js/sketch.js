// -------------------
//        16x16
// -------------------

// https://github.com/peteinfo/16x16

// Sound Library is Howler:
// https://github.com/goldfire/howler.js

var mainFont
var green
var orange

const { active, start, idle, whatState } = modeSwitcher({
  startupTime: 1000,
  idleTime: 60000, // 60 seconds until system gets bored and moves on
  transitionTime: 3000,
})

function preload() {
  preloadModes()
  mainFont = loadFont('./fonts/Andale_Mono/Andale_Mono.ttf')
}

function setup() {
  textFont(mainFont)
  green = color(0, 192, 0)
  orange = color(255, 165, 0)
  createCanvas(windowWidth, windowHeight)
  useMode("start")
  //useMode("design")
  //useMode("prompt")
  //useMode("long-sequence")
  //useMode("short-sequence")
  //useMode("example")
  //useMode("gamer-of-life")
  //useMode("just-write")
  //useMode("random-access")
  //useMode("random")
  //useMode("reflections")
  //useMode("ripples")
  //useMode("sound-test")
  //useMode("wandering-cursor")

  // To debug a a mode do not call start() and just useMode instead and make adjustments to the background in draw()
  start()
}

// returns value alternating based on time
const blinking = (on, off) => (millis() % 1000) > 500 ? on : off

// shortest width divided by 25 (leaving a border of 2 on each side around grid)
const unitOfOne = () => Math.min(windowWidth, windowHeight) / 24
const unitOf = scale => unitOfOne() * scale


function draw() {
  const [phase, progress] = whatState()
  background(0)
  renderGrid(windowWidth / 2 - unitOf(8), windowHeight / 2 - unitOf(9), unitOf(16), unitOf(16))
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
  // indicate that user is still active
  active()
  // pass key press to grid
  grid.onKey(e)
}

function mousePressed() {
  // indicate that user is still active
  active()
  // left click
  if (mouseX < (windowWidth / 2 - unitOf(8))) {
    grid.moveBy(-1, 0)
    grid.mode.onKey("mouseLeft")

  }
  // right click
  if (mouseX > (windowWidth / 2 + unitOf(8))) {
    grid.moveBy(1, 0)
    grid.mode.onKey("mouseRight")
  }
  // up click
  if (mouseY < (windowHeight / 2 - unitOf(8))) {
    grid.moveBy(0, -1)
    grid.mode.onKey("mouseUp")

  }
  // down click
  if (mouseY > (windowHeight / 2 + unitOf(8))) {
    grid.moveBy(0, +1)
    grid.mode.onKey("mouseDown")

  }
  // click in grid
  if ((mouseX > (windowWidth / 2 - unitOf(8))) && (mouseX < (windowWidth / 2 + unitOf(8))) && (mouseY > (windowHeight / 2 - unitOf(8))) && (mouseY < (windowHeight / 2 + unitOf(8)))) {
    // if grid is clicked, then increment value of character at that position
    let currentChar = grid.sequence[grid.cursor.index]
    let currentAscii = currentChar.charCodeAt(0)
    let newAscii = currentAscii + 1;
    if (newAscii == 47) newAscii = 48 // bump up one from / to 0
    if (newAscii == 123) newAscii = 48 // wrap z to 0
    if (newAscii == 58) newAscii = 97 // jump 9 to a
    let newChar = String.fromCharCode(newAscii)
    grid.sequence[grid.cursor.index] = newChar
    //print(newChar)
    // grid.mode.mousePressed()
    grid.mode.onKey("mouseMiddle")
  }
}

const drawChar = (c, fontSize, x, y) => (textSize(fontSize), text(c, x + fontSize * 1 / 3, y + fontSize))


const renderGrid = (x = 0, y = 0) => {
  grid.renderSequence()

  push()
  translate(x, y)

  const fontSize = unitOf(0.75)

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
      fill(0, 255, 0, blinking(100, 50))
      drawChar(cursorChar, fontSize, x, y);
    }
  }, true)

  
  green.setAlpha(255)
  fill(green)
  textSize(unitOf(0.4))
  textLeading(unitOf(0.7))
  textAlign(LEFT)
  text(modeTitle(grid), unitOf(0.35), unitOf(16), unitOf(7.5), unitOf(4))
  text(modeInfo(grid), unitOf(8.35), unitOf(16), unitOf(7.5), unitOf(4))
  //drawChar(modeInfo(grid), unitOf(0.5), unitOf(8.125), unitOf(16) + fontSize / 2)
  pop()
}
