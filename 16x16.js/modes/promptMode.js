// -------------------
//    Prompt Mode
// -------------------

defineMode("Prompt Mode", grid => {

  let prompts
  let currentPrompt = ''
  let samples = [
    "./samples/prompts/windchime.mp3",
  ]

  return {

    preload() {

      prompts = loadStrings('./prompts/prompts.txt')

    },

    init() {
      currentPrompt = random(prompts)

      soundFormats('wav', 'm4a');
      samples = samples.map(loadSound)
    },

    onKey(key) {
      if (key.key.match(/^[0-9]$/)) {
      }
      currentPrompt = random(prompts)
      samples[0].stop()
      samples[0].play()
    },

    update(x, y, index) {},

    draw() {
      background(0)
      // push()
      // translate(windowWidth / 2 - unitOf(8), windowHeight / 2 - unitOf(8))
      fill(255, 165, 0, 100)    // orange playhead
      textSize(unitOf(1.2))
      textLeading(unitOf(2))
      textAlign(CENTER, CENTER)
      text(currentPrompt, 0, 0, unitOf(15), unitOf(15))
      // pop();
    },
  }
})
