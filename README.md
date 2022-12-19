# `<de-tune>`

Create an instrument tuner on any website.

## Installation

Via npm: `npm i @troyv/detune`.

## Usage

Use the `[notes]` attribute to pass a series of notes and their octaves. Each note will render a button that can be pressed to play your note. A separate button is rendered that can play all notes in sequence. Use `[duration]` to set the number of quarter notes each note will ring out for.

```html
<de-tune notes="E2 A2 D3 G3 B3 E4" duration="4"></de-tune>
```

## Styling

This component forgoes the shadow DOM, so styling is **entirely** up to you. Have fun.
