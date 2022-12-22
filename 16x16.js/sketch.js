// -------------------
//        16x16
// -------------------

// https://github.com/peteinfo/16x16

// Sound Library is Howler:
// https://github.com/goldfire/howler.js

let mainFont
let green
let orange
let orangeAlpha = 150
let prompts
let currentPrompt = ''

// -------------------------------------
//      Sequence Level Order Here
// -------------------------------------
let levels = [
  "start",
  "first-steps",
  "full-grid",
  "row-jump",
  "spell",
  "ripples",        // VISUALS
  "parallels",
  "rain",
  "arc-aid",        // VISUALS
  "sculpture",
  "stream",
  "seven-segment",  // VISUALS
  "eight-track",
  "jump-back",
  "wave-pool",      // VISUALS
  "wandering-cursor",
  "off-the-grid",
  "credits"
]

var currentLevel = 0

const { active, start, idle, whatState } = modeSwitcher({
  startupTime: 1000,
  idleTime: 180000, // 3 minutes until system gets bored and moves right back to start page
  transitionTime: 1000,
})

function preload() {
  preloadModes()
  mainFont = loadFont('./fonts/Andale_Mono/Andale_Mono.ttf')
  prompts = loadStrings('./prompts/prompts.txt')
}

function setup() {
  textFont(mainFont)
  green = color(0, 192, 0)
  orange = color(255, 165, 0)
  createCanvas(windowWidth, windowHeight)

  currentPrompt = random(prompts)

  useMode(levels[0])

  // To debug a a mode do not call start() and just useMode instead and make adjustments to the background in draw()
  start()
}

// returns value alternating based on time
const blinking = (on, off) => (millis() % 1000) > 500 ? on : off

// shortest width divided by 25 (leaving a border of 2 on each side around grid)
const unitOfOne = () => Math.min(windowWidth, windowHeight) / 24
//const unitOfOne = () => Math.min(windowWidth / 40, windowHeight / 25)
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
    //print('MODE CHANGE')
    //idle()
    //return
  }
  // indicate that user is still active
  active()
  // pass key press to grid
  grid.onKey(e)
  return false // IMPORTANT NOTE: return FALSE to prevent the key press from getting to the browser
}

/*
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
*/

const drawChar = (c, fontSize, x, y) => (textSize(fontSize), text(c, x + fontSize * 1 / 3, y + fontSize))

const renderGrid = (x = 0, y = 0) => {


  grid.renderSequence()
  push()
  translate(x, y)

  // ----- draw the grid -----

  if (grid.mode.hideGrid == true) {
  } else {
    const fontSize = unitOf(0.75)
    noStroke()
    grid.forEach((char, index) => {
      const [x, y] = indexToPixelXY(index)
      // draw character at grid space
      if (grid.mode.paleGrid) {
        fill(0, 100, 0)
      } else {
        fill(0, 192, 0)
      }
      drawChar(char, fontSize, x, y)
      // if cursor position, draw flashing cursor block
      if (isCursorAt(grid, index)) {
        fill(0, 255, 0, blinking(150, 100))
        drawChar(cursorChar, fontSize, x, y);
      }
    }, true)
  }
  // Let the mode draw itself
  push()
  grid.drawMode()
  pop()

  green.setAlpha(255)
  fill(green)
  textSize(unitOf(0.4))
  textLeading(unitOf(0.7))
  textAlign(LEFT)

  text(modeTitle(grid), unitOf(-8), unitOf(0), unitOf(8), unitOf(16))
  text(modeInfo(grid), unitOf(17), unitOf(0), unitOf(8.5), unitOf(16))

  // PROMPT - LEFT BLOCK

  //if ((grid.mode.name != "start") && (grid.mode.name != "credits")) {

  if (grid.mode.showPrompt == true) {

    fill(orange)
    textSize(unitOf(0.4))
    textLeading(unitOf(0.9))
    textAlign(LEFT)
    text("OBLIQUE (AI) STRATEGY:\n--------------------", unitOf(-8), unitOf(9.8), unitOf(8), unitOf(6));
    //textSize(unitOf(0.5))
    textSize(unitOf(0.6))
    textLeading(unitOf(0.9))
    textAlign(LEFT)
    text("\"" + currentPrompt + "\"", unitOf(-8), unitOf(11), unitOf(8), unitOf(6));

    // PROMPT - BOTTOM ROW
    // fill(orange)
    // textSize(unitOf(1))
    // textLeading(unitOf(1.0))
    // textAlign(CENTER)
    // text("\"imagine the music as a set of disconnected events\"", unitOf(-8), unitOf(17), unitOf(32), unitOf(2));
  }

  pop()
}
