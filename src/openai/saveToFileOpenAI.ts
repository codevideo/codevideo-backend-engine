import fs from "fs";
import fetch from "isomorphic-fetch";

interface OpenAITTSRequest {
  model: string;
  voice: string;
  input: string;
  response_format: string;
  speed: number;
}

export const saveToFileOpenAI = async (
  filename: string,
  textToSpeak: string,
  audioFolderPath: string,
  forceOverwrite: boolean,
  ttsApiKey?: string,
  ttsVoiceId?: string
) => {
  const filePath = `${audioFolderPath}/${filename}.mp3`;
  if (fs.existsSync(filePath) && !forceOverwrite) {
    console.log(`File with hash ${filename} already exists. Skipping...`);
    return;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${ttsApiKey}`,
    "Content-Type": "application/json",
  };

  const data: OpenAITTSRequest = {
    model: "tts-1",
    voice: ttsVoiceId || "echo",
    input: textToSpeak,
    response_format: "mp3",
    speed: 1.0,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // write the byte data to an mp3 file
    const buffer = await response.arrayBuffer();
    const filePath = `${audioFolderPath}/${filename}.mp3`;

    // write the file with fs
    fs.writeFileSync(filePath, Buffer.from(buffer));

    console.log(`Script for step ${filename} converted to audio with Open AI.`);
  } catch (error) {
    console.error(error);
  }
};
