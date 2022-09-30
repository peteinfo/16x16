// -------------------
//    Prompt Mode
// -------------------

defineMode("start", grid => {

  var sample

  return {
    title: (" "),
    info: ("\n[arrow] move cursor\n[tab] to begin"),
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
      if ((key.key == "Tab") || (key == "mouseMiddle")) {
        sample.rate(0.5)
        sample.play()
        useMode("short-sequence")
      } else {
        //fullscreen(1) // fullscreen only works on user input, so putting it here as a hack
        sample.rate(3)
        sample.volume(0.1)
        sample.play()
      }
    },

    update(x, y, index) {
    },

    draw() {
      green.setAlpha(100)
      fill(green)
      textSize(unitOf(5))
      textLeading(unitOf(1.0))
      textAlign(CENTER, CENTER)
      text('16x16', 0, 0, unitOf(16), unitOf(6))
    },
  }
})
