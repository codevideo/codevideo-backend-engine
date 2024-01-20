# Zoinkr

Create beautifully realistic automated software videos with the monaco editor!

## Installation

```bash
npm install
```

## Step Files

The automation api works via a _step_ file. This is a json file that contains a list of _steps_ to perform on a file. An example of a simple hello world automation looks like this:

```json
[
  {
    "id": 1,
    "script": "First we'll create a new file called index.js.",
    "action": "create",
    "filename": "index.js"
  },
  {
    "id": 2,
    "script": "To represent that it's 'index.js', I'll just put a comment here",
    "action": "edit-append",
    "filename": "index.js",
    "code": "// index.js"
  },
  {
    "id": 3,
    "script": "Then, we'll add a simple console.log statement to the file. We'll learn in the coming lessons what the console is and how to use it.",
    "action": "edit-add-on-new-line",
    "filename": "index.js",
    "code": "console.log(\"Hello, world!\");"
  },
  {
    "id": 4,
    "script": "For example, if I wanted to write the value of some variable, I could do that with console.log.",
    "action": "edit-add-on-new-line",
    "filename": "index.js",
    "code": "var myVariable = \"Important variable I want to keep track of\";\nconsole.log(myVariable);"
  }
]
```

## Actions

Currently the following actions are supported:

- `create` - creates a new file
- `edit-append` - appends text to the end of the file
- `edit-add-on-new-line` - adds text on a new line of the file

Coming soon:

Edit actions:
- `edit-insert` - inserts text at a specific location in the file
- `edit-replace` - replaces text at a specific location in the file
- `edit-delete` - deletes text at a specific location in the file
- `edit-delete-all` - deletes all text in the file
- `edit-delete-line` - deletes a line in the file

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
