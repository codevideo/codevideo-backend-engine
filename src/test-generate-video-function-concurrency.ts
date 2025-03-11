import fs from "fs";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { generateVideoFromActions } from "./utils/generateVideoFromActions.js";
import { IGenerateVideoFromActionsOptions } from "./interfaces/IGenerateVideoFromActionsOptions.js";

const main = async () => {
  const videoOptions: IGenerateVideoFromActionsOptions = {
    actions: [
    {
      name: "author-speak-before",
      value: "I'm going to type a comment of 'Hello, world!' in the editor.",
    },
    {
      name: "editor-type",
      value: "// Hello, world!\n",
    },
    {
      name: "editor-type",
      value: "// Hello, world!\n",
    },
    {
      name: "editor-type",
      value: "// Hello, world!\n",
    },
    {
      name: "editor-type",
      value: "// Hello, world!\n",
    },
    {
      name: "editor-type",
      value: "// Hello, world!\n",
    },
    {
      name: "editor-type",
      value: "// Hello, world!\n",
    },
    {
      name: "author-speak-before",
      value: "Yeah, I'm pretty much awesome.",
    },
  ],
  language: "javascript",
  textToSpeechOption: "coqui-ai",
  };

  // use promise.all to run multiple instances of the function concurrently
  const promises = Array.from({ length: 10 }, () => generateVideoFromActions(videoOptions));
  await Promise.all(promises);
};

main();
