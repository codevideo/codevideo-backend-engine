import path from "path";
import fs from "fs";
import { IAction, TextToSpeechOptions, ActionEnvironment } from "@fullstackcraftllc/codevideo-types";

export const loadActions = async (): Promise<{
  url: string;
  actions: Array<IAction>;
  videoDirectory: string;
  videoFile: string;
  currentWorkingDirectory: string;
  actionsAudioDirectory: string;
  actionsVideoDirectory: string;
  workspaceDirectory: string;
  textToSpeechOption: TextToSpeechOptions;
  actionEnvironment: ActionEnvironment;
}> => {

  // first argument to this script is the path to the actions file - it is required
  if (process.argv.length < 3) {
    console.error("Please provide a path to the actions file");
    process.exit(1);
  }

  const inputStepsFilePath = process.argv[2];
  const actions: Array<IAction> = [];
  const currentWorkingDirectory = process.cwd();

  // if we have a 4th argument, then we know we have a text to speech option
  let textToSpeechOption: TextToSpeechOptions = "sayjs";
  if (process.argv.length >= 4) {
    const ttsOption = process.argv[3];
    // Validate that the provided option is a valid TextToSpeechOptions value
    if (["sayjs", "elevenlabs", "openai", "festival", "coqui-ai"].includes(ttsOption)) {
      textToSpeechOption = ttsOption as TextToSpeechOptions;
    } else {
      console.warn(`Invalid text-to-speech option "${ttsOption}", defaulting to "sayjs"`);
    }
  }

  // if we have a 5th argument, then we know we have an environment argument
  let actionEnvironment = "monaco-single-editor" as ActionEnvironment;
  if (process.argv.length >= 5) {
    actionEnvironment = process.argv[4] as ActionEnvironment;
  }

  // if we have a 6th argument, then we know we have an initial code argument
  let initialCode: string | null = null;
  if (process.argv.length >= 6) {
    initialCode = process.argv[5];
  }

  // if we have a 7th argument, then we know we have a language argument
  let language: string | null = null;
  if (process.argv.length >= 7) {
    language = process.argv[6];
  }

  // join the actions file path with the current working directory
  const actionsFilePath = path.join(
    currentWorkingDirectory,
    inputStepsFilePath
  );

  // ensure the file exist relative to the current working directory
  if (!fs.existsSync(actionsFilePath)) {
    console.error(`File not found: ${actionsFilePath}`);
    process.exit(1);
  }

  // try typescript first
  if (inputStepsFilePath.endsWith(".ts")) {
    // dynamically require the typescript file
    const {default: typeScriptActions} = await import(actionsFilePath);

    // if it's null, throw error that they need to use 'export default' syntax
    if (typeScriptActions === null) {
      console.error(
        "Failed to load TypeScript actions. Use 'export default' syntax in your typescript file to export the actions."
      );
      process.exit(1);
    }

    actions.push(...typeScriptActions);
  } else if (inputStepsFilePath.endsWith(".json")) {
    // we can safely require the actions file
    const {default: jsonActions} = await import(actionsFilePath, { assert: { type: "json" } });
    actions.push(...jsonActions);
  } else {
    console.error(
      "Please provide a path to a .ts or .json file with your actions"
    );
    process.exit(1);
  }

  console.log(`Found ${actions.length} actions in file ${actionsFilePath}`);
  const fileNameWithoutExtension = path.basename(
    actionsFilePath,
    path.extname(actionsFilePath)
  );
  const actionsAudioDirectory = `${currentWorkingDirectory}/audio/${fileNameWithoutExtension}`;
  const actionsVideoDirectory = `${currentWorkingDirectory}/video/${fileNameWithoutExtension}`;
  // used for the visual studio for web driver, which requires a workspace directory
  const workspaceDirectory = `${currentWorkingDirectory}/workspaces/${fileNameWithoutExtension}`;
  console.log("PROCESS ENV IS" + process.env.NODE_ENV);
  const directoryOfEditorHtmlFile = process.env.NODE_ENV === "development" ? 
  `${currentWorkingDirectory}/src/monaco-localhost-single-file-editor` : 
  `${currentWorkingDirectory}/node_modules/@fullstackcraftllc/codevideo-backend-engine/dist`;

  // with the single editor environment, we need to add the initial code and language to the url
  let url = `file://${directoryOfEditorHtmlFile}/editor.html`;
  if (actionEnvironment === "monaco-single-editor" && initialCode) {
    url += `?initialCode=${initialCode}`;
  }
  if (actionEnvironment === "monaco-single-editor" && language) {
    url += `?language=${language}`;
  }

  const videoFile = `./video/${fileNameWithoutExtension}.mp4`;

  const videoDirectory = videoFile.replace(/\/[^/]+$/, "");

  return {
    url,
    actions,
    currentWorkingDirectory,
    videoDirectory,
    videoFile,
    actionsAudioDirectory,
    actionsVideoDirectory,
    workspaceDirectory,
    textToSpeechOption,
    actionEnvironment
  };
};
