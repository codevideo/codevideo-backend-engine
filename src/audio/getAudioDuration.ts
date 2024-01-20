import { execSync } from "child_process";

export const getAudioDuration = (audioFilePath: string): number => {
  const result = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${audioFilePath}`
  );
  return parseFloat(result.toString());
};
