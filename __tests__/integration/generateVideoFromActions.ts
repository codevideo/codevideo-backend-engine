import { describe, expect } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { generateVideoFromActions } from "./../../src/utils/generateVideoFromActions";
import { isValidMP4WithSound } from "../utils/isValidMp4";
import { IGenerateVideoFromActionsOptions } from "../../src/interfaces/IGenerateVideoFromActionsOptions";

describe("generateVideoFromActions", () => {
  it("returns a buffer of a valid mp4 file, including sound", async () => {
    // simple two step action - one speak and one type-editor action
    const videoOptions: IGenerateVideoFromActionsOptions = {
      actions: [
        {
          name: "speak-before",
          value: "I'm going to type some code now.",
        },
        {
          name: "type-editor",
          value: "console.log('Hello, world!');",
        },
      ],
      language: "javascript",
      textToSpeechOption: "coqui-ai",
    };

    const videoBuffer = await generateVideoFromActions(videoOptions);
    const isValid = await isValidMP4WithSound(videoBuffer);
    expect(isValid).toBe(true);
  });

  it("can run concurrently", async () => {
    const videoOptions: IGenerateVideoFromActionsOptions = {
      actions: [
        {
          name: "speak-before",
          value: "I'm going to type some code now.",
        },
        {
          name: "type-editor",
          value: "console.log('Hello, world!');",
        },
      ],
      language: "javascript",
      textToSpeechOption: "coqui-ai",
    };

    // use promise.all to run multiple instances of the function concurrently
    const promises = Array.from({ length: 5 }, () => generateVideoFromActions(videoOptions));
    const videos = await Promise.all(promises);

    // check that all videos are valid
    const isValid = await Promise.all(videos.map(isValidMP4WithSound));
    expect(isValid.every((valid) => valid)).toBe(true);
  });
});
