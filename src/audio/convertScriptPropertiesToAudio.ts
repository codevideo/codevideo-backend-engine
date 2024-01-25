import say from "say";
import { IStep } from "../interfaces/IStep";
import { saveToFileSay } from "../say/saveToFileSay";
import { saveToFileElevenLabs } from "../elevenlabs/saveToFileElevenLabs";
import { IAction, SpeakAction } from "../interfaces/IAction";
import { isSpeakAction } from "../type-guards/isSpeakAction";


// loop over each step, converting "script" property to audio with say
export const convertSpeakActionsToAudio = async (actions: Array<IAction>, audioFolderPath: string, forceOverwrite: boolean) => {
  const audioFiles: Array<string> = [];
  for (let i = 0; i < actions.length; i++) {
    if (!isSpeakAction(actions[i])) {
      continue;
    }
    const id = i+1;
    console.log(`Converting text at step index ${id} to audio...`);
    const textToSpeak = actions[i].value;
    // free version with say (installed built in on mac)
    // await saveToFileSay(step, audioFolderPath);
    // await convertWavToMp3AndDeleteWav(step, audioFolderPath);
    // real version with professional voice from elevenlabs
    await saveToFileElevenLabs(id, textToSpeak, audioFolderPath, forceOverwrite);
    audioFiles.push(`${audioFolderPath}/${id}.mp3`);
  }
  return audioFiles;
};