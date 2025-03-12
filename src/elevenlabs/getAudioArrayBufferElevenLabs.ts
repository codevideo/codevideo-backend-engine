import fetch from "isomorphic-fetch";
import { applyCustomTransforms } from "./applyCustomTransforms";

export interface VoiceSettings {
    stability: number;
    similarity_boost: number;
  }

export interface TextToSpeechRequest {
    text: string;
    model_id: string;
    voice_settings: VoiceSettings;
  }

export const getAudioArrayBufferElevenLabs = async (textToSpeak: string, ttsApiKey?: string, ttsVoiceId?: string): Promise<ArrayBuffer> => {

    // apply custom transforms to the text
    textToSpeak = applyCustomTransforms(textToSpeak);

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
      // eleven labs default "Chris" voice id iP95p4xoKVk53GoZ742B
      // Chris voice (my own professional voice) id 1RLeGxy9FHYB5ScpFkts
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ttsVoiceId || "iP95p4xoKVk53GoZ742B"}`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // return the array buffer
      return await response.arrayBuffer();
  
    } catch (error) {
      console.error(error);
      throw new Error("Error in getAudioArrayBufferElevenLabs " + error);
    }
  }