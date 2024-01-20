import { Page } from "puppeteer";

export const editAddOnNewLine = async (
  page: Page,
  id: number,
  filename: string,
  script: string,
  code: string
) => {
  await page.evaluate(
    async (id, filename, script, code) => {
      const editor = (window as any).monaco.editor.getModels()[0];
      const currentValue = editor.getValue();
      // add a new line
      editor.setValue(currentValue + "\n");

      // now loop over code characters with slight delay - appending to whatever is currently in the editor
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
