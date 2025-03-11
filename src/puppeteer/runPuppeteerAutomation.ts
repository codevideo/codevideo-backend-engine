import fs from "fs";
import { IAction, ActionEnvironment } from "@fullstackcraftllc/codevideo-types";
import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { executeActionForMonacoLocalhost } from "../actions/executeActionForMonacoLocalhost.js";
import { sha256Hash } from "../utils/sha256Hash.js";
import { playAudioInPuppeteer } from "./playAudioInPuppeteer.js";
import { executeActionForVisualStudioCodeLocalhost } from "../actions/executeActionForVisualStudioCodeLocalhost.js";
import fetch from "node-fetch";

const resolveActionRunnerFunction = (actionEnvironment: ActionEnvironment) => {
  switch (actionEnvironment) {
    case 'monaco-single-editor':
      return executeActionForMonacoLocalhost;
    case 'visual-studio-code-web':
      return executeActionForVisualStudioCodeLocalhost;
    // TODO: theoretically the same as visual-studio-code-web?
    case 'visual-studio-code-electron':
      return executeActionForVisualStudioCodeLocalhost;
    // case 'visual-studio-code-native':
    //   // TODO:
    //   return executeActionForVisualStudioCodeNative;
    // ALSO TODO MAYBE:
    // case 'sandpack-editor':
    // return executeActionForSandpackEditor;
    default:
      throw new Error(`Action environment not supported: ${actionEnvironment}`);
  }
}

// returns an array of audio start times
export const runPuppeteerAutomation = async (url: string, videoFile: string, actions: Array<IAction>, actionsAudioDirectory: string, actionEnvironment: ActionEnvironment, port?: number): Promise<Array<number>> => {
  const actionRunnerFunction = resolveActionRunnerFunction(actionEnvironment);
  const audioStartTimes: Array<number> = [];
  let browser;
  let page;
  console.log("recording video...");
  // then run the automation
  try {
    if (actionEnvironment === "visual-studio-code-electron") {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      const debugInfo = await response.json();
      browser = await puppeteer.connect({
        browserWSEndpoint: debugInfo.webSocketDebuggerUrl,
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
      });
      const pages = await browser.pages();
      page = pages[0];
      console.log("setting viewport");
      await page.setViewport({
        width: 1920,
        height: 1080,
      });
    } else {
      browser = await puppeteer.launch({
        args: [
          "--disable-dev-shm-usage",
          "--no-sandbox",
          "--start-maximized",
          "--ignore-certificate-errors",
          "--allow-insecure-localhost",
          "--enable-logging",
          "--remote-debugging-port=9222",
        ], // both flags needed for docker, see: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md
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
      console.log("browser launched");
      page = await browser.newPage();
      console.log("going to url", url);
      await page.goto(url);
      console.log("setting viewport");
      await page.setViewport({
        width: 1920,
        height: 1080,
      });
    }
  } catch (error) {
    console.error("Error starting browser", error);
    return [];
  }


  // before starting the recording, wait for the page to load
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
  console.log("starting recording");
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
    if (action.name === "author-speak-before") {
      const audioStartTime = await playAudioInPuppeteer(
        page,
        audioHash,
        `${actionsAudioDirectory}/${audioHash}.mp3`
      );
      audioStartTimes.push(audioStartTime);
      continue;
    } else if (action.name === "author-speak-during") {
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
    } else if (action.name === "terminal-type") {
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