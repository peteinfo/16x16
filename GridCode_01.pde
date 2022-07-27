
// grid code
// based on Orca

PFont monoFont;

color fontColour;

boolean modeGreen = true;

Grid grid;


int t = 0;
int tTimer = 500;
int tCurrent = 0;
int tLast = 0;

void setup() {
  
  //fullScreen();
  size(400, 400);

  grid = new Grid(12, 12);

  fontColour = color(0, 255, 0);

  monoFont = loadFont("AndaleMono-20.vlw");
  textFont(monoFont);
  //textSize(20);
  
}

void draw() {
 
  clock();
  
  background(0);
    
  grid.draw();
  //grid.scramble();
  
}
