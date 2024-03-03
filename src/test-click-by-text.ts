import * as robot from "robotjs";
import { findFileWithCharacters } from "./utils/findFileWIthCharacters";
import { findTextCoordinatesFromImage } from "./utils/findTextCoordinatesFromImage";
import { moveMouseInHumanLikeWay } from "./utils/moveMouseInHumanLikeWay";
import { speakAsClonedVoice } from "./utils/speakAsClonedVoice";
import { wait } from "./utils/wait";
const { exec } = require("child_process");

// standard 16:9 screen dimensions
// const screenDimensions = { width: 1920, height: 1080 };
// 2019 macbook pro 16" screen dimensions
const screenDimensions = { width: 2880, height: 1800 };

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
const startScreenRecording = async () => {
  // Start screen recording in the format of ~/Movies/Screen\ Recording <date>.mov
  exec(
    `screencapture -v -g ~/Movies/Screen\ Recording $(date +'%Y-%m-%d_%H-%M-%S').mov`
  );

  // Wait for the screen recording to start
  setTimeout(() => {}, 2000);
};

const moveToRightDesktop = async () => {
  console.log("Moving to right desktop")
  // 1. issue control right to get to the test vs code editor window
  keyTap("right", ["control"]);

  // 2. wait a bit so we can move to the proper screen
  await wait(2000);
};

const moveToLeftDesktop = async () => {
  console.log("Moving to left desktop")
  // 1. issue control left to get to the test vs code editor window
  keyTap("left", ["control"]);

  // 2. wait a bit so we can move to the proper screen
  await wait(2000);
};

const moveMouseToCenterOfScreen = async () => {
  console.log("Moving mouse to center of screen")
  // move the mouse to the center of the 1920x1080 screen
  robot.moveMouseSmooth(centerPoint.x, centerPoint.y, 2);
};

const clickVSCodeFileByName = async (fileName: string) => {
  // issue command shift 3 to take a screenshot
  keyTap("3", ["command", "shift"]);

  // wait a bit for the screenshot to be taken and find coordinates of text and everything
  await wait(1000);

  // get the file name of the screenshot - it will have a (2) since it is from the second monitor
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
    console.error(`Coordinates for text ${fileName} not found`);
    return;
  }

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

const testClickByText = async () => {
  // start screen recording
  await startScreenRecording();

  await moveToRightDesktop();

  await moveMouseToCenterOfScreen();

  // click to ensure screen is in focus
  robot.mouseClick();

  // begin speaking
  await speakAsClonedVoice(
    "Today, we're going to learn about how to use the console.log function in JavaScript."
  );

  await speakAsClonedVoice(
    `I've already got a hello-world.js file prepared here - let's open it up.`
  );

  await clickVSCodeFileByName("hello-world.js");

  // 7. click somewhere near the top of the editor to make sure we can type in it
  await moveUpperThirdCenter();

  // wait a bit for mouse to move
  await wait(1000);

  // click in the file!
  robot.mouseClick();

  await wait(500);

  await speakAsClonedVoice(
    "Now, to log things to your console, simply make a call to the console.log function, passing in the text you want to log."
  );

  // 8. type some text!
  robot.typeStringDelayed("console.log('hello world!');", 500);

  await speakAsClonedVoice("And let's save this file...");

  // 9. save the file
  keyTap("s", ["command"]);

  await speakAsClonedVoice("Now we'll open up a terminal and run this file.");

  // 10. open a terminal
  keyTap("`", ["control", "shift"]);

  // move to bottom third and click
  robot.moveMouseSmooth(bottomThirdCenter.x, bottomThirdCenter.y, 2);

  await wait(1000);

  robot.mouseClick();

  // wait a bit longer because shell needs to boot up
  await wait(2000);

  // type the command
  robot.typeStringDelayed("node hello-world.js", 500);

  await wait(1000);

  // hit enter
  keyTap("enter");

  await wait(2000);

  await speakAsClonedVoice(
    "And of course we get the expected output - 'hello world!' printed to the console."
  );

  await speakAsClonedVoice(
    "And that's about it! You now know how to log things to your console in JavaScript!"
  );
};

testClickByText();
