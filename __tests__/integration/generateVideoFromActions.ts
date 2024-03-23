import { describe, expect } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { generateVideoFromActions } from "./../../src/utils/generateVideoFromActions";
import { isValidMP4WithSound } from "../utils/isValidMp4";

describe("generateVideoFromActions", () => {
  it("returns a buffer of a valid mp4 file, including sound", async () => {
    // simple two step action - one speak and one type-editor action
    const actions: Array<IAction> = [
      {
        name: "speak-before",
        value: "I'm going to type some code now.",
      },
      {
        name: "type-editor",
        value: "console.log('Hello, world!');",
      },
    ];

    const videoBuffer = await generateVideoFromActions(actions);
    const isValid = await isValidMP4WithSound(videoBuffer);
    expect(isValid).toBe(true);
  });
});
