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
    title: "\nLEVEL 9: RIPPLES \n--------------------------- \
    Have a break from sequencing and drop a pebble in the pond.\
    \n",
    info: "\n[any] drop a pebble \
    \n\
    \n[tab] next level \
    \n[esc] last level ",
    preload() {
      sample = loadSound('./samples/nature/bbc-river-stream-brook.mp3')
    },
    init() {
      grid.sequence.fill('.')
      sample.play()
      ripples.clear
    },
    unload() {
      sample.stop()
      ripples.clear
    },
    onKey(key) {
      print(startedPlaying)
      if (!startedPlaying) {
        sample.play()
        startedPlaying = true
      }
      if (key.key.match(/^[0-9a-z]$/)) {

        let stones = ['O', '0', 'o']
        let stone = pickRandom(stones)  

        grid.sequence[grid.cursor.index] = stone
        if (!ripples[grid.cursor.index]) {
          ripples[grid.cursor.index] = createRipple()
        }
        grid.advanceBy(1)
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
