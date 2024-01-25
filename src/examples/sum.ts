import { IAction } from "../interfaces/IAction";

export const sumActions: Array<IAction> = [
  {
    name: "speak-before",
    value:
      "In this lesson, we're going to create a simple sum function in typescript.",
  },
  {
    name: "speak-before",
    value: "Let's start with the signature of the function.",
  },
  {
    name: "type-text",
    value: "const sum = (a: number, b: number) => {\n\n}",
  },
  {
    name: "speak-before",
    value: "We probably should add a short js doc comment to the function.",
  },
  {
    name: "arrow-up",
    value: "3",
  },
  {
    name: "type-text",
    value:
      "/**\n * Adds two numbers together.\n * @param a The first number to add.\n * @param b The second number to add.\n */\n",
  },
  {
    name: "arrow-down",
    value: "1",
  },
  {
    name: "speak-before",
    value:
      "Finally, we'll add the body of the function. For such a simple function, not much more discussion is needed, we just use the built in 'plus' operator to return the sum of a and b.",
  },
  {
    name: "type-text",
    value: "  return a + b;",
  },
  {
    name: "arrow-down",
    value: "1",
  },
  {
    name: "speak-before",
    value:
      "However, there is a small refactoring we can make. Since we're using an arrow function and have a single line which is our return statement, we can remove the curly braces and 'return' keyword.",
  },
  {
    name: "highlight-code",
    value: "{\n  return a + b;\n};",
  },
  {
    name: "speak-before",
    value: "Let's do the actual refactoring now.",
  },
  {
    name: "backspace",
    value: "19",
  },
  {
    name: "type-text",
    value: " a + b;",
  },
  {
    name: "speak-before",
    value:
      "This is called an implicit return. It's a nice way to make code shorter and more readable for simple functions like this one.",
  },
  {
    name: "speak-before",
    value: "And that's it! We've created a simple sum function in TypeScript. Congrats!",
  },
];
