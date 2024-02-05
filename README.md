# CodeVideo AI

Create shockingly realistic automated software videos!

WIP - this documentation is partially incorrect and incomplete.

## Examples

Implementation of a Fibonacci function in TypeScript in a Monaco editor at `localhost`, driven by puppeteer:

- [TypeScript Fibonacci implementation](./video-examples/fibonacci.mp4)

Using the actual Visual Studio Code application, demonstrating how to use JavaScript's console.log function in Node.js, including opening the file and starting the script from the terminal. Driven by [`robotjs`](https://github.com/octalmage/robotjs) (cloned by CodeVideo and soon to be improved at [`robotts`](https://github.com/codevideo/robotts)):

- [JavaScript console.log in Node.js](./video-examples/console-log.mov)

## Voices

### Free

You can use say.js for free, but this will be a very robotic sounding voice.

### Paid

Currently, we support adding any eleven labs voice, including a custom one. (For inspiration on what to record to train a voice, we recommend recording yourself reading blog posts or other text that you find interesting - we had great results with just 45 minutes of recorded audio, when the 'optimum' amount is supposed to be 3 hours or more.)

## Installation

```bash
npm install
```

## Automation API

The automation API works via an array of actions, each represented by an object with a `name` and `value` property. These actions can be defined in a actions file. The actions file is a json file that contains an array of actions. Each action has a `type` and `data` property. The `type` property is the type of action to perform, and the `data` property is the data to use for the action.

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


### `code-health-check`

This command runs a health check of code after each `type` event, checking for any strange formatting or syntax errors. If it finds any, it will print out the file name and the error.

```bash
npm run code-health-check ./examples/hello-world.json
```

## Desktop Automation

Due to the state of `robotjs`, a few caveats are required to properly run desktop automation actions:

- Need exactly one 1920x1080 monitor
- Bug fix for key press (see implementation)