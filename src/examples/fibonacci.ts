import { IAction } from "@fullstackcraftllc/codevideo-types";

const fibonacciActions: Array<IAction> = [
  {
    name: "speak-before",
    value:
      "In this quick tutorial, we'll walk through the creation of a Fibonacci calculation function in TypeScript.",
  },
  {
    name: "type-editor",
    value: "// fibonacci.ts\n",
  },
  {
    name: "speak-before",
    value:
      "We'll just leave a comment hear to signify that this file is called fibonacci.ts.",
  },
  {
    name: "speak-before",
    value:
      "Now, let's define the function signature. We want our function to calculate the nth Fibonacci number, so our function will take a single parameter 'n' of type 'number', which represents the position in the Fibonacci sequence, and also return a number.",
  },
  {
    name: "type-editor",
    value: "const fibonacci = (n: number): number => {\n\n}",
  },
  {
    name: "speak-before",
    value:
      "To help others understand our code, let's add a brief JS Doc comment explaining the purpose of the function and the meaning of the 'n' parameter.",
  },
  {
    name: "arrow-up",
    value: "2",
  },
  {
    name: "type-editor",
    value:
      "/**\n * Calculates the nth Fibonacci number.\n * @param n The position in the Fibonacci sequence.\n */\n",
  },
  {
    name: "speak-before",
    value: "Now, let's implement the Fibonacci logic inside our function.",
  },
  {
    name: "arrow-down",
    value: "1",
  },
  {
    name: "type-editor",
    value:
      "  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);",
  },
  {
    name: "speak-before",
    value:
      "This is a recursive implementation of the Fibonacci sequence. If 'n' is '0' or '1', we return 'n'. Otherwise, we recursively call the Fibonacci function for n minus 1 and n minus 2, then add them together.",
  },
  {
    name: "speak-before",
    value:
      "Now, this function would work, but it's not very performant. We can use memoization to optimize the performance of our Fibonacci function.",
  },
  {
    name: "delete-line",
    value: "1",
  },
  {
    name: "arrow-up",
    value: "1",
  },
  {
    name: "delete-line",
    value: "1",
  },
  {
    name: "enter",
    value: "1",
  },
  {
    name: "arrow-up",
    value: "1",
  },
  {
    name: "type-editor",
    value:
      "  const memo: Record<number, number> = {};\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  return memo[n] = fibonacci(n - 1) + fibonacci(n - 2);",
  },
  {
    name: "speak-before",
    value:
      "Here, we've introduced a 'memo' object to store previously calculated Fibonacci values. This reduces redundant calculations and improves the efficiency of our function. Great! We've successfully created a Fibonacci calculation function in TypeScript using a recursive approach with memoization. Until next time - cheers!",
  },
];

export default fibonacciActions;