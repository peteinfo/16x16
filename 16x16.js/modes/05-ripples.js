defineMode("ripples", grid => {
  let sample
  let startedPlaying = false
  const ripples = {}
  const createRipple = () => ({
    r: 5,
    speed: random(0.5, 1.5),
    thickness: random(10, 40),
    colour: [random(80, 100), random(100, 140), random(110, 200)]
  })
  return {
    level: true,
    title: 
      "RIPPLES\n-----------------\n\
      Take a break from sequencing and drop a pebble in the pond.",

    info:
      "\n[1-9] drop a pebble \
      \n[arrows] move cursor\
      \n[tab] prev level\
      \n[enter] next level",

    showPrompt: false,

    immutable: true,

    preload() {
      sample = loadSound('./samples/long-samples/stream.mp3')
    },
    
    init() {
      grid.sequence.fill('.')
      //sample.volume(0.5)
      sample.play()
      ripples.clear
      grid.moveTo(7,7)
    },
    
    unload() {
      sample.stop()
      ripples.clear
    },

    onKey(key) {
      if (grid.sequence[grid.cursor.index] !== '.') return
      if (key.key.match(/^[1-9]$/)) {

        let stones = ['O', '0', 'o']
        let stone = pickRandom(stones)

        grid.sequence[grid.cursor.index] = stone
        if (!ripples[grid.cursor.index]) {
          ripples[grid.cursor.index] = createRipple()
        }
      }
    },

    update(x, y, index) {
    },

    draw() {
      Object.entries(ripples).map(([key, ripple]) => {
        // Transform the ripple
        ripple.r = ripple.r + ripple.speed

        // House keeping
        if (ripples[key].r > 1000) {
          delete ripples[key]
        }

        // Draw the ripple
        const [x, y] = indexToPixelXY(key, CENTER)
        push()
        noFill()
        strokeWeight(ripple.thickness)
        stroke(...ripple.colour, (1 - ripple.r / 1000) * 100)
        ellipse(x, y, ripple.r)
        pop()
      })
    },
  }
})
