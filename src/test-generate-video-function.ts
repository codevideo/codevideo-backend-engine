import fs from "fs";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { generateVideoFromActions } from "./utils/generateVideoFromActions.js";

const main = async () => {
  const actions: Array<IAction> = [
    {
      name: "speak-before",
      value: "I'm going to type 'Hello, world!' in the editor.",
    },
    {
      name: "type-editor",
      value: "Hello, world!",
    },
    {
      name: "speak-before",
      value: "Yeah, I'm pretty much awesome.",
    },
  ];

  const video = await generateVideoFromActions(actions, "sayjs");
  fs.writeFileSync("video.mp4", video);
};

main();
