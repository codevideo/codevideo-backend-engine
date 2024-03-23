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
  const { url, videoFile, actionsAudioDirectory, textToSpeechOption } =
    await loadActions();

  // first convert scripts to audio
  const audioFiles = await convertSpeakActionsToAudio(
    actions,
    actionsAudioDirectory,
    false,
    textToSpeechOption
  );

  // then run the puppeteer automation, which records the video and returns the start times of each audio
  const audioStartTimes = await runPuppeteerAutomation(
    url,
    videoFile,
    actions,
    actionsAudioDirectory
  );

  // now that we have the offset delays for each audio, build the audio file
  await buildAudioFile(actionsAudioDirectory, audioFiles, audioStartTimes);

  // then combine the audio and video files
  await addAudioToVideo(videoFile, actionsAudioDirectory);

  // finally load the video and return it as a buffer
  return fs.promises.readFile(videoFile);
};

