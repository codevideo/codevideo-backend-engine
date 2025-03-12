import { getAudioArrayBufferElevenLabs } from "../elevenlabs/getAudioArrayBufferElevenLabs.js";
import { loadActions } from "../io/loadActions.js";
import { sha256Hash } from "../utils/sha256Hash.js";
import { uploadFileToSpaces } from "../utils/uploadFileToSpaces.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const generateAudioManifest = async () => {
  const audioManifest = Array<{text: string, mp3Url: string}>();
  
  // load in the actions file
  const { actions, textToSpeechOption } = await loadActions();

  if (textToSpeechOption !== "elevenlabs") {
    console.error("This script only supports the 'elevenlabs' text-to-speech option");
    process.exit(1);
  }

  // for each speak action, convert the text to audio and upload it to digital ocean spaces (S3)
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    const textToSpeak = action.value;
    const textHash = sha256Hash(textToSpeak);
    if (action.name.startsWith('author-speak')) {
      console.log(`Converting text at step index ${i} to audio... (hash is ${textHash})`);
      const arrayBuffer = await getAudioArrayBufferElevenLabs(textToSpeak, process.env.ELEVEN_LABS_API_KEY, process.env.ELEVEN_LABS_VOICE_ID);
      const buffer = Buffer.from(arrayBuffer);
      // upload the buffer to digital ocean spaces
      const mp3Url = await uploadFileToSpaces(buffer, `${textHash}.mp3`);
      // add the text and mp3Url to the audioManifest
      audioManifest.push({text: textToSpeak, mp3Url});
    }
  }

  // finally, print out a nicely formed JSON which has the format of {text: <text that was TTS>, mp3Url: <url to the mp3>}
  // you can use this with the replay mode of <CodeVideoIDE> for life-like audio
  console.log("Audio manifest:\n\n");
  console.log(JSON.stringify(audioManifest, null, 2));
}
generateAudioManifest();