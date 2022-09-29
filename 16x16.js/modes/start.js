// -------------------
//    Prompt Mode
// -------------------

defineMode("start", grid => {

  var sample

  return {
    description: ("press [enter] to begin"),
    isPrompt: true,

    preload() {
      sample = new Howl({
        src: ['./samples/fx/blip.mp3']
      })
    },

    init() {
    },

    unload() {
    },

    onKey(key) {
      print(key)
      if ((key.key == "Enter") || (key == "mouseMiddle")) {
        sample.rate(0.5)
        sample.play()
        useMode("short-sequence")
      } else {
        sample.rate(2)
        sample.play()
      }
    },

    update(x, y, index) {
    },

    draw() {
      green.setAlpha(100)
      fill(green)
      textSize(unitOf(3.8))
      textLeading(unitOf(1.0))
      textAlign(CENTER, CENTER)
      text('16x16', 0, 0, unitOf(16), unitOf(16))
    },
  }
})
