import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";
import copy from 'rollup-plugin-copy';

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
      del({ targets: "dist/*" }),
      copy({
        targets: [
          // Specify the file you want to copy and where you want to copy it
          { src: './src/monaco-localhost-single-file-editor/editor.html', dest: 'dist' }
        ]
      })
    ],
    external: [
      "fs",
      "os",
      "path",
      "child_process",
      "fs/promises",
      "util",
      "say",
      "isomorphic-fetch",
      "crypto",
      "uuid",
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
      "os",
      "path",
      "child_process",
      "fs/promises",
      "util",
      "say",
      "isomorphic-fetch",
      "crypto",
      "uuid",
      "puppeteer",
      "puppeteer-screen-recorder",
      "@fullstackcraftllc/codevideo-types",
    ],
  },
];
