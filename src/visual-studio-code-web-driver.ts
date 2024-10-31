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


const startVisualStudioCodeWeb = async () => {
  try {
  console.log("Starting Visual Studio Code for Web...");
  // start visual studio code for web in a background process
  const webProcess = await spawnAsync("code", ["serve-web", "--without-connection-token"], {});
  return webProcess;
  } catch (error) {
    console.error("Error starting Visual Studio Code for Web", error);
    return null;
  }
}

const makeVideo = async () => {
  const { actions, videoFile, actionsAudioDirectory, textToSpeechOption } =
    await loadActions();

  // first convert scripts to audio
  const audioFiles = await convertSpeakActionsToAudio(
    actions,
    actionsAudioDirectory,
    false,
    textToSpeechOption
  );

  const webProcess = startVisualStudioCodeWeb();
  const currentWorkingDir = process.cwd();
  // the default workspace is in the src/visual-studio-code-for-web directory
  const url = `http://127.0.0.1:8000/?folder=${currentWorkingDir}/src/visual-studio-code-for-web-workspace`;

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
  await killAsync(webProcess, "SIGINT");
};

makeVideo();
