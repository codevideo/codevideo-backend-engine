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
      const editor = (window as any).editor;
      
      // Scroll to the end (bottom) of the document
      const lastLine = editor.getLineCount();
      editor.revealLine(lastLine);

      // Wait for a short period to ensure that the scroll has completed
      await new Promise((resolve) => setTimeout(resolve, 100));

      // add a new line at the end
      const currentValue = editor.getValue();
      editor.setValue(currentValue + "\n");

      // now loop over code characters with a slight delay - appending to whatever is currently in the editor
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
