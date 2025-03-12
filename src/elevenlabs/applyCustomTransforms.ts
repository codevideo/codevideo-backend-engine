import { customTransforms } from "./customTransforms";

export const applyCustomTransforms = (textToSpeak: string): string => {
    // apply custom transforms to the text
    for (const key in customTransforms) {
        if (textToSpeak.includes(key)) {
            textToSpeak = textToSpeak.replace(
                new RegExp(key, "g"),
                customTransforms[key]
            );
        }
    }
    return textToSpeak;
}