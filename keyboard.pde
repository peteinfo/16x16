
void keyPressed () {

  //println(keyCode);

  if (keyCode == 9) {

    modeGreen = !modeGreen;

    if (modeGreen) {
      fontColour = color(50, 255, 50);
    } else {
      fontColour = color(255, 170, 50);
    }
  }

  if (keyCode == 39) {
    grid.cursorRight();
  }

  if (keyCode == 37) {
    grid.cursorLeft();
  }

  if (keyCode == 38) {
    grid.cursorUp();
  }

  if ((keyCode == 40) || (keyCode == 10)) {
    grid.cursorDown();
  }

  if (keyCode == 8) {
    grid.updateValue('.');
    grid.cursorLeft();
  }

  if (keyCode == 32) {
    grid.updateValue('.');
    grid.cursorRight();
  }

  if ((key >= 33) && (key <= 126)) {
    grid.updateValue(key);
    grid.cursorRight();
  }
}
