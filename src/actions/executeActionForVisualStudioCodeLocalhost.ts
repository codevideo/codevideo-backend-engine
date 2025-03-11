import { IAction } from "@fullstackcraftllc/codevideo-types";
import { Page } from "puppeteer";
import { wait } from "../utils/wait.js";

export const executeActionForVisualStudioCodeLocalhost = async (
  page: Page,
  id: number,
  action: IAction
) => {
  const KEYBOARD_TYPING_PAUSE_MS = 75;
  const LONGER_PAUSE_MS = 1000;

  const simulateKeyboardPause = async () => {
    await wait(KEYBOARD_TYPING_PAUSE_MS);
  };

  const simulateLongerKeyboardPause = async () => {
    await wait(LONGER_PAUSE_MS);
  };

  const simulateArrowDown = async () => {
    await page.keyboard.press("ArrowDown");
    await simulateKeyboardPause();
  };

  const simulateArrowUp = async () => {
    await page.keyboard.press("ArrowUp");
    await simulateKeyboardPause();
  };

  const simulateTab = async () => {
    await page.keyboard.press("Tab");
    await simulateKeyboardPause();
  };

  const simulateArrowLeft = async () => {
    await page.keyboard.press("ArrowLeft");
    await simulateKeyboardPause();
  };

  const simulateArrowRight = async () => {
    await page.keyboard.press("ArrowRight");
    await simulateKeyboardPause();
  };

  const simulateEnter = async () => {
    await page.keyboard.press("Enter");
    await simulateKeyboardPause();
  };

  const simulateBackspace = async () => {
    await page.keyboard.press("Backspace");
    await simulateKeyboardPause();
  };

  const simulateSpace = async () => {
    await page.keyboard.press("Space");
    await simulateKeyboardPause();
  };

  const simulateTyping = async (text: string) => {
    for (let i = 0; i < text.length; i++) {
      await page.keyboard.type(text[i], { delay: KEYBOARD_TYPING_PAUSE_MS });
    }
  };

  const simulateHighlightText = async (searchText: string) => {
    // You may need to implement text highlighting logic here based on your specific use case
    console.log("Highlighting text:", searchText);
  };

  const clickByText = async (page: Page, text: string) => {
    // Find all elements on the page
    const allElements = await page.$$("body *");

    // Iterate through each element to find the one with matching text
    for (const element of allElements) {
      const elementText = await (
        await element.getProperty("textContent")
      ).jsonValue();
      if (elementText && elementText.trim() === text) {
        await element.click();
        console.log("Clicked on the element with text:", text);
        break; // Stop iterating after clicking the first matching element
      }
    }
  };

  const clickFilename = async (page: Page, filename: string) => {
    await page.click(`div[aria-label="${filename}"]`);
    await simulateKeyboardPause();
  };

  const clickEditor = async (page: Page) => {
    // click element with class "view-lines monaco-mouse-cursor-text"
    await page.click(".view-lines");
    await simulateKeyboardPause();
  }

  const openTerminal = async (page: Page) => {
    // press control shift back tick
    await page.keyboard.down("Control");
    await page.keyboard.down("Shift");
    await page.keyboard.press("`");
    await page.keyboard.up("Control");
    await page.keyboard.up("Shift");
    await simulateKeyboardPause();
  }

  const clickTerminal = async (page: Page) => {
    // the the element with class "xterm-link-layer"
    await page.click(".xterm-link-layer");
    await simulateKeyboardPause();
  }

  const createFile = async (page: Page, filename: string) => {
    // right click within class monaco-list-rows
    await page.click(".monaco-list-rows", { button: "right" });
    await simulateLongerKeyboardPause();
    // a.action-menu-item with aria-label "New File..."
    await page.click(`span[aria-label="New File..."]`);
    await simulateLongerKeyboardPause();
    // type the filename
    await simulateTyping(filename);
    // press enter
    await simulateEnter();
  }


  let times = parseInt(action.value) || 1;
  console.log("times", times);
  for (let i = 0; i < times; i++) {
    switch (action.name) {
      case "editor-arrow-down":
        await simulateArrowDown();
        break;
      case "editor-arrow-up":
        await simulateArrowUp();
        break;
      case "editor-tab":
        await simulateTab();
        break;
      case "editor-arrow-left":
        await simulateArrowLeft();
        break;
      case "editor-arrow-right":
        await simulateArrowRight();
        break;
      case "editor-enter":
        await simulateEnter();
        break;
      case "editor-delete-line":
        console.log("deleting line");
        // Implement deleting line logic based on your specific use case
        break;
      case "editor-command-right":
        // Simulate moving to the end of the current line
        await page.keyboard.down("Control");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.up("Control");
        await simulateKeyboardPause();
        break;
      case "editor-highlight-code":
        await simulateHighlightText(action.value);
        break;
      case "editor-space":
        await simulateSpace();
        break;
      case "editor-backspace":
        await simulateBackspace();
        break;
      case "editor-type":
        await simulateTyping(action.value);
        break;
      case "mouse-click-filename":
        await clickFilename(page, action.value);
        break;
      case "mouse-click-editor":
        await clickEditor(page);
        break;
      case "terminal-open":
        await openTerminal(page);
        break;
      case "mouse-click-terminal":
        await clickTerminal(page);
        break;
      case "terminal-type":
        await simulateTyping(action.value);
        break;
      case "file-explorer-create-file":
        await createFile(page, action.value);
        break;
      default:
        break;
    }
  }
};
