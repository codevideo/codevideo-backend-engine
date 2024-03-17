import { IAudioFile } from "@fullstackcraftllc/codevideo-types";
import fs from "fs";
import path from "path";

export const readAudioFiles = async (
  audioFolderPath: string
): Promise<IAudioFile[]> => {
  try {
    const files = await fs.promises.readdir(audioFolderPath);
    const audioFiles: IAudioFile[] = [];

    for (const file of files) {
      const filePath = path.join(audioFolderPath, file);
      if (fs.statSync(filePath).isFile()) {
        audioFiles.push({ path: filePath });
      }
    }

    return audioFiles;
  } catch (error) {
    console.error("Error reading audio files:", error);
    return [];
  }
};
