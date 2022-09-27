// -------------------
//    Prompt Mode
// -------------------

defineMode("design", grid => {

  let design
  let yScroll
  let samples = [
    "./samples/design/bbc-particle-beam.mp3",
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
      yScroll = unitOf(20)
    },

    unload() {
      grid.sequence.fill('.')
      samples[0].stop()
    },

    onKey(key) {
      samples[0].play()
    },

    update(x, y, index) { },

    draw() {
      fill(100, 100, 255, 255)
      textSize(unitOf(0.75))
      textLeading(unitOf(1.0))
      textAlign(LEFT, TOP)
      text(design.join('\n'), 0, yScroll, unitOf(16), unitOf(1500))
      yScroll = yScroll - 1
    },
  }
})
