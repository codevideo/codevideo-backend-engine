import fs from "fs";
import { IAction, ActionEnvironment } from "@fullstackcraftllc/codevideo-types";
import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { executeActionForMonacoLocalhost } from "../actions/executeActionForMonacoLocalhost.js";
import { sha256Hash } from "../utils/sha256Hash.js";
import { playAudioInPuppeteer } from "./playAudioInPuppeteer.js";
import { executeActionForVisualStudioCodeLocalhost } from "../actions/executeActionForVisualStudioCodeLocalhost.js";


const resolveActionRunnerFunction = (actionEnvironment: ActionEnvironment) => {
  switch (actionEnvironment) {
    case 'monaco-single-editor':
      return executeActionForMonacoLocalhost;
    case 'visual-studio-code-web':
      return executeActionForVisualStudioCodeLocalhost;
    // case 'visual-studio-code-native':
    //   // TODO:
    //   return executeActionForVisualStudioCodeNative;
    default:
      throw new Error(`Action environment not supported: ${actionEnvironment}`);
  }
}

export const runPuppeteerAutomation = async (url: string, videoFile: string, actions: Array<IAction>, actionsAudioDirectory: string, actionEnvironment: ActionEnvironment): Promise<Array<number>> => {
  const actionRunnerFunction = resolveActionRunnerFunction(actionEnvironment);  
  const audioStartTimes: Array<number> = [];
    console.log("recording video...");
    // then run the automation
    const browser = await puppeteer.launch({
      args: ["--disable-dev-shm-usage", "--no-sandbox", "--start-maximized"], // both flags needed for docker, see: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
      // headless: "new",
      headless: false, // for debugging
      // devtools: true, // for debugging
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

    // // before starting the recording, wait for the page to load
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // // dump entire html as a string
    // const html = await page.content();
    // //write to file
    // fs.writeFileSync("page.html", html);

    // // click once to trigger focus
    // await page.click(".label-name");
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // // click the element with monaco-button monaco-text-button and text "Yes, I trust the authors"
    // await page.click("a.monaco-button.monaco-text-button");

    // await new Promise((resolve) => setTimeout(resolve, 1000));


    // await new Promise((resolve) => setTimeout(resolve, 7000));


    // // click the element with monaco-button monaco-text-button and text "Yes, I trust the authors"
    // await page.click("a.monaco-button.monaco-text-button");

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // //click the first img to set dark mode
    // // await page.click("img");

    // // await new Promise((resolve) => setTimeout(resolve, 500));

    // // click the element with action-label codicon codicon-close
    // await page.click(".action-label.codicon.codicon-close");

    // await new Promise((resolve) => setTimeout(resolve, 1000));


    
    // finally, create and start the recording
    const recorder = new PuppeteerScreenRecorder(page);
    await recorder.start(videoFile);

    // add a 2 second delay before starting the steps
    // await new Promise((resolve) => setTimeout(resolve, 2000));


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
          actionRunnerFunction(page, id, action),
        ]);
        audioStartTimes.push(audioStartTime);
      } else if (action.name === "type-terminal") {
      } else {
        await actionRunnerFunction(page, id, action);
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