import {
  Button,
  centerOf,
  Key,
  keyboard,
  mouse,
  Point,
  screen,
  singleWord,
  straightTo,
} from "@nut-tree/nut-js";
import { findFileWithCharacters } from "./utils/findFileWIthCharacters.js";
import { findTextCoordinatesFromImage } from "./utils/findTextCoordinatesFromImage.js";
import { speakAsClonedVoice } from "./utils/speakAsClonedVoice.js";
import { wait } from "./utils/wait.js";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// uncomment proper screen size as needed

// standard 16:9 screen dimensions
// const screenDimensions = { width: 1920, height: 1080 };

// 2019 macbook pro 16" screen dimensions
// const screenDimensions = { width: 3840, height: 2400 };
const screenDimensions = { width: 1920, height: 1200 };

const centerPoint = new Point(
  screenDimensions.width / 2,
  screenDimensions.height / 2
);
const upperThirdCenter = new Point(
  screenDimensions.width / 2,
  screenDimensions.height / 3
);
const upperThirdLeft = new Point(
  screenDimensions.width / 3,
  screenDimensions.height / 3
);
const bottomThirdCenter = new Point(
  screenDimensions.width / 2,
  (screenDimensions.height / 3) * 2
);

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
  await mouse.move(straightTo(centerPoint));
};

const moveMouseToTopLeftOfScreen = async () => {
  console.log("Moving mouse to top left of screen");
  await mouse.move(straightTo(new Point(0, 0)));
};

const moveMouseToTopRightOfScreen = async () => {
  console.log("Moving mouse to top right of screen");
  await mouse.move(straightTo(new Point(screenDimensions.width, 0)));
};

const moveMouseToBottomRightOfScreen = async () => {
  console.log("Moving mouse to bottom right of screen");
  await mouse.move(
    straightTo(new Point(screenDimensions.width, screenDimensions.height))
  );
};

const moveMouseToBottomLeftOfScreen = async () => {
  console.log("Moving mouse to bottom left of screen");
  await mouse.move(straightTo(new Point(0, screenDimensions.height)));
};

const clickVSCodeFileOrFolderByName = async (fileOrFolderName: string) => {
  // // issue command shift 3 to take a screenshot
  console.log("Taking screenshot")
  await keyboard.pressKey(Key.LeftCmd, Key.LeftShift, 3);
  console.log("Releasing keys")
  await keyboard.releaseKey(Key.LeftCmd, Key.LeftShift, 3);
  console.log("Screenshot taken")

  // wait a bit for the screenshot to be taken and find coordinates of text and everything
  await wait(3000);

  // get the file name of the screenshot
  // TODO: super flakey :)
  const screenshotFileName = findFileWithCharacters(
    "/Users/chris/Desktop",
    "Screenshot"
  );

  if (!screenshotFileName) {
    throw new Error("Screenshot not found");
    return;
  } else {
    console.log(`Screenshot found at ${screenshotFileName}`);
  }

  // use the screenshot to find the coordinates of the "helloworld.ts" file
  const filePoint = await findTextCoordinatesFromImage(
    screenshotFileName,
    fileOrFolderName
  );

  if (!filePoint) {
    throw new Error(
      `Coordinates for text ${fileOrFolderName} not found, used file ${screenshotFileName}`
    );
  }

  console.log(
    `Coordinates for text ${fileOrFolderName} found at ${filePoint.x}, ${filePoint.y}`
  );

  const pointfound = await screen.find(singleWord(fileOrFolderName));
  console.log("pointfound", pointfound);

  // move to the file
  // await moveMouseInHumanLikeWay(centerPoint, filePoint, "arc-above", false);
  const point = new Point(filePoint.x, filePoint.y);
  await mouse.move(straightTo(point));

  // need a license for the ocr plugin for this
  // await mouse.move(
  //   straightTo(
  //     centerOf(
  //       screen.find(
  //         singleWord(fileOrFolderName)
  //       )
  //     )
  //   )
  // );

  // wait a bit to move to the file
  await wait(1000);

  // click to open the file
  await mouse.click(Button.LEFT);

  // wait a bit for the file to open
  await wait(1000);
};

const moveUpperThirdCenter = async () => {
  await mouse.move(
    straightTo(new Point(upperThirdCenter.x, upperThirdCenter.y))
  );
};

const moveUpperThirdLeft = async () => {
  await mouse.move(straightTo(new Point(upperThirdLeft.x, upperThirdCenter.y)));
};

const moveBottomThirdCenter = async () => {
  await mouse.move(
    straightTo(new Point(bottomThirdCenter.x, bottomThirdCenter.y))
  );
};

const moveRelativeTo = async (x: number, y: number) => {
  const currentPosition = await mouse.getPosition();
  await mouse.move(
    straightTo(new Point(currentPosition.x + x, currentPosition.y + y))
  );
};

