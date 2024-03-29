import { IAction, ProgrammingLanguages, TextToSpeechOptions } from "@fullstackcraftllc/codevideo-types";

export interface IGenerateVideoFromActionsOptions {
    actions: Array<IAction>,
    language: ProgrammingLanguages,
    textToSpeechOption: TextToSpeechOptions,
    initialCode?: string,
    ttsApiKey?: string;
    ttsVoiceId?: string;
  }