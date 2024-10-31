import { addAudioToVideo } from "./audio/addAudioToVideo.js";
import { buildAudioFile } from "./audio/buildAudioFile.js";
import { convertSpeakActionsToAudio } from "./audio/convertScriptPropertiesToAudio.js";
import { loadActions } from "./io/loadActions.js";
import { runPuppeteerAutomation } from "./puppeteer/runPuppeteerAutomation.js";

const makeVideo = async () => {
  const { actions, url, videoFile, actionsAudioDirectory, textToSpeechOption } =
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
    actionsAudioDirectory,
    'monaco-single-editor'
  );

  // now that we have the offset delays for each audio, build the audio file
  await buildAudioFile(actionsAudioDirectory, audioFiles, audioStartTimes);

  // then combine the audio and video files
  // TODO: quick fix for videoDirectory is the videoFile without the file name
  const videoDirectory = videoFile.replace(/\/[^/]+$/, "");
  await addAudioToVideo("", videoDirectory, videoFile, actionsAudioDirectory);
};

makeVideo();
