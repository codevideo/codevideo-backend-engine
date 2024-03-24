import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";

export default [
  // standard package
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
    },
    plugins: [
      typescript(), 
      del({ targets: "dist/*" })
    ],
    external: [
      "fs",
      "path",
      "child_process",
      "fs/promises",
      "util",
      "say",
      "isomorphic-fetch",
      "crypto",
      "puppeteer",
      "puppeteer-screen-recorder",
      "@fullstackcraftllc/codevideo-types",
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
    external: [
      "fs",
      "path",
      "child_process",
      "fs/promises",
      "util",
      "say",
      "isomorphic-fetch",
      "crypto",
      "puppeteer",
      "puppeteer-screen-recorder",
      "@fullstackcraftllc/codevideo-types",
    ],
  },
];
