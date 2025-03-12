import { IAction, IAudioItem } from "@fullstackcraftllc/codevideo-types"
import { sha256Hash } from "./sha256Hash";
import { uploadFileToSpaces } from "./uploadFileToSpaces";
import { getAudioArrayBufferElevenLabs } from "../elevenlabs/getAudioArrayBufferElevenLabs";

export const generateAudioItems = async (actions: Array<IAction>): Promise<IAudioItem[]> => {
    const audioManifest = Array<{ text: string, mp3Url: string }>();

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
            audioManifest.push({ text: textToSpeak, mp3Url });
        }
    }

    // return the audio manifest
    return audioManifest;
}