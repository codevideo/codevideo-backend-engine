import { saveToFileElevenLabs } from "../elevenlabs/saveToFileElevenLabs.js";
import { sha256Hash } from "./sha256Hash.js";
import sound from "sound-play";

export const speakAsClonedVoice = async (text: string, actionsAudioDirectory: string) => {
  // first convert the text using elevenlabs
  try {
  const hash = sha256Hash(text);
  await saveToFileElevenLabs(hash, text, actionsAudioDirectory, false, process.env.ELEVEN_LABS_API_KEY, process.env.ELEVEN_LABS_VOICE_ID);
  // then sound-play to play the produced mp3 file
  const mp3FilePath = `${actionsAudioDirectory}/${hash}.mp3`;
    await sound.play(mp3FilePath);
    console.log("done");
  } catch (error) {
    console.error(error);
    throw new Error("Error in speakAsClonedVoice "+ error);
  }
};
