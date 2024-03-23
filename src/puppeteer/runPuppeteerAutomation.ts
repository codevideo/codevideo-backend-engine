import { IAction } from "@fullstackcraftllc/codevideo-types";
import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { executeAction } from "../actions/executeAction.js";
import { sha256Hash } from "../utils/sha256Hash.js";
import { playAudioInPuppeteer } from "./playAudioInPuppeteer.js";

export const runPuppeteerAutomation = async (url: string, videoFile: string, actions: Array<IAction>, actionsAudioDirectory: string): Promise<Array<number>> => {
    const audioStartTimes: Array<number> = [];
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
        const audioStartTime = await playAudioInPuppeteer(
          page,
          audioHash,
          `${actionsAudioDirectory}/${audioHash}.mp3`
        );
        audioStartTimes.push(audioStartTime);
        continue;
      } else if (action.name === "speak-during") {
        // use promise.all to play audio and execute action at the same time
        const [audioStartTime, _] = await Promise.all([
          playAudioInPuppeteer(
            page,
            audioHash,
            `${actionsAudioDirectory}/${audioHash}.mp3`
          ),
          executeAction(page, id, action),
        ]);
        audioStartTimes.push(audioStartTime);
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

    // return the audio start times
    return audioStartTimes;
  };