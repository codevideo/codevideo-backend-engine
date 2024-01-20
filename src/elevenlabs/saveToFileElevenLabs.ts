import fs from 'fs';
import fetch from 'isomorphic-fetch';
import { IStep } from '../interfaces/IStep';

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

interface TextToSpeechRequest {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
}

export const saveToFileElevenLabs = async (step: IStep, audioFolderPath: string, forceOverwrite: boolean) => {

  // if the file exists already, don't do anything - save money :)
  const filePath = `${audioFolderPath}/${step.id}.mp3`;
  if (fs.existsSync(filePath) && !forceOverwrite) {
    console.log(`File for step ${step.id} already exists. Skipping...`);
    return;
  }

  console.log('getting voice data...');

  // headers for elevenlabs
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'xi-api-key': process.env.ELEVEN_LABS_API_KEY || '',
    'Accept': 'audio/mpeg',
  };

  const body: TextToSpeechRequest = {
    text: step.script,
    model_id: 'eleven_turbo_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 1,
    },
  };

  try {
    // elli voice id MF3mGyEYCl7XYWbV9V6O
    // Chris voice (my own professional voice) id 1RLeGxy9FHYB5ScpFkts
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/1RLeGxy9FHYB5ScpFkts',
      {
        method: 'POST',
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
    const filePath = `${audioFolderPath}/${step.id}.mp3`;

    // write the file with fs
    fs.writeFileSync(filePath, Buffer.from(buffer));
  } catch (error) {
    console.error(error);
    // handle error appropriately
    return null;
  }
}

// Example usage:
// const result = await textToSpeech("Hello, this is a test");
// console.log(result);
