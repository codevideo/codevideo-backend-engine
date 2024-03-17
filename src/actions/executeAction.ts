import { Page } from "puppeteer";
import type monaco from "monaco-editor";
import { IAction } from "@fullstackcraftllc/codevideo-types"

export const executeAction = async (
  page: Page,
  id: number,
  action: IAction
) => {
  await page.evaluate(
    async (id, action) => {
      // WARNING - you can't refactor this const to some other function because the 'browser' can't load local typescript files of course!
      // YOU HAVE BEEN WARNED!
      const KEYBOARD_TYPING_PAUSE_MS = 75;

      let startTime = -1;
      const editor = (window as any).editor;
      // @ts-ignore
      editor.getSupportedActions().forEach((value) => {
        console.log(value);
      });

      // define the human typing here in the puppeteer environment
      const simulateHumanTyping = (
        editor: monaco.editor.IStandaloneCodeEditor,
        code: string
      ) => {
        return new Promise<void>((resolve) => {
          const characters: string[] = code.split("");
          let index: number = 0;

          function typeNextCharacter(): void {
            if (index < characters.length) {
              const char: string = characters[index];
              const selection = editor.getSelection();
              editor.executeEdits("simulateTyping", [
                {
                  range: {
                    startLineNumber: selection?.selectionStartLineNumber || 1,
                    startColumn: selection?.selectionStartColumn || 1,
                    endLineNumber: selection?.endLineNumber || 1,
                    endColumn: selection?.endColumn || 1,
                  },
                  text: char,
                  forceMoveMarkers: true,
                },
              ]);
              index++;
              setTimeout(typeNextCharacter, KEYBOARD_TYPING_PAUSE_MS);
            } else {
              resolve();
            }
          }

          typeNextCharacter();
        });
      };
      
      const simulateKeyboardPause = async () => {
        await new Promise((resolve) =>
          setTimeout(resolve, KEYBOARD_TYPING_PAUSE_MS)
        );
      }

      const highlightText = (
        editor: monaco.editor.IStandaloneCodeEditor,
        searchText: string
      ) => {
        const model = editor.getModel();

        // Find the position of the searchText in the model
        // @ts-ignore
        const searchTextPosition = model.findNextMatch(
          searchText,
          // @ts-ignore
          new monaco.Position(1, 1)
        );

        // If searchText is found
        if (searchTextPosition) {
          const line = searchTextPosition.range.startLineNumber;
          const column = searchTextPosition.range.startColumn;

          // Move the cursor to the beginning of the searchText
          editor.setPosition({ lineNumber: line, column });

          // Reveal the line in the center
          editor.revealLineInCenter(line);

          // Calculate the range of the searchText
          const searchTextLength = searchText.length;
          // @ts-ignore
          const range = new monaco.Range(
            line,
            column,
            line,
            column + searchTextLength
          );

          // Set the selection to highlight the searchText
          editor.setSelection(range);

          // Reveal the range in the center
          editor.revealRangeInCenter(range);
        }
      };

      // try to parse the 'times' value as an integer, if it fails, default to 1
      // the times doesn't always apply to some actions, so we do that action just once
      let times = parseInt(action.value) || 1;
      console.log("times", times);
      let pos;
      for (let i = 0; i < times; i++) {
        // actual logic
        switch (action.name) {
          // case "speak-before":
          //   await playAudioInPuppeteer(
          //     id,
          //     `./audio/${action.value}.mp3`
          //   );
          //   break;
          case "arrow-down":
            pos = editor.getPosition();
            // @ts-ignore
            pos.lineNumber = pos.lineNumber + 1;
            console.log("moving pos to", pos);
            editor.setPosition(pos);
            await simulateKeyboardPause();
            break;
          case "arrow-up":
            pos = editor.getPosition();
            // @ts-ignore
            pos.lineNumber = pos.lineNumber - 1;
            console.log("moving pos to", pos);
            editor.setPosition(pos);
            await simulateKeyboardPause();
            break;
          case "tab":
            pos = editor.getPosition();
            // @ts-ignore
            pos.lineNumber = pos.lineNumber + 2;
            console.log("moving pos to", pos);
            editor.setPosition(pos);
            await simulateKeyboardPause();
            break;
          case "arrow-left":
            pos = editor.getPosition();
            // @ts-ignore
            pos.column = pos.column - 1;
            console.log("moving pos to", pos);
            editor.setPosition(pos);
            await simulateKeyboardPause();
            break;
          case "arrow-right":
            pos = editor.getPosition();
            // @ts-ignore
            pos.column = pos.column + 1;
            console.log("moving pos to", pos);
            editor.setPosition(pos);
            await simulateKeyboardPause();
            break;
          case "enter":
            await simulateHumanTyping(editor, "\n");
            break;
          case "delete-line":
            console.log("deleting line");
            // @ts-ignore
            let line = editor.getPosition().lineNumber;
            editor.executeEdits("", [
              // @ts-ignore
              { range: new monaco.Range(line, 1, line + 1, 1), text: null },
            ]);
            await simulateKeyboardPause();
            break;
          case "command-right":
            // simulate moving to the end of the current line
            // @ts-ignore
            pos = editor.getPosition();
            // @ts-ignore
            pos.column = 100000;
            editor.setPosition(pos);
            await simulateKeyboardPause();
            break;
          default:
            break;
          case "highlight-code":
            highlightText(editor, action.value);
          case "space":
            await simulateHumanTyping(editor, " ");
            break;
          case "backspace":
            // @ts-ignore
            editor.trigger(monaco.KeyCode.Backspace, "deleteLeft");
            await simulateKeyboardPause();
            break;
          case "type-editor":
            await simulateHumanTyping(editor, action.value);
            break;
        }
      }
      return startTime;
    },
    id,
    action
  );
};
