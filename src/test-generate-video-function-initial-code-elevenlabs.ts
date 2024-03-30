import { generateVideoFromActions } from "./utils/generateVideoFromActions.js";
import { IGenerateVideoFromActionsOptions } from "./interfaces/IGenerateVideoFromActionsOptions.js";

const main = async () => {
  const videoOptions: IGenerateVideoFromActionsOptions = {
    initialCode: "// here's a comment at the top of the file\n\n// and another two lines later\n\n// and another\n",
    actions: [
      {
        name: "speak-before",
        value: "I'm going to type a comment of 'Hello, world!' in the editor.",
      },
      {
        name: "type-editor",
        value: "// Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "// Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "// Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "// Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "// Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "// Hello, world!\n",
      },
      {
        name: "speak-before",
        value: "Yeah, I'm pretty much awesome.",
      },
    ],
    language: "javascript",
    textToSpeechOption: "elevenlabs",
    ttsApiKey: process.env.ELEVEN_LABS_API_KEY,
    ttsVoiceId: process.env.ELEVEN_LABS_VOICE_ID,
  };

  // use promise.all to run multiple instances of the function concurrently
  await generateVideoFromActions(videoOptions);
};

main();
