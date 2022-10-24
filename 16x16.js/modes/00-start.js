// -------------------
//    Prompt Mode
// -------------------

defineMode("start", grid => {

  let sample
  let quotes
  let quotePointer
  let quoteStage
  let questionAnswer
  let interval = 1500
  let timer // for being able to cancel the setTimeout call on exit

  function tick() {
    // this function is triggered every interval
    quoteStage++
    quoteStage %= 3

    switch (quoteStage) {
      case 0:
        questionAnswer = ""
        interval = 1500
        break;
      case 1:
        questionAnswer = ("Us: \"" + quotes[quotePointer] + "\"")
        interval = 3000
        break;
      case 2:
        questionAnswer = ("Us: \"" + quotes[quotePointer] + "\"\n\n" + "OpenAI: \"" + quotes[quotePointer + 1] + "\"")
        quotePointer += 3
        if ((quotePointer + 1) > quotes.length) quotePointer = 0
        interval = 6000
        break;
      default:
    }
    timer = setTimeout(tick, interval)
  }

  return {

    title:
      "\n16x16 \
      ------------------------- \
      A minimal audio-visual environment for exploring computer-aided creativity through esoteric music sequencing.\
      \n\nExplore composing music in each mode using the key commands on the right. Note that these commands may change between modes.\
      \n\nPress ENTER to begin.",

    info:
      "\n[arrow] move cursor \
      [enter] next level",

    showPrompt: false,

    preload() {
    },

    init() {
      sample = new Howl({
        src: ['./samples/fx/blip.mp3']
      })
      quotes = loadStrings('./prompts/design-conversation.txt')
      quotePointer = 3 * floor(random(quotes.length / 3))
      //print("Quote file length = " + quotes.length + "   starting with " + quotePointer)
      quoteStage = 0
      timer = setTimeout(tick, 3000)
      grid.sequence.fill('.')
      grid.moveTo(0, 0)
    },

    unload() {
      clearTimeout(timer)
    },

    onKey(key) {
      //print(key)
      if ((key.key == "Tab")) {
        //sample.rate(0.5)
        //sample.play()
        //useMode("first-steps")
      } else if (key.key == "f") {
        fullscreen(1) // fullscreen only works on user input, so putting it here as a hack
      } else {
        //sample.rate(3)
        //sample.volume(0.1)
        //sample.play()
      }
    },

    update(x, y, index) {
    },

    draw() {

      // 16x16 title
      /*
      green.setAlpha(150)
      fill(green)
      textSize(unitOf(4))
      textLeading(unitOf(1.0))
      textAlign(CENTER, TOP)
      text('16x16', 0, unitOf(7), unitOf(16), unitOf(8))
      */

      // question & answer

      /*
      orange.setAlpha(200)
      fill(orange)
      textSize(unitOf(0.5))
      textLeading(unitOf(1.0))
      textAlign(LEFT, TOP)
      text(questionAnswer, unitOf(1.5), unitOf(3), unitOf(13.5), unitOf(12))
      */
    },
  }
})
