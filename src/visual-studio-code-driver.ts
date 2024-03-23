import * as robot from "robotjs";
import { findFileWithCharacters } from "./utils/findFileWIthCharacters.js";
import { findTextCoordinatesFromImage } from "./utils/findTextCoordinatesFromImage.js";
import { speakAsClonedVoice } from "./utils/speakAsClonedVoice.js";
import { wait } from "./utils/wait.js";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { exec, ChildProcess } from "child_process";

// uncomment proper screen size as needed

// standard 16:9 screen dimensions
// const screenDimensions = { width: 1920, height: 1080 };

// 2019 macbook pro 16" screen dimensions
const screenDimensions = { width: 2880, height: 1800 };

// characters per minute
const cpm = 500;

const centerPoint = {
  x: screenDimensions.width / 2,
  y: screenDimensions.height / 2,
};
const upperThirdCenter = {
  x: screenDimensions.width / 2,
  y: screenDimensions.height / 3,
};
const bottomThirdCenter = {
  x: screenDimensions.width / 2,
  y: (screenDimensions.height / 3) * 2,
};

// robotjs bug fix function
const keyTap = (key: string = "", modifiers: Array<string> = []) => {
  robot.keyToggle(key, "down", modifiers);
  robot.keyToggle(key, "up", modifiers); // Let up modifier keys in same way they were pressed
  modifiers.forEach((mod) => robot.keyToggle(mod, "up")); // Double check they are up
};

// Function to start QuickTime screen recording
const startScreenRecording = async (filename: string) => {
  // Start screen recording in the format of ~/Movies/CodeVideo_Recording<date>.mov

  exec(`screencapture -v -g ${filename}`);

  // Wait for the screen recording to start
  await wait(2000);

  // log that the screen recording has started
  console.log(`Screen recording started at ${filename}`);
};

const executeAppleScript = (script: string) => {
  return new Promise((resolve, reject) => {
    exec(`osascript -e '${script}'`, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
};

const moveToRightDesktop = async () => {
  console.log("Moving to right desktop");
  // TODO: for some reason robotjs for some reason doesn't work with the control right command
  // // 1. issue control right to get to the test vs code editor window
  // keyTap("right", ["control"]);

  // // 2. wait a bit so we can move to the proper screen
  // await wait(2000);
  try {
    const script = `tell application "System Events" to key code 124 using control down`;
    await executeAppleScript(script);
    console.log("Command executed successfully.");
  } catch (error) {
    console.error("Error executing command:", error);
  }
};

const moveToLeftDesktop = async () => {
  try {
    console.log("Moving to left desktop");
    const script = `tell application "System Events" to key code 123 using control down`;
    await executeAppleScript(script);
    console.log("Command executed successfully.");
  } catch (error) {
    console.error("Error executing command:", error);
  }
};

const moveMouseToCenterOfScreen = async () => {
  console.log("Moving mouse to center of screen");
  // move the mouse to the center of the 1920x1080 screen
  robot.moveMouseSmooth(centerPoint.x, centerPoint.y, 2);
};

const clickVSCodeFileByName = async (fileName: string) => {
  // issue command shift 3 to take a screenshot
  keyTap("3", ["command", "shift"]);

  // wait a bit for the screenshot to be taken and find coordinates of text and everything
  await wait(2000);

  // get the file name of the screenshot - it will have a (2) since it is from the second monitor
  // TODO: super flakey :)
  const screenshotFileName = findFileWithCharacters(
    "/Users/chris/Desktop",
    "Screenshot"
  );

  if (!screenshotFileName) {
    console.error("Screenshot not found");
    return;
  } else {
    console.log(`Screenshot found at ${screenshotFileName}`);
  }

  // use the screenshot to find the coordinates of the "helloworld.ts" file
  const filePoint = await findTextCoordinatesFromImage(
    screenshotFileName,
    fileName
  );

  if (!filePoint) {
    console.error(
      `Coordinates for text ${fileName} not found, used file ${screenshotFileName}`
    );
    throw new Error(
      `Coordinates for text ${fileName} not found, used file ${screenshotFileName}`
    );
  }

  console.log(
    `Coordinates for text ${fileName} found at ${filePoint.x}, ${filePoint.y}`
  );

  // move to the file
  // await moveMouseInHumanLikeWay(centerPoint, filePoint, "arc-above", false);
  robot.moveMouseSmooth(filePoint.x + 100, filePoint.y, 1);

  // wait a bit to move to the file
  await wait(1000);

  // click to open the file
  robot.mouseClick();

  // wait a bit for the file to open
  await wait(1000);
};

const moveUpperThirdCenter = async () => {
  robot.moveMouseSmooth(upperThirdCenter.x, upperThirdCenter.y, 2);
};

const moveBottomThirdCenter = async () => {
  robot.moveMouseSmooth(bottomThirdCenter.x, bottomThirdCenter.y, 2);
};

const prepareDesktopForRecording = async (
  filename: string
) => {
  await moveToRightDesktop();

  // wait 1 second for desktop to switch
  await wait(1000);

  // start screen recording
  await startScreenRecording(filename);

  await moveMouseToCenterOfScreen();

  // click to ensure screen is in focus
  robot.mouseClick();

  console.log("Desktop successfully prepared for recording");
};

const tearDownRecording = async () => {
  // move us back to the left desktop
  await moveToLeftDesktop();

  // kill this process
  process.exit();
};

export const executeActionsWithVisualStudioCodeDesktop = async (
  actions: Array<IAction>
) => {
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    console.log(
      `Executing action ${i + 1} of ${actions.length}: ${JSON.stringify(
        action
      )}`
    );
    const characters = action.value.length;
    switch (action.name) {
      case "speak-before":
        await speakAsClonedVoice(action.value);
        break;
      case "type-editor":
        robot.typeStringDelayed(action.value, cpm);
        // await based on the cpm and the length of the string
        await wait((characters / cpm) * 60);
        break;
      case "click-editor":
        // click somewhere near the top of the editor to make sure we can type in it
        await moveUpperThirdCenter();
        // wait a bit for mouse to move
        await wait(1000);
        // click in the file!
        robot.mouseClick();
        break;
      case "click-terminal":
        await moveBottomThirdCenter();
        await wait(1000);
        robot.mouseClick();
        break;
      case "type-terminal":
        robot.typeStringDelayed(action.value, cpm);
        await wait((characters / cpm) * 60);
        break;
      case "click-filename":
        await clickVSCodeFileByName(action.value);
        break;
      case "open-terminal":
        keyTap("`", ["control", "shift"]);
        // wait a bit to let the terminal open
        await wait(3000);
        break;
      case "save":
        keyTap("s", ["command"]);
        break;
      case "enter":
        keyTap("enter");
        break;
      default:
        console.log(`Action ${action.name} not found`);
        break;
    }
  }
};

const run = async () => {
  const filename = `~/Movies/CodeVideo_Recording${Date.now()}.mov`;
  await prepareDesktopForRecording(filename);
  const actions =
    require("../examples/visual-studio-code-console-log.json") as Array<IAction>;
  await executeActionsWithVisualStudioCodeDesktop(actions);
  await tearDownRecording();
};

run();
