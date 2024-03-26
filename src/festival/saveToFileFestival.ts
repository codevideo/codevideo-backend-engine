import fs from "fs";
import * as util from "util";
import { exec } from "child_process";
const execPromise = util.promisify(exec);

export const saveToFileFestival = async (
  id: string,
  text: string,
  audioFolderPath: string,
  forceOverwrite: boolean
) => {
  console.log(`Writing audio file to ${audioFolderPath}`);
  const filePath = `${audioFolderPath}/${id}.mp3`;
  if (fs.existsSync(filePath) && !forceOverwrite) {
    console.log(`File with hash ${id} already exists. Skipping...`);
    return;
  }
  console.log(`Writing audio file to ${filePath}`);

  // escape double and single quotes
  text = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
  // TODO: fix potential security issue with shell injection
  await execPromise("echo " + text + " | text2wave | lame - " + filePath);
};
