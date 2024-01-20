import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const speechToText = async (audioFile: string) => {
  try {
    const transcript = await client.audio.transcriptions.create({
      file: fs.createReadStream(audioFile),
      model: "whisper-1"
    });
    return transcript.text;
  } catch (error) {
    console.error(`Error with file ${audioFile}: ${error}`);
    return "";
  }
};
