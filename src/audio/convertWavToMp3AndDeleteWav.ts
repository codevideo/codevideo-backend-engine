import * as fs from "fs/promises";
import * as path from "path";
import * as util from "util";
import { exec } from "child_process";

const execPromise = util.promisify(exec);

export const convertWavToMp3AndDeleteWav = async (wavFile: string, forceOverwrite: boolean) => {
  try {
      const folderToWriteTo = path.dirname(wavFile);
      const outputFilePath = path.join(
        folderToWriteTo,
        `${path.parse(wavFile).name}.mp3`
      );

      const command = `ffmpeg -i "${wavFile}" -codec:a libmp3lame -q:a 2 "${outputFilePath}"`;

      console.log("Executing FFmpeg command:", command);

      // Execute FFmpeg command
      const { stdout, stderr } = await execPromise(command);
      
      // Delete the original wav file
      await fs.unlink(wavFile);

      console.log(`Conversion for ${wavFile} completed. Original wav file deleted.`);
      console.log("FFmpeg command output:", stdout);
      console.error("FFmpeg command error:", stderr);
    
  } catch (error) {
    console.error("Error:", error);
  }
};
