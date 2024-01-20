import { Page } from "puppeteer";

export const createFile = async (
  page: Page,
  id: number,
  filename: string,
  script: string
) => {
  await page.evaluate(
    async (id, filename, script) => {
      (window as any).editor.getModels()[0].setValue("");
    },
    id,
    filename,
    script
  );
};
