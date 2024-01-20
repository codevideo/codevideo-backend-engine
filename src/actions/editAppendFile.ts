import { Page } from "puppeteer";

export const editAppendFile = async (
  page: Page,
  id: number,
  filename: string,
  script: string,
  code: string
) => {
  await page.evaluate(
    async (id, filename, script, code) => {
      const editor = (window as any).monaco.editor.getModels()[0];

      // loop over code characters with slight delay - appending to whatever is currently in the editor
      for (const character of code) {
        const currentValue = editor.getValue();
        editor.setValue(currentValue + character);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    },
    id,
    filename,
    script,
    code
  );
};
