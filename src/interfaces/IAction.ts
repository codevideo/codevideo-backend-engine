
type SimpleKeyboardActions = "type-text" | "type-editor" | "type-terminal" | "arrow-up" | "arrow-down" | "arrow-left" | "arrow-right" | "enter" | "tab" | "shift+arrow-right" | "cmd+d" | "backspace" | "space";

type ComplexKeyboardActions = "highlight-code" | "delete-line";

type ClickActions = "click-terminal" | "click-editor";

type SpeakActions = "speak-before" | "speak-after" | "speak-during";

export interface IAction {
    name: SimpleKeyboardActions | ClickActions | SpeakActions | ComplexKeyboardActions;
    value: string;
}

// define a derived type SpeakAction which is an instance of IAction where the name is one of the SpeakTypes
export type SpeakAction = IAction & {
    name: SpeakActions;
};