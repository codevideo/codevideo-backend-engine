import say from "say";
import { IStep } from "../interfaces/IStep";
import { saveToFileSay } from "../say/saveToFileSay";
import { saveToFileElevenLabs } from "../elevenlabs/saveToFileElevenLabs";


// loop over each step, converting "script" property to audio with say
export const convertScriptPropertiesToAudio = async (steps: Array<IStep>, audioFolderPath: string, forceOverwrite: boolean) => {
  const audioFiles: Array<string> = [];
  for (const step of steps) {
    console.log(`Converting script for step ${step.id} to audio...`);
    // free version with say (installed built in on mac)
    // await saveToFileSay(step, audioFolderPath);
    // await convertWavToMp3AndDeleteWav(step, audioFolderPath);
    // real version with professional voice from elevenlabs
    await saveToFileElevenLabs(step, audioFolderPath, forceOverwrite);
    audioFiles.push(`${audioFolderPath}/${step.id}.mp3`);
  }
  return audioFiles;
};