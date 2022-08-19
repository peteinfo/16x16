const grid = makeGrid(16, 16)

function setup() {
  createCanvas(400, 400)
  console.log(grid)
  textFont('Courier');
  initMode("Just Write")
}

function draw() {
  background(220)
  grid.update()
  grid.forEach((char, index, x, y) => {
    text(char, x * 20, y * 20);
  })
}

function keyPressed(e) {
  grid.onKey(e)
}
