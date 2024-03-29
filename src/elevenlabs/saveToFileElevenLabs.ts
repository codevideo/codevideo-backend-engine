import fs from "fs";
import fetch from "isomorphic-fetch";

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

interface TextToSpeechRequest {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
}

// eleven lab's can't handle reading of "C#" very well
const customTransforms: Record<string, string> = {
  "C#": "C sharp",
};

export const saveToFileElevenLabs = async (
  filename: string,
  textToSpeak: string,
  audioFolderPath: string,
  forceOverwrite: boolean,
  ttsApiKey?: string,
  ttsVoiceId?: string
) => {
  // apply custom transforms to the text
  for (const key in customTransforms) {
    if (textToSpeak.includes(key)) {
      textToSpeak = textToSpeak.replace(
        new RegExp(key, "g"),
        customTransforms[key]
      );
    }
  }

  // if the file exists already, don't do anything - save money :)
  const filePath = `${audioFolderPath}/${filename}.mp3`;
  if (fs.existsSync(filePath) && !forceOverwrite) {
    console.log(`File with hash ${filename} already exists. Skipping...`);
    return;
  }

  // headers for elevenlabs
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "xi-api-key": ttsApiKey || "",
    Accept: "audio/mpeg",
  };

  const body: TextToSpeechRequest = {
    text: textToSpeak,
    model_id: "eleven_turbo_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.95,
    },
  };

  try {
    // elli voice id MF3mGyEYCl7XYWbV9V6O
    // Chris voice (my own professional voice) id 1RLeGxy9FHYB5ScpFkts
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${
        ttsVoiceId || ""
      }`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // return the byte data generated by elevenlabs' boss bots
    // return await response.arrayBuffer();

    // write the byte data to an mp3 file
    const buffer = await response.arrayBuffer();
    const filePath = `${audioFolderPath}/${filename}.mp3`;

    // write the file with fs
    fs.writeFileSync(filePath, Buffer.from(buffer));

    console.log(
      `Script for step ${filename} converted to audio with Eleven Labs.`
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};
