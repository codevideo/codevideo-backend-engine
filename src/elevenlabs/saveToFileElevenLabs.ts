import fs from "fs";
import { getAudioArrayBufferElevenLabs } from "./getAudioArrayBufferElevenLabs";
import { applyCustomTransforms } from "./applyCustomTransforms";

export const saveToFileElevenLabs = async (
  filename: string,
  textToSpeak: string,
  audioFolderPath: string,
  forceOverwrite: boolean,
  ttsApiKey?: string,
  ttsVoiceId?: string
) => {
  // apply custom transforms to the text
  textToSpeak = applyCustomTransforms(textToSpeak);

  // if the file exists already, don't do anything - save money :)
  const filePath = `${audioFolderPath}/${filename}.mp3`;
  if (fs.existsSync(filePath) && !forceOverwrite) {
    console.log(`File with hash ${filename} already exists. Skipping...`);
    return;
  }

  const arrayBuffer = await getAudioArrayBufferElevenLabs(textToSpeak, ttsApiKey, ttsVoiceId);
  // write the file with fs
  fs.writeFileSync(filePath, new Uint8Array(arrayBuffer));

  console.log(
    `Script for step ${filename} converted to audio with Eleven Labs.`
  );

};