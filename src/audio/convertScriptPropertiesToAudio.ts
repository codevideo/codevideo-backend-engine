import os from "os";
import fs from "fs";
import {
  IAction,
  isSpeakAction,
  TextToSpeechOptions,
} from "@fullstackcraftllc/codevideo-types";
import { saveToFileSay } from "../say/saveToFileSay.js";
import { saveToFileElevenLabs } from "../elevenlabs/saveToFileElevenLabs.js";
import { sha256Hash } from "../utils/sha256Hash.js";
import { saveToFileOpenAI } from "../openai/saveToFileOpenAI.js";
import { saveToFileFestival } from "../festival/saveToFileFestival.js";
import { saveToFileCoquiAi } from "../coqui-ai-tts/saveToFileCoquiAi.js";

// loop over each step, converting "script" property to audio with say
export const convertSpeakActionsToAudio = async (
  actions: Array<IAction>,
  audioFolderPath: string,
  forceOverwrite: boolean,
  textToSpeechOption: TextToSpeechOptions,
  ttsApiKey?: string,
  ttsVoiceId?: string
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

    const platform = os.platform();
    if (platform === "linux" && textToSpeechOption === "sayjs") {
      console.log("sayjs is not supported on linux");
      throw new Error("sayjs is not supported on linux");
    }

    // create audio folder if it doesn't exist
    if (!fs.existsSync(audioFolderPath)) {
      fs.mkdirSync(audioFolderPath, { recursive: true });
    }

    // free version with say (installed outofthebox on mac)
    switch (textToSpeechOption) {
      case "coqui-ai":
        await saveToFileCoquiAi(
          hash,
          textToSpeak,
          audioFolderPath,
          forceOverwrite
        );
      case "festival":
        await saveToFileFestival(
          hash,
          textToSpeak,
          audioFolderPath,
          forceOverwrite
        );
      case "sayjs":
        await saveToFileSay(hash, textToSpeak, audioFolderPath, forceOverwrite);
        break;
      case "elevenlabs":
        // real version with professional voice from elevenlabs
        await saveToFileElevenLabs(
          hash,
          textToSpeak,
          audioFolderPath,
          forceOverwrite,
          ttsApiKey,
          ttsVoiceId
        );
        break;
      case "openai":
        // tts with open OpenAI
        await saveToFileOpenAI(
          hash,
          textToSpeak,
          audioFolderPath,
          forceOverwrite,
          ttsApiKey,
          ttsVoiceId
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
