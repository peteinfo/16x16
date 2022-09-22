// testing Sounds Mode
defineMode("Test Sounds", grid => {
  let samples = [
    "./samples/interface/silence.mp3",
    "./samples/drums/basic/kick.mp3",
    "./samples/drums/basic/type.mp3",
    "./samples/drums/basic/tom.mp3",
  ]

  let lastPlayed = ''

  return {
    preload() {
      soundFormats('wav', 'm4a');
      samples = samples.map(loadSound)
    },
    init() {
    },
    onKey(e) {
      // Play a random sample from the collection
      lastPlayed = Math.round(Math.random() * (samples.length-1))
      samples[lastPlayed].play()
      grid.sequence[grid.cursor.index] = [
        'k',
        't',
        's',
        'o',
      ][lastPlayed]
    },
    update(x, y, index) {
    },
  }
})