import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

export default [
  // output ES module
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: [
      resolve(), // resolve node_modules
      commonjs(), // convert CommonJS to ES modules
      typescript(),
      json(),
    ],
  },
  // type declarations
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "es",
      },
    ],
    plugins: [dts()],
  },
];
