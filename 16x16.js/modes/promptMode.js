// -------------------
//    Prompt Mode
// -------------------

defineMode("Prompt Mode", grid => {

    return {
      init() { },
      onKey(key) {
        if (key.key.match(/^[0-9]$/)) {
        }
      },
      update(x, y, index) {  
        push()
        translate(windowWidth / 2 - 8 * u, windowHeight / 2 - 8 * u - 0.21*u)
        fill(255, 165, 0, 100)    // orange playhead
        textSize(u * 1.2)
        textLeading(u*2)
        textAlign(CENTER, CENTER)
        text("don't be afraid of things because they're easy to do", 0, 0, u*15, u*15)
        pop();
      },
    }
  })
  