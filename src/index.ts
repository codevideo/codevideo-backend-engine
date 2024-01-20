import puppeteer, { Page } from "puppeteer";
import fs from "fs";
import { addAudioToVideo } from "./audio/addAudioToVideo";
import { createFile } from "./actions/createFile";
import { editAddOnNewLine } from "./actions/editAddOnNewLine";
import { editAppendFile } from "./actions/editAppendFile";
import { convertScriptPropertiesToAudio } from "./audio/convertScriptPropertiesToAudio";
import { buildAudioFile } from "./audio/buildAudioFile";
import { loadSteps } from "./io/loadSteps";
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

let trueAudioStartTime = 0;

const {steps, stepsFilePath} = loadSteps();

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

  // Wait for the audio playback to complete
  await page.waitForFunction(
    () => (window as any).audioPlaybackPromiseResolved === true
  );
};

const executeStep = async (page: Page, step: any) => {
  switch (step.action) {
    case "create":
      await createFile(page, step.id, step.filename, step.script);
      break;
    case "edit-append":
      await editAppendFile(
        page,
        step.id,
        step.filename,
        step.script,
        step.code
      );
      break;
    case "edit-add-on-new-line":
      await editAddOnNewLine(
        page,
        step.id,
        step.filename,
        step.script,
        step.code
      );
      break;
    case "talk-only":
      // no coding stuff to do here
      break;
    default:
      console.error(`Unsupported action: ${step.action}`);
  }
  // even though we have no way of recording the audio, it spaces the steps properly for when
  // we add the audio back in later
  // Record the start time and round it
  const startTime = Math.round(performance.now()) - trueAudioStartTime;
  audioStartTimes.push(startTime);
  await playAudioInPuppeteer(
    page,
    step.id,
    `${audioFolderPath}/${step.id}.mp3`
  );
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

  // create and start the record
  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start(videoFile);

  // Wait for the Monaco Editor to load
  await page.waitForFunction(() => (window as any).monaco !== undefined);

  // before beginning steps, save what current time we are in execution of this program
  // needed for accurately calculating the audio start times
  trueAudioStartTime = Math.round(performance.now());

  // Automation commands based on steps
  for (const step of steps) {
    //@ts-ignore
    await executeStep(page, step);
    console.log(`Step ${step.id} complete`);
  }

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
