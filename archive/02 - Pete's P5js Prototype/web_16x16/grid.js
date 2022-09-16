

// ----------------
//    GRID CLASS
// ----------------

class Grid {

  constructor(_w, _h) {

    this.w = _w;          // width of grid
    this.h = _h;          // height of grid
    this.cursorPos = 30;   // cursor position in grid

    // array to hold data in grid
    this.data = new Array(this.w * this.h);

    this.xScale = 24;     // horizontal grid spacing
    this.yScale = 24;     // vertical grid spacing
    this.xOffset = 64;    // horizontal offset
    this.yOffset = 70;    // vertical offset

    for (var n = 0; n < this.data.length; n++) {
      this.data[n] = ".";
    }
  }

  draw() {

    // using cursorCounter as a lazy way to check if cell is on cursorPos
    var cursorCounter = 0;

    // loop around the grid
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {

        if (cursorCounter == this.cursorPos) {
          if (t % 2 > 0) {
            //fill(fontColour, 150);
            fill(0, 255, 0, 100);
          } else {
            //fill(fontColour, 50);
            fill(0, 255, 0, 200);
          }
          noStroke();
          rectMode(CENTER);
          rect(x * this.xScale + this.xOffset + 6, y * this.yScale + this.yOffset - 7, 16, 24);
          fill(fontColour);
        } else {
          // fill(0, 200, 0);
        }
        var c = this.data[cursorCounter];
        text(c, x * this.xScale + this.xOffset, y * this.yScale + this.yOffset);
        
        cursorCounter++;
      }
    }
  }

  cursorLeft() {
    this.cursorPos--;
    this.cursorPos %= this.w * this.h;
    if (this.cursorPos < 0) this.cursorPos += this.w * this.h;
  }
  
    cursorRight() {
    this.cursorPos++;
    this.cursorPos %= this.w * this.h;
    if (this.cursorPos >= this.w*this.h) this.cursorPos = 0;
  }

  cursorUp() {
    this.cursorPos -= this.w;
    this.cursorPos %= this.w * this.h;
    if (this.cursorPos < 0) this.cursorPos += this.w * this.h;
  }

  cursorDown() {
    this.cursorPos += this.w;
    this.cursorPos %= this.w * this.h;
  }

  
}
