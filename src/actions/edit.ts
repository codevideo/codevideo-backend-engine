import { Page } from "puppeteer";
import type monaco from "monaco-editor";

export const edit = async (
  page: Page,
  id: number,
  filename: string,
  script: string,
  code?: string,
  oldCode?: string,
  specialCommands?: string[]
) => {
  await page.evaluate(
    async (id, filename, script, code, oldCode, specialCommands) => {
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

      // also define an 'executeMoveCommand' function here in the puppeteer environment
      const executeMoveCommand = async (
        editor: monaco.editor.IStandaloneCodeEditor,
        command: string
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
        }

        editor.setPosition(pos);
        await new Promise((resolve) => setTimeout(resolve, 500));
      };

      // before coding, conduct any moves that are needed
      if (specialCommands) {
        for (const moveCommand of specialCommands) {
          await executeMoveCommand(editor, moveCommand);
        }
      }

      
      if (code) {
        await simulateHumanTyping(editor, code);
      }
    },
    id,
    filename,
    script,
    code,
    oldCode,
    specialCommands
  );
};
