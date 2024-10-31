import { IAction } from "@fullstackcraftllc/codevideo-types";
import { Page } from "puppeteer";
import { wait } from "../utils/wait.js";

export const executeActionForVisualStudioCodeLocalhost = async (
  page: Page,
  id: number,
  action: IAction
) => {
  const KEYBOARD_TYPING_PAUSE_MS = 75;

  const simulateKeyboardPause = async () => {
    await wait(KEYBOARD_TYPING_PAUSE_MS);
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

  let times = parseInt(action.value) || 1;
  console.log("times", times);
  for (let i = 0; i < times; i++) {
    switch (action.name) {
      case "arrow-down":
        await simulateArrowDown();
        break;
      case "arrow-up":
        await simulateArrowUp();
        break;
      case "tab":
        await simulateTab();
        break;
      case "arrow-left":
        await simulateArrowLeft();
        break;
      case "arrow-right":
        await simulateArrowRight();
        break;
      case "enter":
        await simulateEnter();
        break;
      case "delete-line":
        console.log("deleting line");
        // Implement deleting line logic based on your specific use case
        break;
      case "command-right":
        // Simulate moving to the end of the current line
        await page.keyboard.down("Control");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.up("Control");
        await simulateKeyboardPause();
        break;
      case "highlight-code":
        await simulateHighlightText(action.value);
        break;
      case "space":
        await simulateSpace();
        break;
      case "backspace":
        await simulateBackspace();
        break;
      case "type-editor":
        await simulateTyping(action.value);
        break;
      case "click-filename":
        await clickFilename(page, action.value);
        break;
      case "click-editor":
        await clickEditor(page);
        break;
      case "open-terminal":
        await openTerminal(page);
        break;
        case "click-terminal":
        await clickTerminal(page);
        break;
      case "type-terminal":
        await simulateTyping(action.value);
        break;
      default:
        break;
    }
  }
};