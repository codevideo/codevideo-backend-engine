import { IAction, isSpeakAction } from "@fullstackcraftllc/codevideo-types";
import { TextToSpeechOptions } from "./../types/TextToSpeechOptions.js";
import { saveToFileSay } from "../say/saveToFileSay.js";
import { saveToFileElevenLabs } from "../elevenlabs/saveToFileElevenLabs.js";
import { sha256Hash } from "../utils/sha256Hash.js";
import { saveToFileOpenAI } from "../openai/saveToFileOpenAI.js";

// loop over each step, converting "script" property to audio with say
export const convertSpeakActionsToAudio = async (
  actions: Array<IAction>,
  audioFolderPath: string,
  forceOverwrite: boolean,
  textToSpeechOption: TextToSpeechOptions
) => {
  const audioFiles: Array<string> = [];

  // get all speak actions
  const speakActions = actions.filter(isSpeakAction);

  console.log(
    `Of the ${actions.length} actions, ${speakActions.length} are speak actions.`
  );

  for (let i = 0; i < speakActions.length; i++) {
    if (!isSpeakAction(speakActions[i])) {
      continue;
    }
    // id of the audio file is the sha-256 hash of the text
    const hash = sha256Hash(speakActions[i].value);
    const index = i + 1;
    console.log(
      `Converting text at step index ${index} to audio... (hash is ${hash})`
    );
    const textToSpeak = speakActions[i].value;

    // free version with say (installed outofthebox on mac)
    switch (textToSpeechOption) {
      case "sayjs":
        await saveToFileSay(hash, textToSpeak, audioFolderPath, forceOverwrite);
        break;
      case "elevenlabs":
        // real version with professional voice from elevenlabs
        await saveToFileElevenLabs(
          hash,
          textToSpeak,
          audioFolderPath,
          forceOverwrite
        );
        break;
      case "openai":
        // tts with open OpenAI
        await saveToFileOpenAI(
          hash,
          textToSpeak,
          audioFolderPath,
          forceOverwrite
        );
        break;
      default:
        console.error(`Invalid text to speech option '${textToSpeechOption}'`);
        break;
    }
    audioFiles.push(`${audioFolderPath}/${hash}.mp3`);
  }
  return audioFiles;
};
