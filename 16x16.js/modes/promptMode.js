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
    description: "press any key to begin",
    isPrompt: true,
    preload() {
      prompts = loadStrings('./prompts/prompts.txt')
      soundFormats('wav', 'm4a');
      samples = samples.map(loadSound)
    },

    init() {
      currentPrompt = random(prompts)
      grid.sequence.fill(' ')
      samples[0].play()
    },

    unload() {
      grid.sequence.fill('.')
      samples[0].stop()
    },

    onKey(key) {
      //currentPrompt = random(prompts)
      //samples[0].stop()
      //samples[0].play()
    },

    update(x, y, index) { },

    draw() {
      fill(255, 165, 0, 255)
      textSize(unitOf(1.2))
      textLeading(unitOf(2))
      textAlign(CENTER, CENTER)
      text(currentPrompt, 0, 0, unitOf(15), unitOf(15))
    },
  }
})
