import fs from "fs";
import { spawn } from "child_process";
import { promisify } from "util";
import { addAudioToVideo } from "./audio/addAudioToVideo.js";
import { buildAudioFile } from "./audio/buildAudioFile.js";
import { convertSpeakActionsToAudio } from "./audio/convertScriptPropertiesToAudio.js";
import { loadActions } from "./io/loadActions.js";
import { runPuppeteerAutomation } from "./puppeteer/runPuppeteerAutomation.js";

// Promisify spawn
const spawnAsync = promisify(spawn);

// Promisify kill
const killAsync = (childProcess: any, signal?: any) => {
  return new Promise<{ code?: number | null, signal?: NodeJS.Signals }>((resolve, reject) => {
    childProcess.on('exit', (code: any, signal: any) => {
      resolve({ code, signal });
    });
    childProcess.kill(signal);
  });
};


const startVisualStudioCodeWeb = async (): Promise<{process: any, token: string} | null> => {
  try {
    console.log("Starting Visual Studio Code for Web...");
    // start visual studio code for web in a background process with a custom user data directory
    const webProcess = spawn("code", [
      "serve-web", 
      "--user-data-dir=\"/Users/chris/Library/Application Support/Code/User\"",
    ]);

    // Get token from stdout
    return new Promise((resolve, reject) => {
      webProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Web UI available at')) {
          resolve({
            process: webProcess,
            token: output.split("Web UI available at ")[1].trim()
          });
        }
      });

      webProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      webProcess.on('error', (error) => {
        console.error(`Error: ${error.message}`);
        reject(error);
      });
    });

  } catch (error) {
    console.error("Error starting Visual Studio Code for Web", error);
    return null;
  }
}

const makeVideo = async () => {
  const currentWorkingDir = process.cwd();
  // the default workspace is in the src/visual-studio-code-for-web directory
  const workspaceDirectory = `${currentWorkingDir}/src/visual-studio-code-for-web-workspace`;
  try {
    const { actions, videoFile, actionsAudioDirectory, textToSpeechOption } =
      await loadActions();

    // first convert scripts to audio
    const audioFiles = await convertSpeakActionsToAudio(
      actions,
      actionsAudioDirectory,
      false,
      textToSpeechOption
    );

    const webProcess = await startVisualStudioCodeWeb();
    if (!webProcess) {
      throw new Error("Failed to start Visual Studio Code for Web");
    }

    const url = `${webProcess.token}&folder=${workspaceDirectory}`;

    // then run the puppeteer automation, which records the video and returns the start times of each audio
    const audioStartTimes = await runPuppeteerAutomation(
      url,
      videoFile,
      actions,
      actionsAudioDirectory,
      'visual-studio-code-web'
    );

    // now that we have the offset delays for each audio, build the audio file
    await buildAudioFile(actionsAudioDirectory, audioFiles, audioStartTimes);

    // then combine the audio and video files
    // TODO: quick fix for videoDirectory is the videoFile without the file name
    const videoDirectory = videoFile.replace(/\/[^/]+$/, "");
    await addAudioToVideo("", videoDirectory, videoFile, actionsAudioDirectory);

    // kill the web process
    await killAsync(process, "SIGINT");
  } catch (error) {
    console.error("Error killing Visual Studio Code for Web", error);
  } finally {
    // cleanup: remove any files inside the workspace directory, but not the directory itself
    fs.rmSync(`${workspaceDirectory}/*`, { recursive: true, force: true });
  }
};

makeVideo();
