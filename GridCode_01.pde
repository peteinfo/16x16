


import processing.sound.*;

PFont monoFont;

color fontColour;

boolean modeGreen = true;

Grid grid;

SoundFile sampleTom;
SoundFile sampleType;
SoundFile sample1;
SoundFile sampleKick;
SoundFile windchime;

Delay delay;
TriOsc triOsc;
Env env;

// Times and levels for the ASR envelope
float attackTime = 0.1;
float sustainTime = 0.4;
float sustainLevel = 0.1;
float releaseTime = 0.8;

// This is an octave in MIDI notes.
int[] midiSequence = { 50, 53, 55, 57, 60, 62, 65, 67, 69, 72, 70, 72, 74, 77, 79, 81, 83 };




String quote = "quote";


int t = 0;
int tTimer = 500;
int tCurrent = 0;
int tLast = 0;

void setup() {

  //fullScreen();
  size(500, 500);

  grid = new Grid(16, 16);

  fontColour = color(0, 255, 0);

  monoFont = loadFont("AndaleMono-30.vlw");
  textFont(monoFont);
  textSize(20);

  sampleTom = new SoundFile(this, "samples/tom.wav");
  sampleType = new SoundFile(this, "samples/type.wav");
  sampleKick = new SoundFile(this, "samples/kick.wav");
  sample1 = new SoundFile(this, "samples/sample1.wav");
  windchime = new SoundFile(this, "samples/windchime.wav");

  // Create the effect object
  delay = new Delay(this);

  // Create triangle wave and start it
  triOsc = new TriOsc(this);

  // Create the envelope
  env = new Env(this);

  // Set soundfile as input to the reverb
  delay.process(triOsc, 5.0);
  delay.feedback(0.3);
  delay.time(0.8);
}

void draw() {

  clock();

  background(0);

  if (modeGreen) {
    grid.draw();
    //grid.scramble();


    fill(fontColour, 100);
    textAlign(LEFT);
    text("rainfall", 55, height-25);
    textAlign(RIGHT);
    text("v0.1", width-70, height-25);
  } else {

    fill(255, 170, 50, 255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(quote, width/2, height/2, 400, 400);
  }
}

// This helper function calculates the respective frequency of a MIDI note
float midiToFreq(int note) {
  return (pow(2, ((note-69)/12.0))) * 440;
}
