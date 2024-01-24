import puppeteer, { ElementHandle, Page } from 'puppeteer';

const type = async (page: Page, text: string) => {
  await page.keyboard.type(text, { delay: 75 });
};

const issuePageCommand = async (page: Page, command: string, value: string) => {
  switch (command) {
    case 'new-file':
      await page.keyboard.down('Control');
      await page.keyboard.down('Alt');
      await page.keyboard.down('Meta');
      await page.keyboard.press('N');
      await page.keyboard.up('Control');
      await page.keyboard.up('Alt');
      await page.keyboard.up('Meta');
      break;

    case 'type-editor':
      const editorDiv = await page.waitForSelector('.view-lines.monaco-mouse-cursor-text');
      await editorDiv?.click();
      await type(page, value);
      break;

    case 'click-editor':
      const editorDivClick = await page.waitForSelector('.view-lines.monaco-mouse-cursor-text');
      await editorDivClick?.click();
      break;

    case 'execute-terminal-command':
      const terminalCanvas = await page.waitForSelector('.xterm-link-layer');
      await terminalCanvas?.click();
      await type(page, value);
      await page.keyboard.press('Enter');
      break;

    case 'click-terminal':
      const terminalClick = await page.waitForSelector('.xterm-link-layer');
      await terminalClick?.click();
      break;

    case 'open-file':
      const openFileSpan = await page.waitForXPath(`//span[@class="monaco-highlighted-label" and text()="${value}"]`) as ElementHandle<Element>;
      await openFileSpan?.click();
      break;

    case 'up-arrow':
      await page.keyboard.press('ArrowUp');
      break;

    case 'down-arrow':
      await page.keyboard.press('ArrowDown');
      break;

    case 'enter':
      await page.keyboard.press('Enter');
      break;

    default:
      throw new Error(`Unsupported command: ${command}`);
  }
};

export { issuePageCommand };
