// testing Sounds Mode
defineMode("Test Sounds", grid => {
  let samples = [
    "./samples/kick.wav",
    "./samples/type.wav",
    "./samples/sample1.wav",
    "./samples/tom.wav",
  ]

  let lastPayed = ''

  return {
    preload() {
      soundFormats('wav', 'mp3', 'ogg');
      samples = samples.map(loadSound)
    },
    init() {
    },
    onKey(e) {
      // Play a random sample from the collection
      lastPayed = Math.round(Math.random() * (samples.length-1))
      samples[lastPayed].play()
      grid.sequence[grid.cursor.index] = [
        'k',
        't',
        's',
        'o',
      ][lastPayed]
    },
    update(x, y, index) {
    },
  }
})