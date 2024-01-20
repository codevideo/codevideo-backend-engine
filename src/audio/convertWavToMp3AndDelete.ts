import * as fs from 'fs/promises';
import * as path from 'path';
import * as util from 'util';
import { exec } from 'child_process';

const execPromise = util.promisify(exec);

export const convertWavToMp3AndDelete = async (inputFolderPath: string) => {
  try {
    // Get all files in the input folder
    const files = await fs.readdir(inputFolderPath);

    // Filter for only .wav files
    const wavFiles = files.filter(file => file.endsWith('.wav'));

    // Convert each .wav file to .mp3 and delete the original .wav file
    await Promise.all(wavFiles.map(async (wavFile) => {
      const inputFilePath = path.join(inputFolderPath, wavFile);
      const outputFilePath = path.join(inputFolderPath, `${path.parse(wavFile).name}.mp3`);

      // Execute FFmpeg command
      const { stdout, stderr } = await execPromise(`ffmpeg -i "${inputFilePath}" -codec:a libmp3lame -q:a 2 "${outputFilePath}" && rm "${inputFilePath}"`);

      console.log(`Conversion for ${wavFile} completed.`);
      console.log('FFmpeg command output:', stdout);
      console.error('FFmpeg command error:', stderr);
    }));

    console.log('All conversions completed.');
  } catch (error) {
    console.error('Error:', error);
  }
}