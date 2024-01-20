import { Page } from "puppeteer";

export const editOnPrevLine = async (
  page: Page,
  id: number,
  filename: string,
  script: string,
  code: string
) => {
  await page.evaluate(
    async (id, filename, script, code) => {
      const editor = (window as any).editor;
      const currentValue = editor.getValue();

      // insert a new line at the beginning
      editor.setValue("\n" + currentValue);

      // now loop over code characters with slight delay - appending to the beginning of the editor
      for (const character of code) {
        const currentValue = editor.getValue();
        editor.setValue(character + currentValue);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    },
    id,
    filename,
    script,
    code
  );
};
