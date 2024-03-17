import path from "path";
import fs from "fs";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { sumActions } from "../examples/sum";
import { fibonacciActions } from './../examples/fibonacci';
import { enumExtensionsActions } from "../examples/enumExtensions";

// import the json file get-description-from-attribute-c-sharp.json
// import * as getDescriptionFromAttributeCSharpActions from "../../examples/get-description-from-attribute-c-sharp.json";


export const loadActions = (
  source: "json" | "typescript"
): {
  url: string;
  actions: Array<IAction>;
  fileNameWithoutExtension: string;
  currentWorkingDirectory: string;
  actionsAudioDirectory: string;
  actionsVideoDirectory: string;
} => {
  // first argument to this script is the path to the actions file
  if (process.argv.length < 3) {
    console.error("Please provide a path to the actions file");
    process.exit(1);
  }

  const inputStepsFilePath = process.argv[2];
  const actions: Array<IAction> = [];
  const currentWorkingDirectory = process.cwd();

  // join the actions file path with the current working directory
  const actionsFilePath = path.join(
    currentWorkingDirectory,
    inputStepsFilePath
  );

  if (source === "json") {
    // ensure it is a json file
    if (!inputStepsFilePath.endsWith(".json")) {
      console.error("Please provide a path to a json file");
      process.exit(1);
    }

    // ensure the file exist relative to the current working directory
    if (!fs.existsSync(actionsFilePath)) {
      console.error(`File not found: ${actionsFilePath}`);
      process.exit(1);
    }

    // finally we can safely require the actions file
    const loadedActions = require(actionsFilePath) as Array<IAction>;
    actions.push(...loadedActions);
  } else {
    // actions.push(...sumActions);
    // actions.push(...fibonacciActions);
    actions.push(...enumExtensionsActions);
  }

  console.log(`Found ${actions.length} actions in file ${actionsFilePath}`);
  const fileNameWithoutExtension = path.basename(
    actionsFilePath,
    path.extname(actionsFilePath)
  );
  const actionsAudioDirectory = `${currentWorkingDirectory}/audio/${fileNameWithoutExtension}`;
  const actionsVideoDirectory = `${currentWorkingDirectory}/video/${fileNameWithoutExtension}`;

  let url = `file://${currentWorkingDirectory}/editor.html`;
  // if we see at least one 'type-terminal' action, then we know this has to run on a codespaces
  if (actions.map((a) => a.name).includes("type-terminal")) {
    url = `https://prod.liveshare.vsengsaas.visualstudio.com/join?049AB4AD9BC16BE338A13263281272C72C49`;
  }

  return {
    url,
    actions,
    currentWorkingDirectory,
    fileNameWithoutExtension,
    actionsAudioDirectory,
    actionsVideoDirectory,
  };
};
