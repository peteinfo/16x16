

void clock() {

  tCurrent = millis();

  if (tCurrent > (tLast + tTimer)) {

    tLast = tCurrent;
    t++;
    onTick();
  }
}

void onTick() {

  if (!modeGreen) grid.gravity();
  if (!modeGreen) grid.scramble();
}
