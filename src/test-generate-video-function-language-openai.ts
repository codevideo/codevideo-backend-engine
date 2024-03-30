import fs from "fs";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { generateVideoFromActions } from "./utils/generateVideoFromActions.js";
import { IGenerateVideoFromActionsOptions } from "./interfaces/IGenerateVideoFromActionsOptions.js";

const main = async () => {
  const videoOptions: IGenerateVideoFromActionsOptions = {
    actions: [
      {
        name: "speak-before",
        value: "I'm going to type a comment of 'Hello, world!' in the editor.",
      },
      {
        name: "type-editor",
        value: "# Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "# Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "# Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "# Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "# Hello, world!\n",
      },
      {
        name: "type-editor",
        value: "def my_awesome_python_function():\n\t# some code here...",
      },
      {
        name: "speak-before",
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
