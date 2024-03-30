import fs from "fs";
import * as util from "util";
import { exec } from "child_process";
import { convertWavToMp3AndDeleteWav } from "../audio/convertWavToMp3AndDeleteWav.js";

const execPromise = util.promisify(exec);

export const saveToFileCoquiAi = async (
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

  const wavFile = `${audioFolderPath}/${id}.wav`;
  // escape double and single quotes
  text = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
  // TODO: fix potential security issue with shell injection
  await execPromise('tts --text "' + text + '" --out_path ' + wavFile);
  await convertWavToMp3AndDeleteWav(wavFile, forceOverwrite);
  console.log(`Script for step ${id} converted to audio with say.`);
};
