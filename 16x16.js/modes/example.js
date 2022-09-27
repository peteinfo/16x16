// A mode that does nothing
defineMode("example", grid => {
  return {
    // the description is displayed underneath the grid
    description: "a blank example mode",
    // Preload can be used to load any resources
    preload() { },
    // init is called when starting the mode
    init() { },
    // willUnload is called before the mode is switched. e.g. prepare mode to unload
    willUnload() { },
    // unload is called when the mode actually unloads
    unload() { },
    // when a key pressed
    onKey(key) { },
    // update is called per character in the sequence, usually before draw
    update(x, y, index) { },
    // draw is called from the main sketch when the grid draws
    draw(frameCounter) { },
  }
})
