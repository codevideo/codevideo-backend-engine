import puppeteer, { Page } from "puppeteer";
import fs from "fs";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { executeAction } from "../actions/executeAction.js";
import { addAudioToVideo } from "../audio/addAudioToVideo.js";
import { buildAudioFile } from "../audio/buildAudioFile.js";
import { convertSpeakActionsToAudio } from "../audio/convertScriptPropertiesToAudio.js";
import { loadActions } from "../io/loadActions.js";
import { TextToSpeechOptions } from "../types/TextToSpeechOptions.js";
import { sha256Hash } from "../utils/sha256Hash.js";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

export class VideoGenerator {
  private trueAudioStartTime = 0;
  private actions: Array<IAction> = [];
  private url = "";
  private actionsAudioDirectory = "";
  private forceOverwriteAudioFiles = false;
  private textToSpeechOption: TextToSpeechOptions = "sayjs";
  private videoFile = "";
  private audioStartTimes: Array<number> = [];

  // in constructor, set all the properties
  initialize = async () => {
    const {
      actions,
      url,
      videoFile,
      actionsAudioDirectory,
      textToSpeechOption,
    } = await loadActions();

    // create audio directory if it doesn't exist
    if (!fs.existsSync(actionsAudioDirectory)) {
      fs.mkdirSync(actionsAudioDirectory);
    }

    this.actions = actions;
    this.url = url;
    this.actionsAudioDirectory = actionsAudioDirectory;
    this.textToSpeechOption = textToSpeechOption;
    this.videoFile = videoFile;
  }

  //  audio playback logic
  // TODO: would be nice to move in with executeAction, but the page makes a closure
  playAudioInPuppeteer = async (
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
    const startTime = Math.round(performance.now()) - this.trueAudioStartTime;
    console.log(
      `audio ${audioHash} (${filePath}) start time set to: ${startTime}`
    );
    this.audioStartTimes.push(startTime);
    // Wait for the audio playback to complete
    await page.waitForFunction(
      () => (window as any).audioPlaybackPromiseResolved === true
    );
  };

  runPuppeteerAutomation = async (url: string) => {
    console.log("recording video...");
    // then run the automation
    const browser = await puppeteer.launch({
      headless: "new",
      // headless: false, // for debugging
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
    await recorder.start(this.videoFile);

    // add a 2 second delay before starting the steps
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // before beginning steps, save what current time we are in execution of this program
    // needed for accurately calculating the audio start times
    //trueAudioStartTime = 5000 //Math.round(performance.now()) + 1999;

    // Automation commands based on steps
    for (let i = 0; i < this.actions.length; i++) {
      // treat index as 'step id'
      const id = i + 1;
      const action = this.actions[i];
      console.log(`Step ${id} action: ${action.name}`);

      const audioHash = sha256Hash(action.value);

      // special case is audio playback
      if (action.name === "speak-before") {
        await this.playAudioInPuppeteer(
          page,
          audioHash,
          `${this.actionsAudioDirectory}/${audioHash}.mp3`
        );
        continue;
      } else if (action.name === "speak-during") {
        // use promise.all to play audio and execute action at the same time
        await Promise.all([
          this.playAudioInPuppeteer(
            page,
            audioHash,
            `${this.actionsAudioDirectory}/${audioHash}.mp3`
          ),
          executeAction(page, id, action),
        ]);
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

  // finally the function to orchestrate them all!!!
  makeVideo = async () => {
    // first convert scripts to audio
    const audioFiles = await convertSpeakActionsToAudio(
      this.actions,
      this.actionsAudioDirectory,
      this.forceOverwriteAudioFiles,
      this.textToSpeechOption
    );

    await this.runPuppeteerAutomation(this.url);

    // now that we have the offset delays for each audio, build the audio file
    await buildAudioFile(
      this.actionsAudioDirectory,
      audioFiles,
      this.audioStartTimes
    );

    // then combine the audio and video files
    await addAudioToVideo(this.videoFile, this.actionsAudioDirectory);
  };

  getVideoAsBuffer = async () => {
    const videoBuffer = fs.readFileSync(this.videoFile);
    return videoBuffer;
  }
}
