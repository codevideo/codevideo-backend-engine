import { exec } from 'child_process';

// Define a function to check if the buffer is a valid MP4 file with sound
export const isValidMP4WithSound = (buffer: Buffer) => {
    // Write buffer to a temporary file
    // Note: You might need to use a different method depending on your setup
    const fs = require('fs');
    const tmpFilePath = './temp.mp4';
    fs.writeFileSync(tmpFilePath, buffer);

    // Use ffprobe to analyze the file
    const ffprobeCmd = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of default=noprint_wrappers=1:nokey=1 ${tmpFilePath}`;

    return new Promise((resolve, reject) => {
        exec(ffprobeCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running ffprobe: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`ffprobe stderr: ${stderr}`);
                reject(stderr);
                return;
            }

            // Check if ffprobe output indicates audio codec is present
            if (stdout.trim() === 'audio') {
                resolve(true); // Valid MP4 with sound
            } else {
                resolve(false); // Not a valid MP4 with sound
            }
        });
    });
}