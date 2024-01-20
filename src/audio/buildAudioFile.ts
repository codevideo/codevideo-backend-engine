import { exec } from 'child_process';

export const buildAudioFile = (audioFolderPath: string, audioFiles: string[], audioStartTimes: number[]): Promise<void> => {
  console.log("Combining audio files...")

  return new Promise<void>((resolve, reject) => {
    const inputFiles = audioFiles.map((file, index) => `-i ${file}`).join(' ');

    const filterComplex = audioStartTimes
      .map((delay, index) => `[${index}]adelay=${delay}:all=true[a${index}];`)
      .join(' ');

    const amix = audioStartTimes.map((_, index) => `[a${index}]`).join('');
    
    const ffmpegCommand = `ffmpeg ${inputFiles} -filter_complex "${filterComplex} ${amix}amix=inputs=${audioStartTimes.length}:normalize=0 [out]" -map "[out]" ${audioFolderPath}/combined.mp3 -async 1 -y`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ffmpeg command: ${error.message}`);
        reject(error);
      } else {
        console.log(`Audio files combined successfully.`);
        resolve();
      }
    });
  });
}