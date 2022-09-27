// -------------------
//    Prompt Mode
// -------------------

defineMode("design", grid => {

  let design
  let yScroll = 0
  let samples = [
    "./samples/prompts/windchime.mp3",
  ]

  return {
    description: ("press any key to begin"),
    isPrompt: true,
    preload() {
      design = loadStrings('./prompts/design-conversation.txt')
      samples = samples.map(loadSound)
    },

    init() {
      samples[0].play()
      grid.sequence.fill('')
      print(design[1])

    },

    unload() {
      grid.sequence.fill('.')
      samples[0].stop()
    },

    onKey(key) {
    },

    update(x, y, index) { },

    draw() {
      fill(100, 100, 255, 255)
      textSize(unitOf(0.5))
      textLeading(unitOf(0.75))
      textAlign(LEFT, TOP)
      text(design.join('\n\n'), 0, yScroll, unitOf(15), unitOf(1500))
      yScroll = yScroll - 1
    },
  }
})
