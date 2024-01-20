import { Page } from "puppeteer";

export const editReplace = async (
  page: Page,
  id: number,
  filename: string,
  script: string,
  oldCode: string,
  code: string
) => {
  await page.evaluate(
    async (id, filename, script, oldCode, code) => {
      const editor = (window as any).editor;

      // Get the current editor value
      const currentValue = editor.getValue();

      // Replace occurrences of oldCode with the new code
      const newValue = currentValue.replace(new RegExp(oldCode, "g"), code);

      // Set the updated value in the editor
      editor.setValue(newValue);
    },
    id,
    filename,
    script,
    oldCode,
    code
  );
};
