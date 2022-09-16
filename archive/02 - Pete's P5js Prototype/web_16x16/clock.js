
// ----------------
//      clock
// ----------------

// this tab holds all of the clock and time functions


function clock() {
  
  tCurrent = millis();

  if (tCurrent > tLast + tInterval) {
    tLast = tCurrent;
    t++;
    //    //onTick();
  }
}
