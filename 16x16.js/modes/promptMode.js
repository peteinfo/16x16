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

    update(x, y, index) {
      background(0)
      push()
      translate(windowWidth / 2 - 8 * u, windowHeight / 2 - 8 * u)
      fill(255, 165, 0, 100)    // orange playhead
      textSize(u * 1.2)
      textLeading(u * 2)
      textAlign(CENTER, CENTER)
      text(currentPrompt, 0, 0, u * 15, u * 15)
      pop();
    },
  }
})
