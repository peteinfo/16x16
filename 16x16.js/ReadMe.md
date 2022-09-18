# 16x16

16x16 is an experimental grid based creative playground for visual and acoustic sequencing.

[OpenAI playground](https://beta.openai.com/playground) has been used to influence the design decisions and act as a creative sounding board in the desing process. It is also used to help generate prompts for each of the modes.



## mode ideas

- **Reflect**. Mirror the X and/or Y axis.
- **Snake**. Old school Nokia snake mode. The grid starts with a few scattered notes. Eat notes to play them.
- **Game of Life**.  Cellular automata based sequencer. Note plays on change of state?
- **Polymeter**. Each row is a sequence that plays at a different speed.
- **Multi playhead**. Multiple playheads go through the same sequence.
- **Looper**. One character acts as a start (and stop) point on each row, so you can dynamically set the length of each sequence.
- **Bubblewrap**. Pop the notes to play!
- **Rainfall**: Notes fall to the bottom of the screen, where they splash and play.
- **Bubblewrap**: There are 256 unpopped notes to start with. The user pops them in any order until no notes are left to play.
- **Wireworld.** A cellular automata that runs along one axis: https://wiki.xxiivv.com/site/wireworld.html
- **TimeSum**: Takes the sum total of all numbers to set tempo
- **Polymeter**: Each row runs at a different speed



## prompt ideas

- Need to add the creative prompt mode!
- Use OpenAI Playground to generate prompts based on Oblique Strategies (or at least in the style of).
- Q: Should the prompts be related to the next mode that is coming up? This might make it a lot more relevent and could potentially have some very light instructions included.



## general ideas

- Constrain Keyboard input (0-9 a-z A-Z) and decide on how to turn that to integer. [Stack Overflow](https://stackoverflow.com/questions/22624379/how-to-convert-letters-to-numbers-with-javascript)
- Shortcut to turn off grid/cursor.
- Add a longer description/instruction text for each mode.
- Lots and lots of documentation!
- Handle scene switches as page reloads using a URL param to indicate the next type of mode, possibly also a choice, etc.
- Add KB shortcut to go to next scene
- Add a toggle to prefer row of column based iteration to better support making a horizontal tracker.
- Data logging mode (which mode is popular, how long used?). Implement "Interest" tracker, dwell time
- **DONE** Flashing Cursor!



## sound ideas

- Record some scales.
- Field recordings.
- Water drops?
- Drum sounds.