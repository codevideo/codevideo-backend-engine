import { jest } from '@jest/globals';
import { describe, expect } from "@jest/globals";
import { generateVideoFromActions } from "../../src/utils/generateVideoFromActions.js"
import { IGenerateVideoFromActionsOptions } from "../../src/interfaces/IGenerateVideoFromActionsOptions.js";
import { exec } from "child_process";

// helper function to check if the buffer is a valid MP4 file with sound
export const isValidMP4WithSound = (buffer: Buffer): Promise<boolean> => {
  // Write buffer to a temporary file
  // Note: You might need to use a different method depending on your setup
  const fs = require('fs');
  const tmpFilePath = './temp.mp4';
  fs.writeFileSync(tmpFilePath, buffer);

  // Use ffprobe to analyze the file
  const ffprobeCmd = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of default=noprint_wrappers=1:nokey=1 ${tmpFilePath}`;

  return new Promise((resolve, reject) => {
      exec(ffprobeCmd, (error, stdout, stderr) => {
          if (error) {
              console.error(`Error running ffprobe: ${error.message}`);
              reject(error);
              return;
          }
          if (stderr) {
              console.error(`ffprobe stderr: ${stderr}`);
              reject(stderr);
              return;
          }

          // Check if ffprobe output indicates audio codec is present
          if (stdout.trim() === 'audio') {
              resolve(true); // Valid MP4 with sound
          } else {
              resolve(false); // Not a valid MP4 with sound
          }
      });
  });
}

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

    const {videoBuffer} = await generateVideoFromActions(videoOptions);
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
    const videoResults = await Promise.all(promises);

    // check that all videos are valid
    const isValid = await Promise.all(videoResults.map(result => isValidMP4WithSound(result.videoBuffer)));
    expect(isValid.every((valid) => valid)).toBe(true);
  });
});
