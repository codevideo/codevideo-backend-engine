import { saveToFileElevenLabs } from "../elevenlabs/saveToFileElevenLabs.js";
import { sha256Hash } from "./sha256Hash.js";
import sound from "sound-play";

export const speakAsClonedVoice = async (text: string) => {
  // first convert the text using elevenlabs
  const hash = sha256Hash(text);
  await saveToFileElevenLabs(hash, text, "audio/automation", false);
  // then sound-play to play the produced mp3 file
  const mp3FilePath = `audio/automation/${hash}.mp3`;
  try {
    await sound.play(mp3FilePath);
    console.log("done");
  } catch (error) {
    console.error(error);
  }
};
