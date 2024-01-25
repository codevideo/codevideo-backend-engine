# Zoinkr

Create beautifully realistic automated software videos with the monaco editor!

## Installation

```bash
npm install
```

## Step Files

The automation api works via an array of actions. These actions are defined in a actions file. The actions file is a json file that contains an array of actions. Each action has a `type` and `data` property. The `type` property is the type of action to perform, and the `data` property is the data to use for the action.

```json
[
  {
    "name": "speak-before",
    "value": "Let's make a simple 'hello world' program in typescript!"
  },
  {
    "name": "type",
    "value": "// hello-world.ts"
  },
  {
    "name": "speak-before",
    "value": "That's just a comment, but let's actually make a console.log statement."
  },
  {
    "name": "key-down",
    "value": "1"
  },
  {
    "name": "type",
    "value": "console.log('hello world');"
  }
]
```

Alternatively, you can define the actions directly in TypeScript. This is useful if you want to use the editor's intellisense to help you write the actions.

```ts
export const sumActions: Array<IAction> = [
  {
    name: 'speak-before',
    value: 'Let\'s make a simple sum function in typescript!'
  },
  {
    name: 'type',
    value: '// sum.ts'
  },
  {
    name: 'speak-before',
    value: 'That\'s just a comment, but let\'s actually make a sum function.'
  },
  {
    name: 'key-down',
    value: '1'
  },
  {
    name: 'type',
    value: 'function sum(a: number, b: number): number {'
  },
  {
    name: 'key-down',
    value: '1'
  },
  {
    name: 'type',
    value: 'return a + b;'
  },
  {
    name: 'key-down',
    value: '1'
  },
  {
    name: 'type',
    value: '}'
  },
  {
    name: 'key-down',
    value: '1'
  },
  {
    name: 'type',
    value: 'console.log(sum(1, 2));'
  }
]
```

## Actions

### Single File Environment

In a single file environment, there are a variety of actions.

### GitHub Codespaces Environment

Currently the following actions are supported:

- `new-file` - creates a new file
- `type-editor` - types text into the editor
- `click-editor` - clicks on the editor

Miscellaneous actions:
- `highlight` - highlights text in the file
- `comment` - comments out text in the file

## Run examples

Writing a simple hello world console.log statement:

```bash
npm run start ./examples/hello-world.json
```

Writing a sum TypeScript function:

```bash
npm run start ./examples/sum.json
```

With all the examples, you should end up with an mp4 file in the `./video` directory, and an audio file in the `./audio` directory.

## Other Commands

### `clean`

This command cleans out the `./dist`, `./audio`, and `./video` directories. Be careful! If there was a lot of data, you'll have to regenerate everything again for each video made. This could get expensive if you are doing a lot of text to speech.

```bash
npm run clean
```

### `make-video`
Just an alias for `start`;

```bash
npm run make-video
```

### `scripts-health-check`

It sometimes happens that the text to speech model produces artifacts in the audio. This command will run a health check on all audio files produced by a step file by transcripting them and comparing their transcript to the original transcript using Levenshtein distance. If the transcripts are different, it will print out the file name and the transcript, and attempt to create a new audio file.

```bash
npm run scripts-health-check ./examples/hello-world.json
```


### `scripts-character-count`

As is always the case with character or word based cost models, the amount of text that will be converted is always a question. This script prints out the character, word, and page count of all scripts in a given step file.

```bash
npm run scripts-character-count ./examples/hello-world.json
```
