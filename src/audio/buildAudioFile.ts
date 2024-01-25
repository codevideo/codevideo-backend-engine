import { exec } from 'child_process';

export const buildAudioFile = (audioFolderPath: string, audioFiles: string[], audioStartTimes: number[]): Promise<void> => {
  console.log("Combining audio files...")

  // reduce each start time by the first start time
  // TODO: figure out this audio start delay thing once and for all
  const trueAudioStartTimes = audioStartTimes.map((time, index) => {
    if (index === 0) {
      return time - audioStartTimes[0]
    } else {
      return time - audioStartTimes[0] - 200
    }});

  return new Promise<void>((resolve, reject) => {
    const inputFiles = audioFiles.map((file, index) => `-i ${file}`).join(' ');

    const filterComplex = trueAudioStartTimes
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