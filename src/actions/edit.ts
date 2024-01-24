import { Page } from "puppeteer";
import type monaco from "monaco-editor";

export const edit = async (
  page: Page,
  code?: string,
  specialCommands?: string[]
) => {
  await page.evaluate(
    async (code, specialCommands) => {
      const editor = (window as any).editor;

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
              setTimeout(typeNextCharacter, 75);
            } else {
              resolve();
            }
          }

          typeNextCharacter();
        });
      };

      const highlightText = 
      (editor: monaco.editor.IStandaloneCodeEditor,
         searchText: string) => {
        const model = editor.getModel();
      
        // Find the position of the searchText in the model
            // @ts-ignore
        const searchTextPosition = model.findNextMatch(searchText, new monaco.Position(1, 1));
      
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
          const range = new monaco.Range(line, column, line, column + searchTextLength);
      
          // Set the selection to highlight the searchText
          editor.setSelection(range);
      
          // Reveal the range in the center
          editor.revealRangeInCenter(range);
        }
      }

      // also define an 'executeMoveCommand' function here in the puppeteer environment
      const executeSpecialCommand = async (
        editor: monaco.editor.IStandaloneCodeEditor,
        command: string,
        code: string
      ) => {
        let pos: any = editor.getPosition();
        if (!pos) {
          return;
        }
        switch (command) {
          case "down":
            console.log("moving down");
            pos.lineNumber = pos.lineNumber + 1;
            break;
          case "up":
            console.log("moving up");
            pos.lineNumber = pos.lineNumber - 1;
            break;
          case "tab":
            pos.column = pos.column + 2;
            break;
          case "left":
            pos.column = pos.column - 1;
            break;
          case "right":
            pos.column = pos.column + 1;
            break;
          case "enter":
            await simulateHumanTyping(editor, "\n");
            break;
          case "delete-line":
            console.log("deleting line");
            // @ts-ignore
            let line = editor.getPosition().lineNumber;
            // @ts-ignore
            editor.executeEdits('', [{ range: new monaco.Range(line, 1, line + 1, 1), text: null }]);
            break;
          default:
            break;
          case "highligh-text":
            highlightText(editor, code)
            break;
        }

        editor.setPosition(pos);
        await new Promise((resolve) => setTimeout(resolve, 500));
      };

      // before coding, conduct any moves that are needed
      if (specialCommands) {
        for (const moveCommand of specialCommands) {
          await executeSpecialCommand(editor, moveCommand, code || "");
        }
      }

      
      if (code) {
        await simulateHumanTyping(editor, code);
      }
    },
    code,
    specialCommands
  );
};
