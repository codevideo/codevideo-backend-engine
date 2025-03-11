import fs from "fs";
import os from "os";
import { addAudioToVideo } from "../audio/addAudioToVideo.js";
import { buildAudioFile } from "../audio/buildAudioFile.js";
import { convertSpeakActionsToAudio } from "../audio/convertScriptPropertiesToAudio.js";
import { runPuppeteerAutomation } from "../puppeteer/runPuppeteerAutomation.js";
import { IGenerateVideoFromActionsOptions } from "../interfaces/IGenerateVideoFromActionsOptions.js";
import { v4 as uuidv4 } from 'uuid';

// using series of functions
export const generateVideoFromActionsV2 = async (options: IGenerateVideoFromActionsOptions): Promise<{videoBuffer: Buffer, pathToFile: string, guid: string}> => {
  const { actions, language, textToSpeechOption, initialCode, ttsApiKey, ttsVoiceId, guid } = options;
  // use the guid for the file name if it was passed, otherwise generate one
  // we need to do this to prevent deadlocks when running multiple instances of the function concurrently
  // every request has its own little playground folder to work in
  const fileNameWithoutExtension = guid ? guid : uuidv4();
  const currentWorkingDirectory = process.cwd();
  
  let resolvedTextToSpeechOption = textToSpeechOption;
  if (os.platform() === "linux" && textToSpeechOption === "sayjs") {
    console.log("sayjs is only supported on windows and mac, using festival instead");
    resolvedTextToSpeechOption = "festival";
  }

  // if we don't do this, initialcode resolves literally to the string "undefined"
  let resolvedInitialCode = initialCode;
  // now url encode the initial code
  resolvedInitialCode = encodeURIComponent(resolvedInitialCode || "");

  // the editor.html file is copied into the dist folder of the package itself, and thus must be loaded from there for any 3rd party call
  console.log("NODE ENV IS");
  console.log(process.env.NODE_ENV);
  const directoryOfEditorHtmlFile = process.env.NODE_ENV === "development" ? 
  `${currentWorkingDirectory}/src/monaco-localhost-single-file-editor` : 
  `${currentWorkingDirectory}/node_modules/@fullstackcraftllc/codevideo-backend-engine/dist`;
  const editorUrl = `file://${directoryOfEditorHtmlFile}/editor.html?language=${language}&initialCode=${resolvedInitialCode}`;

  // create all folders as needed if they don't exist
  fs.mkdirSync(`${currentWorkingDirectory}/tmp`, { recursive: true });
  fs.mkdirSync(`${currentWorkingDirectory}/tmp/video`, { recursive: true });
  fs.mkdirSync(`${currentWorkingDirectory}/tmp/audio/${fileNameWithoutExtension}`, { recursive: true });

  const audioDirectory = `${currentWorkingDirectory}/tmp/audio/${fileNameWithoutExtension}`;
  const videoDirectory = `${currentWorkingDirectory}/tmp/video`;
  const videoFile = `${currentWorkingDirectory}/tmp/video/${fileNameWithoutExtension}.mp4`;

  // first convert scripts to audio
  const audioFiles = await convertSpeakActionsToAudio(
    actions,
    audioDirectory,
    false, // forceOverwrite
    resolvedTextToSpeechOption
  );

  // in V2, audio is played right in the editor
  await runPuppeteerAutomation(
    editorUrl,
    videoFile,
    actions,
    audioDirectory,
    "codevideo-ide-react" as any
  );

  const videoBuffer  = await fs.promises.readFile(videoFile);

  // return relevant information
  return {
    videoBuffer,
    pathToFile: videoFile,
    guid: fileNameWithoutExtension
  }
};

