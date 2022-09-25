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
    description: "",
    isPrompt: true,
    preload() {
      prompts = loadStrings('./prompts/prompts.txt')
      soundFormats('wav', 'm4a');
      samples = samples.map(loadSound)
    },

    init() {
      currentPrompt = random(prompts)
      grid.sequence.fill(' ')
    },

    unload() {
      grid.sequence.fill('.')
    },

    onKey(key) {
      currentPrompt = random(prompts)
      samples[0].stop()
      samples[0].play()
    },

    update(x, y, index) { },

    draw() {
      fill(255, 165, 0, 100)
      textSize(unitOf(1.2))
      textLeading(unitOf(2))
      textAlign(CENTER, CENTER)
      text(currentPrompt, 0, 0, unitOf(15), unitOf(15))
    },
  }
})
