import fs from 'fs';
import  path  from 'path';
import { exec } from "child_process";

export const addAudioToVideo = async (
  id: string,
  videoFolder: string,
  videoFile: string,
  audioFile: string
): Promise<void> => {
  const videoFileNoExtension = path.basename(videoFile, path.extname(videoFile));
  const combinedVideoFileName = `${videoFolder}/${id}-combined.mp4`;
  const convert = new Promise<void>((resolve, reject) => {
    const ffmpegCommand = `ffmpeg -i ${videoFile} -i ${audioFile}/combined.mp3 -c:v copy -map 0:v:0 -map 1:a:0 -shortest ${combinedVideoFileName} -y`;
    console.log(`Executing FFmpeg command: ${ffmpegCommand}`)
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ffmpeg command: ${error.message}`);
        reject(error);
      } else {
        console.log(`FFmpeg command executed successfully.`);
        resolve();
      }
    });
  });
  await convert;

  // now get rid of final by renaming it and overwriting the original video file
  fs.renameSync(`${combinedVideoFileName}`, videoFile);
  console.log(`Video file '${videoFileNoExtension}.mp4' created successfully. Play it with 'open ${videoFile}'`);
};
