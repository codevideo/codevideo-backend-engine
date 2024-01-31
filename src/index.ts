import { executeAction } from "./actions/executeAction";
import puppeteer, { Page } from "puppeteer";
import fs from "fs";
import { addAudioToVideo } from "./audio/addAudioToVideo";
import { convertSpeakActionsToAudio } from "./audio/convertScriptPropertiesToAudio";
import { buildAudioFile } from "./audio/buildAudioFile";
import { sumActions } from "./examples/sum";
import { loadActions } from "./io/loadActions";
import { sha256Hash } from "./utils/sha256Hash";
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

let trueAudioStartTime = 0;

// loading from json file, do it like this:
const { actions, url, fileNameWithoutExtension, actionsAudioDirectory } = loadActions('typescript');

// create a file in audio/{fileNameWithoutExtension} if it doesn't already exist
if (!fs.existsSync(actionsAudioDirectory)) {
  fs.mkdirSync(actionsAudioDirectory);
}

const videoFile = `./video/${fileNameWithoutExtension}.mp4`;

// keep track of start times for the audio readAudioFiles
const audioStartTimes: Array<number> = [];

//  audio playback logic
// TODO: would be nice to move in with executeAction, but the page makes a closure
const playAudioInPuppeteer = async (
  page: Page,
  audioHash: string,
  filePath: string
) => {
  const scriptContent = `
    window.audioPlaybackPromiseResolved = false;
    const audio${audioHash} = new Audio('${filePath}');
    const playPromise${audioHash} = audio${audioHash}.play();

    audio${audioHash}.addEventListener('ended', () => {
      window.audioPlaybackPromiseResolved = true;
    });
  `;

  // Add the script tag to the page
  await page.addScriptTag({ content: scriptContent });

  // add the start time to the array
  const startTime = Math.round(performance.now()) - trueAudioStartTime;
  console.log(`audio ${audioHash} (${filePath}) start time set to: ${startTime}`);
  audioStartTimes.push(startTime);
  // Wait for the audio playback to complete
  await page.waitForFunction(
    () => (window as any).audioPlaybackPromiseResolved === true
  );
};

const runPuppeteerAutomation = async (url: string) => {
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
  await page.goto(url);
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  // Wait for the Monaco Editor to load
  await page.waitForFunction(() => (window as any).monaco !== undefined);

  // create and start the recording
  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start(videoFile);

  // add a 2 second delay before starting the steps
  await new Promise((resolve) => setTimeout(resolve, 2000));

    // before beginning steps, save what current time we are in execution of this program
  // needed for accurately calculating the audio start times
  //trueAudioStartTime = 5000 //Math.round(performance.now()) + 1999;

  // Automation commands based on steps
  for (let i = 0; i < actions.length; i++) {
    // treat index as 'step id'
    const id = i + 1;
    const action = actions[i];
    console.log(`Step ${id} action: ${action.name}`);

    const audioHash = sha256Hash(action.value);

    // special case is audio playback
    if (action.name === "speak-before") {
      await playAudioInPuppeteer(page, audioHash, `${actionsAudioDirectory}/${audioHash}.mp3`);
      continue;
    } else if (action.name === "type-terminal") {
    
  } else {

      await executeAction(page, id, action);
    }

    console.log(`Step ${id} complete`);
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
    const audioFiles = await convertSpeakActionsToAudio(
      actions,
      actionsAudioDirectory,
      false
    );

    // then run the puppeteer automation
    await runPuppeteerAutomation(url);

    // now that we have the offset delays for each audio, build the audio file
    await buildAudioFile(actionsAudioDirectory, audioFiles, audioStartTimes);

    // then combine the audio and video files
    await addAudioToVideo(videoFile, actionsAudioDirectory);
  } catch (error) {
    console.error("MAIN ERROR:", error);
  }
};

// Call the main function to start the automation
main();
