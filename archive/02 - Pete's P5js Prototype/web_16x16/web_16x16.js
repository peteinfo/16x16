
// ----------------
//      16x16
// ----------------

var grid;

// time variables
var t = 0;
var tCurrent = 0;
var tLast = 0;
var tInterval = 500;       // the time in ms between 'ticks' 

var fontColour;

function setup() {

  createCanvas(800, 800);
  
  grid = new Grid(16, 16);
  
  fontColour = color(0, 255, 0);
  
}


function draw() {

  // first update clock
  clock();
  
  background(0);
  
  grid.draw();

  // is the sketch running?
  //print(t);
  
  //grid.cursorUp();
  
}
