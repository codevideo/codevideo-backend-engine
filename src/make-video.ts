import dotenv from "dotenv";
import { addAudioToVideo } from "./audio/addAudioToVideo.js";
import { buildAudioFile } from "./audio/buildAudioFile.js";
import { convertSpeakActionsToAudio } from "./audio/convertScriptPropertiesToAudio.js";
import { loadActions } from "./io/loadActions.js";
import { runPuppeteerAutomation } from "./puppeteer/runPuppeteerAutomation.js";

// Load environment variables
dotenv.config();

const makeVideo = async () => {
  const { actions, url, videoDirectory, videoFile, actionsAudioDirectory, textToSpeechOption, actionEnvironment } =
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
    actionEnvironment
  );

  // now that we have the offset delays for each audio, build the audio file
  await buildAudioFile(actionsAudioDirectory, audioFiles, audioStartTimes);

  // then combine the audio and video files
  await addAudioToVideo("", videoDirectory, videoFile, actionsAudioDirectory);
};

makeVideo();
