# CodeVideo Backend Engine

![NPM Version](https://img.shields.io/npm/v/@fullstackcraftllc/codevideo-backend-engine)
![Code Quality](https://img.shields.io/badge/Code_Quality-Spaghetti-blue)
![Code Coverage](https://img.shields.io/badge/Code_Coverage-Minimal-blue)
![Tests](https://img.shields.io/badge/Tests-Dubious-blue)
![Moral](https://img.shields.io/badge/Moral-High-blue)
![Tool Abilities](https://img.shields.io/badge/Tool_Abilities-Insane-blue)

Create shockingly realistic automated software videos!

_Any sufficiently advanced technology is indistinguishable from magic._ 😉

## Quick Start - Programmatic Usage

Install this package:

```bash
npm install @fullstackcraftllc/codevideo-backend-engine
```

Use it in your project!

```typescript
import fs from 'fs'
import { generateVideoFromActions } from '@fullstackcraftllc/codevideo-backend-engine'
import { IGenerateVideoFromActionsOptions } from "./interfaces/IGenerateVideoFromActionsOptions.js";

const videoOptions: IGenerateVideoFromActionsOptions = {
  actions: [
    {
      name: "author-speak-before",
      value: "I'm gonna type some code!"
    },
    {
      name: "editor-type",
      value: "console.log('Hello, world!');"
    },
  ],
  language: "en-US",
  textToSpeechOption: "coqui-ia" // free & decent quality voice, but requires coqui-ai to be installed: 'pip install TTS'
}


// 'videoBuffer' is a Buffer representing the mp4 video created
// 'pathToFile' is the path to the video file
// 'guid' is a unique identifier for the video
const { videoBuffer, pathToFile, guid } = generateVideoFromActions(videoOptions)

// for example, save the videoBuffer to some other file
fs.writeFileSync('hello-world.mp4', video)

// do something with the created file directly
fs.renameSync(pathToFile, 'hello-world.mp4')

// use the guid for some other process - job list, etc.
console.log(guid)
```

## Quick Start - Development or Local CLI Usage

Clone this repository:

```bash
git clone https://github.com/codevideo/codevideo-backend-engine.git
```

Move into the repo:

```bash
cd codevideo-backend-engine
```

Install dependencies:

```bash
npm install
```

Run the simple hello world example (creates a video on how to use the console.log function in JavaScript):

```bash
npm run start ./examples/hello-world.json
```

Let it run & have faith! A headless chrome browser is running in the background, creating your video. As long as you don't see errors on your console it will eventually finish and the video will be pop out in the `./video` directory.

There will be a variety of files created:

- `./audio/*.mp3` - the various speaking action audio files (generated before the video is made)
- `./audio/hello-world/combined.mp3` - the properly spaced speaking action audios combined and used to interleave into the editor video
- `./video/hello-world.mp4` - the final video with typing animation and audio

That's it! Create any automation you want by creating a new actions (either `.json` or `.ts`) and passing it to the `start` command. See the [defining actions section](#defining-actions) below for more information.

## Other Examples

Looks like GitHub isn't very friendly for video embeds, you can see a few examples and a Web MVP [on our website at codevideo.ai](https://codevideo.io/ai).

Implementation of a Fibonacci function in TypeScript in a Monaco editor in a browser at `localhost`, driven by puppeteer:

- [TypeScript Fibonacci implementation](./video-examples/fibonacci.mp4)

Using the actual Visual Studio Code application, demonstrating how to use JavaScript's console.log function in Node.js, including opening the file and starting the script from the terminal. Driven by [`nut-js`](https://github.com/nut-tree/nut.js)

- [JavaScript console.log in Node.js](./video-examples/console-log.mov)

## Other Text To Speech Engines

### Free

*Windows and Mac*

`sayjs` is available for both Windows and Mac, but this will be a very robotic sounding voice.

`coqui` is also available, but requires the coqui-ai TTS package to be installed, check it out here: https://github.com/coqui-ai/TTS (should be as simple as `pip install TTS`)

*Linux*

Festival

`festival` is available for Linux users. Keep in mind with this option you must have `festival` and `lame` installed on your system, i.e.

```bash
sudo apt-get install festival lame
```

### Paid

Currently, we support the following AI voices:

- Eleven Labs (including custom cloned voices*)
- OpenAI TTS (text-to-speech) 

*For inspiration on what to record to train a voice for Eleven Labs, we recommend recording yourself reading blog posts or other text that you find interesting - we had great results with just 45 minutes of recorded audio, when the 'optimum' amount recommended by Eleven Labs is supposed to be 3 hours or more.

To use Eleven Labs or OpenAI as the voice, you will need to set the `ELEVEN_LABS_API_KEY` + `ELEVEN_LABS_VOICE_ID` or `OPENAI_API_KEY` environment variables respectively.

Then pass as a second argument specifying if you want to use `elevenlabs` or `openai` respectively:

```bash
npm run start ./examples/hello-world.json elevenlabs
```

```bash
npm run start ./examples/hello-world.json openai
```

`sayjs` is also acceptable as an engine:

```bash
npm run start ./examples/hello-world.json sayjs
```

this is anyway the default and it doesn't need to be explicitly included.

## Advanced options

In the single editor version, you can start with an initial code and language parameter:

```bash
npm run start ./examples/hello-world.json elevenlabs monaco-single-editor "// here's a comment at the top of the file" javascript

## Defining Actions

The API works via an array of actions (type `IAction`), each represented by an object with a `name` and `value` property. These actions can be defined in a actions file. The actions file can be either a json file or a TypeScript file that contains an array of actions.

Here is an example of an action file, the very same one used to drive the hello-world example above:

```json
[
  {
    "name": "author-speak-before",
    "value": "To represent that this file is 'index.js', I'll just put a comment here"
  },
  {
    "name": "editor-type",
    "value": "// index.js"
  },
  {
    "name": "author-speak-before",
    "value": "Then, we'll add a simple console.log statement to the file."
  },
  {
    "name": "enter",
    "value": "1"
  },
  {
    "name": "editor-type",
    "value": "console.log('Hello, world!');"
  },
  {
    "name": "author-speak-before",
    "value": "For example, if I wanted to write the value of some variable, I could do that with console.log."
  },
  {
    "name": "backspace",
    "value": "29"
  },
  {
    "name": "editor-type",
    "value": "const myVariable = 'Important variable I want to keep track of';"
  },
  {
    "name": "enter",
    "value": "1"
  },
  {
    "name": "editor-type",
    "value": "console.log(myVariable);"
  },
  {
    "name": "author-speak-before",
    "value": "And that's it! We now know how to use the console.log function in JavaScript."
  }
]
```

Alternatively, you can define the actions directly in TypeScript. This is useful if you want to use the editor's Copilot / ChatGPT / intellisense to help you write the actions. The only important thing to note is that you must use `export default` syntax to export the actions. The equivalent TypeScript version of the above actions file would look like this:

```ts
const helloWorldActions: Array<IAction> = [
  {
    name: "author-speak-before",
    value: "To represent that this file is 'index.js', I'll just put a comment here"
  },
  {
    name: "editor-type",
    value: "// index.js"
  },
  {
    name: "author-speak-before",
    value: "Then, we'll add a simple console.log statement to the file."
  },
  {
    name: "enter",
    value: "1"
  },
  {
    name: "editor-type",
    value: "console.log('Hello, world!');"
  },
  {
    name: "author-speak-before",
    value: "For example, if I wanted to write the value of some variable, I could do that with console.log."
  },
  {
    name: "backspace",
    value: "29"
  },
  {
    name: "editor-type",
    value: "const myVariable = 'Important variable I want to keep track of';"
  },
  {
    name: "enter",
    value: "1"
  },
  {
    name: "editor-type",
    value: "console.log(myVariable);"
  },
  {
    name: "author-speak-before",
    value: "And that's it! We now know how to use the console.log function in JavaScript."
  }
]

// IMPORTANT!!! You must use the export default syntax here!!!
export default helloWorldActions
```

To see a list of all available actions, see the [action names as string directly in the codevideo-types repo](https://github.com/codevideo/codevideo-types/blob/main/src/constants/AllActionStrings.ts).

## Other Commands

### `clean`

```bash
npm run clean
```

This command cleans out the `./dist`, `./audio`, and `./video` directories. 

***Be careful! After running this, you'll have to regenerate everything again for each video made. This could get expensive if you are doing a lot of text to speech using a paid plan.

### `make-video`

```bash
npm run make-video ./examples/hello-world.json
```

Just an alias for `start`.

### `scripts-health-check`

It sometimes happens that the text to speech model produces artifacts in the audio. This command will run a health check on all audio files produced by an actions file by transcripting them and comparing their transcript to the original transcript using Levenshtein distance. If the transcripts are different, it will print out the file name and the transcript, and attempt to create a new audio file. This is most useful when using an AI generated voice, as the `say.js` library is a deterministic library and will always produce the same audio file for the same transcript.

Ex. check the accuracy of your Eleven Labs audio files:

```bash
npm run scripts-health-check ./examples/hello-world.json elevenlabs
```

Ex. check the accuracy of your OpenAI audio files:

```bash
npm run scripts-health-check ./examples/hello-world.json openai
```

### `scripts-character-count`

As is always the case with character or word based cost models, the amount of text that will be converted is always a question. This script prints out the character, word, and page count of all speaking-based actions in a given actions file.

```bash
npm run scripts-character-count ./examples/hello-world.json
```

### `code-health-check`

This command runs a health check of code after each `type` event, checking for any strange formatting or syntax errors. If it finds any, it will print out the file name and the error.

```bash
npm run code-health-check ./examples/hello-world.json
```

## Experimental: Visual Studio Code on Desktop Automation

Experimental: use a running instance of Visual Studio Code and `robotjs` to record in the desktop environment:

```bash
npm run visual-studio-code-driver ./examples/hello-world.json sayjs desktop
```

A few caveats are required to properly run desktop automation actions:

- Need exactly one 1920x1080 monitor
- The desktop to the right of where you issue the above script must be an empty instance of Visual Studio Code

## Broken / Experimental: Visual Studio Code on the Web

```bash
npm run visual-studio-code-web-driver ./examples/generic-sort-function-with-typescript.json sayjs
```

## Broken / Experimental: Visual Studio Code on a local Electron

```bash
npm run visual-studio-code-electron-driver ./examples/generic-sort-function-with-typescript.json sayjs
```

## Patches!

Due to an ugly bug with `fluent-ffmpeg`, which is used by `puppeteer-screen-recorder`, the `fluent-ffmpeg` library has been patched with `patch-package`. For those interested, the patch is in `./patches/fluent-ffmpeg+2.1.2.patch`.

## Nut.js

Nut.js is an open source package but must be built from source as the creator has opted to make easy install from the CLI only for paying licensed customers (more power to him!). Codevideo will be more than happy to buy a license once this product starts generating revenue. The current source of a recent version of Nut.js, 4.2.0 is in the `sources` folder and installed in the `postinstall` script along with `patch-package`