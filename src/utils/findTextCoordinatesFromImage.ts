import { Bbox, Block, createWorker, PSM } from "tesseract.js";
import Jimp from "jimp";
import { IPoint } from "@fullstackcraftllc/codevideo-types";
import fs from "fs";

export const findTextCoordinatesFromImage = async (
  imagePath: string,
  searchText: string
): Promise<IPoint | undefined> => {
  const worker = await createWorker();
  await worker.setParameters({
    tessedit_char_whitelist:
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:\"<>?~`-=[]\\;',./",
    tessedit_pageseg_mode: PSM.SPARSE_TEXT,
  });

  const image = await Jimp.read(imagePath);
  const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
  const { data } = await worker.recognize(imageBuffer);

  // helpful for debugging: log each text block
  // data.blocks?.forEach((block: Block) => {
  //   console.log(block.text);
  // });

  const bounds = data.blocks
    ?.filter(({ text }) => text.trim().includes(searchText))
    .map((block: Block) => {
      // console.log("found block: ", block)
      const boundingBox: Bbox = block.bbox;
      // full bounding box
      // return {
      //   x0: boundingBox.x0,
      //   y0: boundingBox.y0,
      //   x1: boundingBox.x1,
      //   y1: boundingBox.y1,
      // };
      // for IPoint, return average of x and y
      return {
        x: (boundingBox.x0 + boundingBox.x1) / 2,
        y: (boundingBox.y0 + boundingBox.y1) / 2,
      };
    })
    .at(0);

  await worker.terminate();

  // delete the image from the file system as cleanup
  console.log("deleting image")
  fs.unlinkSync(imagePath);

  return bounds;
};
