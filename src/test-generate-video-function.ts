import fs from "fs";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { generateVideoFromActions } from "./utils/generateVideoFromActions.js";

const main = async () => {
  const actions: Array<IAction> = [
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
  ];

  const { videoBuffer } = await generateVideoFromActions({actions, language: 'javascript', textToSpeechOption: "coqui-ai"});
  fs.writeFileSync("visual-studio-driver.mp4", new Uint8Array(videoBuffer));
};

main();
