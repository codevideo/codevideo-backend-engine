import { IGenerateVideoFromActionsOptions } from "@fullstackcraftllc/codevideo-types";
import { generateVideoFromActions } from "./utils/generateVideoFromActions.js";

const main = async () => {
  const videoOptions: IGenerateVideoFromActionsOptions = {
    actions: [
      {
        name: "author-speak-before",
        value: "I'm going to type a comment of 'Hello, world!' in the editor.",
      },
      {
        name: "editor-type",
        value: "# Hello, world!\n",
      },
      {
        name: "editor-type",
        value: "# Hello, world!\n",
      },
      {
        name: "editor-type",
        value: "# Hello, world!\n",
      },
      {
        name: "editor-type",
        value: "# Hello, world!\n",
      },
      {
        name: "editor-type",
        value: "# Hello, world!\n",
      },
      {
        name: "editor-type",
        value: "def my_awesome_python_function():\n\t# some code here...",
      },
      {
        name: "author-speak-before",
        value: "Yeah, I'm pretty much awesome.",
      },
    ],
    language: "python",
    textToSpeechOption: "openai",
    ttsApiKey: process.env.OPENAI_API_KEY,
    ttsVoiceId: "shimmer",
  };

  await generateVideoFromActions(videoOptions);
};

main();
