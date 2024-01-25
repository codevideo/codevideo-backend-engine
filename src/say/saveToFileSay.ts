import say from "say";
import { IStep } from "../interfaces/IStep";

export const saveToFileSay = async (id: number, text: string, audioFolderPath: string) => {
  await say.export(
    text,
    "Daniel",
    1,
    `${audioFolderPath}/${id}.wav`,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Script for step ${id} converted to audio`);
      }
    }
  );
};
