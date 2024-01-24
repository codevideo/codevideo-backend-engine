import { edit } from "./actions/edit";
import puppeteer, { Page } from "puppeteer";
import fs from "fs";
import { addAudioToVideo } from "./audio/addAudioToVideo";
import { createFile } from "./actions/createFile";
import { editAddOnNewLine } from "./actions/editAddOnNewLine";
import { editAppendFile } from "./actions/editAppendFile";
import { convertScriptPropertiesToAudio } from "./audio/convertScriptPropertiesToAudio";
import { buildAudioFile } from "./audio/buildAudioFile";
import { loadSteps } from "./io/loadSteps";
import { editOnPrevLine } from "./actions/editAddOnPrevLine";
import { editReplace } from "./actions/editReplace";
import { IStep } from "./interfaces/IStep";
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

let trueAudioStartTime = 0;

const { steps, stepsFilePath } = loadSteps();

// file path prefix is the current working directory
const filePathPrefix = process.cwd();

// get file name without extension - this will become the folder name for the audio files, as well as the name of the video file
const fileNameWithoutExtension = stepsFilePath.split("/").pop()?.split(".")[0];

// create a file in audio/{fileNameWithoutExtension} if it doesn't already exist
const audioFolderPath = `${filePathPrefix}/audio/${fileNameWithoutExtension}`;
if (!fs.existsSync(audioFolderPath)) {
  fs.mkdirSync(audioFolderPath);
}

const videoFile = `./video/${fileNameWithoutExtension}.mp4`;

// keep track of start times for the audio readAudioFiles
const audioStartTimes: Array<number> = [];

const playAudioInPuppeteer = async (
  page: Page,
  id: number,
  filePath: string
) => {
  const scriptContent = `
    window.audioPlaybackPromiseResolved = false;
    const audio${id} = new Audio('${filePath}');
    const playPromise${id} = audio${id}.play();

    audio${id}.addEventListener('ended', () => {
      window.audioPlaybackPromiseResolved = true;
    });
  `;

  // Add the script tag to the page
  await page.addScriptTag({ content: scriptContent });

  // add the start time to the array
  const startTime = Math.round(performance.now()) - trueAudioStartTime;
  console.log(`audio ${id} start time set to: ${startTime}`);
  audioStartTimes.push(startTime);

  // Wait for the audio playback to complete
  await page.waitForFunction(
    () => (window as any).audioPlaybackPromiseResolved === true
  );
};

const executeStepAction = async (page: Page, step: IStep) => {
  switch (step.action) {
    case "edit":
      // no coding stuff to do here
      await edit(
        page,
        step.code,
        step.specialCommands
      );
      break;
    case "talk-only":
      // no coding stuff to do here
      break;
    default:
      console.error(`Unsupported action: ${step.action}`);
  }
};

const playAudioLogic = async (page: Page, step: IStep) => {
  // Play the audio in puppeteer to simulate what will happen in final video
  await playAudioInPuppeteer(
    page,
    step.id,
    `${audioFolderPath}/${step.id}.mp3`
  );
};

const executeStep = async (page: Page, step: IStep) => {
  // script reading before code is the default
  if (step.scriptStart === "before" || step.scriptStart === undefined) {
    await playAudioLogic(page, step);
    await executeStepAction(page, step);
    return;
  }

  if (step.scriptStart === "after") {
    await executeStepAction(page, step);
    await playAudioLogic(page, step);
    return;
  }

  if (step.scriptStart === "during") {
    // Wait for both the step execution and audio playback to complete
    await Promise.all([
      playAudioLogic(page, step),
      executeStepAction(page, step),
    ]);
  }
};

const runPuppeteerAutomation = async () => {
  console.log("recording video...");
  // then run the automation
  const browser = await puppeteer.launch({
    headless: false, // for debugging
    // devtools: true, // for debugging
    // headless: "new",
    // executablePath:
    //   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();
  await page.goto(`file://${filePathPrefix}/editor.html`);
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  // Wait for the Monaco Editor to load
  await page.waitForFunction(() => (window as any).monaco !== undefined);

  // create and start the recording
  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start(videoFile);

  // before beginning steps, save what current time we are in execution of this program
  // needed for accurately calculating the audio start times
  trueAudioStartTime = Math.round(performance.now());

  // add a 2 second delay before starting the steps
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Automation commands based on steps
  for (const step of steps) {
    //@ts-ignore
    await executeStep(page, step);
    console.log(`Step ${step.id} complete`);
  }

  // wait 15 more seconds for any audio to finish playing
  await new Promise((resolve) => setTimeout(resolve, 15000));

  // stop the recording
  await recorder.stop();

  // Close the browser
  await browser.close();

  console.log("video recorded");
};

const main = async () => {
  try {
    // first convert scripts to audio
    const audioFiles = await convertScriptPropertiesToAudio(
      steps,
      audioFolderPath,
      false
    );

    // then run the puppeteer automation
    await runPuppeteerAutomation();

    // now that we have the offset delays for each audio, build the audio file
    await buildAudioFile(audioFolderPath, audioFiles, audioStartTimes);

    // then combine the audio and video files
    await addAudioToVideo(videoFile, audioFolderPath);
  } catch (error) {
    console.error("MAIN ERROR:", error);
  }
};

// Call the main function to start the automation
main();
