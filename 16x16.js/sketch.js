
// -------------------
//        16x16
// -------------------

// https://github.com/peteinfo/16x16

let mainFont 

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
  
  setupGrid(16, 16)

  useMode("Prompt Mode")
  //useMode("Reflect Mode")
  //useMode("Long Sequence")
  //useMode("Just Write")
  //useMode("Test Sounds")
  //useMode("Test Sounds2")
  //useMode("Game of Life")
  //useMode("Wondering Cursor")
  //useMode("Random Mode")
}

function draw() {

  // update unit of measurement
  // shortest width divided by 25 (leaving a border of 2 on each side around grid)
  if (windowWidth > windowHeight) {
    u = windowHeight / 25;
  } else {
    u = windowWidth / 25;
  }

  background(0)
  renderGrid(u * 0.5, u * 0.5, u * 16, u * 16)
}

function windowResized() {
  // update the canvas size when the window is resized
  resizeCanvas(windowWidth, windowHeight);
}


function keyPressed(e) {
  grid.onKey(e)
}


const renderGrid = (x = 0, y = 0, width = 400, height = 400) => {
  grid.update()

  const fontSize = u * 0.75


  // draw border around grid
  /*
  push()
  stroke(0, 192, 0)
  noFill()
  rect(x, y, width, height)
  pop()
  */

  push()
  translate(windowWidth / 2 - 8 * u, windowHeight / 2 - 8 * u)
  textSize(fontSize)
  noStroke()
  grid.forEach((char, index, x, y) => {

    // draw character at grid space
    fill(0, 192, 0)
    text(char, x * Math.round(width / grid.w), y * Math.round(height / grid.h));

    // if cursor position, draw flashing cursor block
    if (grid.cursor.index == index) {
      if((millis()%1000) > 500) {
        fill(0, 192, 0, 200)
      } else {
        fill(0, 192, 0, 100)
      }
      text(cursorChar, x * Math.round(width / grid.w), y * Math.round(height / grid.h));
    }
  }, true)
  fill(0, 192, 0)
  textSize(fontSize * 0.75)
  text(`16x16: ${getModeName(grid)}`, 0, height + fontSize / 2)
  pop()
}