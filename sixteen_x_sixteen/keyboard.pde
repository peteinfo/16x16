

int rainVal = 0;
char rainKey = 'r';


void keyPressed () {

  sampleType.amp(0.1);
  sampleType.play();

  //println(keyCode);

  if (keyCode == 9) {

    modeGreen = !modeGreen;

    if (modeGreen) {
      fontColour = color(50, 255, 50);
    } else {
      fontColour = color(255, 170, 50);
    }

    sampleTom.play();

    switch(int(random(6))) {
    case 0:
      quote = "Only one element of each kind.";
      break;
    case 1:
      quote = "Are there sections? Consider transitions.";
      break;
    case 2:
      quote = "What would your closest friend do?";
      break;
    case 3:
      quote = "Try faking it!";
      break;
    case 4:
      quote = "Honour thy error as a hidden intention.";
      break;
    default:
      quote = "Work at a different speed.";
      break;
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

    if (rainVal == 0) rainKey = 'r';
    if (rainVal == 1) rainKey = 'a';
    if (rainVal == 2) rainKey = 'i';
    if (rainVal == 3) rainKey = 'n';
    rainVal++;
    if (rainVal == 4) rainVal = 0;


    grid.updateValue(rainKey);
    grid.cursorRight();
  }
}
