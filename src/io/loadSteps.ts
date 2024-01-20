import path from "path";
import fs from "fs";

export const loadSteps = () => {
  const currentWorkingDirectory = process.cwd();

  // first argument to this script is the path to the steps file
  if (process.argv.length < 3) {
    console.error("Please provide a path to the steps file");
    process.exit(1);
  }
  const inputStepsFilePath = process.argv[2];

  // ensure it is a json file
  if (!inputStepsFilePath.endsWith(".json")) {
    console.error("Please provide a path to a json file");
    process.exit(1);
  }

  // join the steps file path with the current working directory
  const stepsFilePath = path.join(currentWorkingDirectory, inputStepsFilePath);

  // ensure the file exist relative to the current working directory
  if (!fs.existsSync(stepsFilePath)) {
    console.error(`File not found: ${stepsFilePath}`);
    process.exit(1);
  }

  // finally we can safely require the steps file
  const steps = require(stepsFilePath);
  console.log(`Found ${steps.length} steps in file ${stepsFilePath}`)
  const stepsFileName = path.basename(stepsFilePath, path.extname(stepsFilePath));
  const stepsAudioPath = `${currentWorkingDirectory}/audio/${stepsFileName}`
  const stepsVideoPath = `${currentWorkingDirectory}/video/${stepsFileName}`

  return {steps, stepsFilePath, stepsAudioPath, stepsVideoPath};
};
