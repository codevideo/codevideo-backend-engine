import say from "say";
import { IStep } from "../interfaces/IStep";

export const saveToFileSay = async (step: IStep, audioFolderPath: string) => {
  await say.export(
    step.script,
    "Daniel",
    1,
    `${audioFolderPath}/${step.id}.wav`,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Script for step ${step.id} converted to audio`);
      }
    }
  );
};