const createFolder = async (folderName: string) => {
  // move to upper third left
  await moveUpperThirdLeft();
  // right click
  await mouse.click(Button.RIGHT);
  // move down 20px and right 5
  await moveRelativeTo(20, 5);
  // left click
  await mouse.click(Button.LEFT);
  // type name
  await keyboard.type(folderName);
  // press enter
  await keyboard.pressKey(Key.Enter);
};

const createFile = async (fullFileName: string) => {
  // get file name
  const fileName = fullFileName.split("/").pop();
  if (!fileName) {
    return;
  }
  // get folder name
  const folderName = fullFileName.split("/").slice(0, -1).join("/");
  // click it
  await clickVSCodeFileOrFolderByName(folderName);
  // right click it
  await mouse.click(Button.RIGHT);
  // move down 20px and right 5 to click 'New File...'
  await moveRelativeTo(5, 5);
  // type the file name
  await keyboard.type(fileName);
  // press enter
  await keyboard.pressKey(Key.Enter);
};

const prepareDesktopForRecording = async (filename: string) => {
  await moveToRightDesktop();

  // wait 1 second for desktop to switch
  await wait(1000);

  // start screen recording
  await startScreenRecording(filename);

  await moveMouseToCenterOfScreen();

  // click to ensure screen is in focus
  await mouse.click(Button.LEFT);

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
  const guid = uuidv4();
  const currentWorkingDirectory = process.cwd();
  const actionsAudioDirectory = `${currentWorkingDirectory}/tmp/audio/${guid}`;
  // create tmp/video/guid folder if it doesn't exist
  if (!fs.existsSync(actionsAudioDirectory)) {
    fs.mkdirSync(actionsAudioDirectory, { recursive: true });
  }

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    console.log(
      `Executing action ${i + 1} of ${actions.length}: ${JSON.stringify(
        action
      )}`
    );
    switch (action.name) {
      case "speak-before":
        await speakAsClonedVoice(action.value, actionsAudioDirectory);
        break;
      case "type-editor":
        await keyboard.type(action.value);
        break;
      case "click-editor":
        // click somewhere near the top of the editor to make sure we can type in it
        await moveUpperThirdCenter();
        // wait a bit for mouse to move
        await wait(1000);
        // click in the file!
        await mouse.click(Button.LEFT);
        break;
      case "click-terminal":
        await moveBottomThirdCenter();
        await wait(1000);
        await mouse.click(Button.LEFT);
        break;
      case "type-terminal":
        await keyboard.type(action.value);
        break;
      case "click-filename":
        await clickVSCodeFileOrFolderByName(action.value);
        break;
      case "create-folder":
        await createFolder(action.value);
        break;
      case "create-file":
        await createFile(action.value);
      case "open-terminal":
        await keyboard.pressKey(Key.LeftControl, Key.LeftShift, Key.Grave);
        // wait a bit to let the terminal open
        await wait(3000);
        break;
      case "save":
        await keyboard.pressKey(Key.LeftCmd, Key.S);
        break;
      case "enter":
        await keyboard.pressKey(Key.Enter);
        break;
      default:
        console.log(`Action ${action.name} not found`);
        break;
    }
  }
};

const run = async () => {
  // const filename = `~/Movies/CodeVideo_Recording${Date.now()}.mov`;
  // await prepareDesktopForRecording(filename);
  // const { default: actions } = await import(
  //   "../examples/visual-studio-code-console-log.json",
  //   { assert: { type: "json" } }
  // );
  // await executeActionsWithVisualStudioCodeDesktop(actions as Array<IAction>);
  // await tearDownRecording();

  // for sanity checks
  // await moveMouseToCenterOfScreen();
  // await moveMouseToTopLeftOfScreen();
  // await moveMouseToTopRightOfScreen();
  // await moveMouseToBottomRightOfScreen();
  // await moveMouseToBottomLeftOfScreen();
  // await moveMouseToCenterOfScreen();

  // const filename = `~/Movies/CodeVideo_Recording${Date.now()}.mov`;

  // await prepareDesktopForRecording(filename);

  // await moveMouseToCenterOfScreen();

  // await clickVSCodeFileOrFolderByName("hello-world.js");

  console.log("Taking screenshot")
  await keyboard.pressKey(Key.LeftCmd, Key.LeftShift, 3);
  console.log("Releasing keys")
  await keyboard.releaseKey(Key.LeftCmd, Key.LeftShift, 3);
  console.log("Screenshot taken")

  console.log("Taking screenshot")
  await keyboard.pressKey(Key.LeftCmd, Key.LeftShift, 3);
  console.log("Releasing keys")
  await keyboard.releaseKey(Key.LeftCmd, Key.LeftShift, 3);
  console.log("Screenshot taken")
};

run();
