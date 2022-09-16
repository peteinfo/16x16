


class Grid {

  int w;
  int h;
  int p; // cursor position
  char[] v; // values

  int xScale = 24;
  int yScale = 24;
  int xOffset = 64;
  int yOffset = 70;


  Grid(int _w, int _h) {
    w = _w;
    h = _h;
    p = 0;
    v = new char[w*h];

    for (int n = 0; n < w*h; n++) {
      v[n] = '.';
    }
  }

  void draw() {

    fill(fontColour);

    int cursorPos = 0;

    for (int y = 0; y < h; y++) {
      for (int x = 0; x < w; x++) {

        if (p == cursorPos) {

          if (t % 2 > 0) {
            fill(fontColour, 150);
          } else {
            fill(fontColour, 50);
          }


          noStroke();
          rectMode(CENTER);
          rect(x*xScale + xOffset+6, y*yScale+yOffset-7, 16, 24);

          fill(fontColour);
        } else {
          //fill(0, 200, 0);
        }

        char c = v[cursorPos];
        textAlign(LEFT);
        textSize(20);
        text(c, x*xScale + xOffset, y*yScale+yOffset);

        cursorPos++;
      }
    }
  }



  void cursorLeft() {
    p--;
    p %= w*h;
    if (p < 0) p += w*h;
  }

  void cursorRight() {
    p++;
    p %= w*h;
    //if (p >= w*h) p = 0;
  }

  void cursorUp() {
    p -= w;
    p %= w*h;
    if (p < 0) p += w*h;
  }

  void cursorDown() {
    p += w;
    p %= w*h;
  }


  void updateValue(char _input) {

    //println(_input + " at " + p);
    if ((p >= 0) && (p < w*h)) {
      v[p] = _input;
    }
  }

  void gravity() {

    for (int n = (w*h)-1; n >= w; n--) {
      v[n] = v[n-w];
    }
    for (int n = w-1; n >= 0; n--) {
      v[n] = '.';
    }
    println("");
  }


  void playNotes() {

    int colCount = 0;

    for (int n = ((w*h)-(2*w)); n < ((w*h)-w); n++) {
      if (v[n] != '.') {
        println(colCount);
        triOsc.play(midiToFreq(midiSequence[colCount]), 0.4);
        env.play(triOsc, attackTime, sustainTime, sustainLevel, releaseTime);
        v[n] = 'O';
        println("donk");
      }
      colCount++;
    }
  }

  void scramble() {

    for (int n = (w*h)-1; n >= 0; n--) {

      if (random(1000) > 999) {
        v[n] = char(int(random(33, 126)));
      }
    }
    println("");
  }
}
