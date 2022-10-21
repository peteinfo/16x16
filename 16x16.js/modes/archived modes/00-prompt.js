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
    title: "\nOBLIQUE GRID STRATEGIES\n-----------------------\nconsider this creativity prompt for the next level",
    info: "\n[tab] to proceed\n [esc] return to start",
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
      if ((key.key == "Tab")) {
        currentLevel++
        if (currentLevel >= levels.length) {
          currentLevel = 0
          //useMode("start")
        } else {
          useMode(levels[currentLevel])
        }
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
