import say from "say";
import { IStep } from "../interfaces/IStep";
import { saveToFileSay } from "../say/saveToFileSay";
import { saveToFileElevenLabs } from "../elevenlabs/saveToFileElevenLabs";
import { IAction, SpeakAction } from "../interfaces/IAction";
import { isSpeakAction } from "../type-guards/isSpeakAction";
import { sha256Hash } from "../utils/sha256Hash";

// loop over each step, converting "script" property to audio with say
export const convertSpeakActionsToAudio = async (actions: Array<IAction>, audioFolderPath: string, forceOverwrite: boolean) => {
  const audioFiles: Array<string> = [];

  // get all speak actions
  const speakActions = actions.filter(isSpeakAction);

  console.log(`Of the ${actions.length} actions, ${speakActions.length} are speak actions.`)

  for (let i = 0; i < speakActions.length; i++) {
    if (!isSpeakAction(speakActions[i])) {
      continue;
    }
    // id of the audio file is the sha-256 hash of the text
    const hash = sha256Hash(speakActions[i].value);
    const index = i + 1;
    console.log(`Converting text at step index ${index} to audio... (hash is ${hash})`);
    const textToSpeak = speakActions[i].value;
    // free version with say (installed built in on mac)
    // await saveToFileSay(step, audioFolderPath);
    // await convertWavToMp3AndDeleteWav(step, audioFolderPath);
    // real version with professional voice from elevenlabs
    await saveToFileElevenLabs(hash, textToSpeak, audioFolderPath, forceOverwrite);
    audioFiles.push(`${audioFolderPath}/${hash}.mp3`);
  }
  return audioFiles;
};