import fs from "fs";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { addAudioToVideo } from "../audio/addAudioToVideo.js";
import { buildAudioFile } from "../audio/buildAudioFile.js";
import { convertSpeakActionsToAudio } from "../audio/convertScriptPropertiesToAudio.js";
import { loadActions } from "../io/loadActions.js";
import { runPuppeteerAutomation } from "../puppeteer/runPuppeteerAutomation.js";

// TODO: using VideoGenerator class?
// export const generateVideoFromActions = async (actions: Array<IAction>): Promise<Buffer> => {
//   const videoGenerator = new VideoGenerator();
//   await videoGenerator.makeVideo();
//   return videoGenerator.getVideoAsBuffer();
// };

// using series of functions
export const generateVideoFromActions = async (actions: Array<IAction>): Promise<Buffer> => {
  // const { url, videoFile, actionsAudioDirectory, textToSpeechOption } =
  //   await loadActions();

  const fileNameWithoutExtension = "tmp";
  const currentWorkingDirectory = process.cwd();
  const textToSpeechOption = "sayjs";
  const editorUrl = `file://${currentWorkingDirectory}/editor.html`;

  // create all folders as needed if they don't exist
  fs.mkdirSync(`${currentWorkingDirectory}/tmp`, { recursive: true });
  fs.mkdirSync(`${currentWorkingDirectory}/tmp/video`, { recursive: true });
  fs.mkdirSync(`${currentWorkingDirectory}/tmp/audio/${fileNameWithoutExtension}`, { recursive: true });

  const audioDirectory = `${currentWorkingDirectory}/tmp/audio/${fileNameWithoutExtension}`;
  const videoDirectory = `${currentWorkingDirectory}/tmp/video`;
  const videoFile = `${currentWorkingDirectory}/tmp/video/${fileNameWithoutExtension}.mp4`;

  // first convert scripts to audio
  const audioFiles = await convertSpeakActionsToAudio(
    actions,
    audioDirectory,
    false,
    textToSpeechOption
  );

  // then run the puppeteer automation, which records the video and returns the start times of each audio
  const audioStartTimes = await runPuppeteerAutomation(
    editorUrl,
    videoFile,
    actions,
    audioDirectory
  );

  // now that we have the offset delays for each audio, build the audio file
  await buildAudioFile(audioDirectory, audioFiles, audioStartTimes);

  // then combine the audio and video files
  await addAudioToVideo(videoDirectory, videoFile, audioDirectory);

  // finally load the video and return it as a buffer
  return fs.promises.readFile(videoFile);
};

