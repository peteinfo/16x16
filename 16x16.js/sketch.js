function preload() {
  preloadModes()
}

function setup() {
  textFont('Courier')
  createCanvas(500, 500)
  setupGrid(16, 16)
  //useMode("Just Write")
  useMode("Reflect Mode")
  //useMode("Test Sounds")
  //useMode("Game of Life")
  //useMode("Wondering Cursor")
  //useMode("Random Mode")
  // frameRate(1)
}

function draw() {
  background(0)
  renderGrid(50, 30, 400, 400)
}

function keyPressed(e) {
  grid.onKey(e)
}


const renderGrid = (x = 0, y = 0, width = 400, height = 400) => {
  grid.update()
  const fontSize = 20
  // push()
  // stroke(0, 192, 0)
  // noFill()
  // rect(x, y, width, height)
  // pop()

  push()
  translate(x, y + fontSize)
  textSize(fontSize)
  fill(0, 192, 0)
  noStroke()
  grid.forEach((char, index, x, y) => {
    text(char, x * Math.round(width / grid.w), y * Math.round(height / grid.h));
  }, true)
  text(`Mode: ${getModeName(grid)}`, 0, height + fontSize/2)
  pop()
}