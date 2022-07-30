
boolean windchimePlaying = false;


void clock() {

  tCurrent = millis();

  if (tCurrent > (tLast + tTimer)) {

    tLast = tCurrent;
    t++;
    onTick();
  }
}

void onTick() {


  if (!modeGreen) {
    if (windchimePlaying == false) {
      windchime.play();
      windchimePlaying = true;
    }
  } else {
    windchime.stop();
    windchimePlaying = false;
    sampleKick.play();
    grid.playNotes();
    grid.gravity();
  }
}
