// -------------------
//    Prompt Mode
// -------------------

defineMode("prompt", grid => {

  let prompts
  let currentPrompt = ''
  let samples = [
    "./samples/prompts/windchime.mp3",
  ]
  let backgroundFill = ['_', '*', '|', '+', '=', ':']

  return {
    title: "\noblique grid strategies:\n-------------------------\n[tab] to proceed\n [esc] return to start",
    info: "\ntake some time to consider this strategy before proceeding with the next level",
    isPrompt: true,
    preload() {
      prompts = loadStrings('./prompts/prompts.txt')
      //soundFormats('wav', 'm4a');
    },

    init() {
      currentPrompt = random(prompts)
      grid.sequence.fill(backgroundFill[int(random(backgroundFill.length))])
      //samples[0].play()
    },

    unload() {
      grid.sequence.fill('.')
    },

    onKey(key) {
      if ((key.key == "Tab") || (key == "mouseMiddle")) {
        useMode("prompt")
      }
      //currentPrompt = random(prompts)
      //samples[0].stop()
      //samples[0].play()
    },

    update(x, y, index) { },

    draw() {
      fill(255, 165, 0, 255)
      textSize(unitOf(1.5))
      textLeading(unitOf(1.7))
      textAlign(CENTER, CENTER)
      text(currentPrompt, 0, 0, unitOf(16), unitOf(16))
    },
  }
})
