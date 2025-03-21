import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.tsx",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.tsx",
    output: { file: "dist/types/types.d.ts", format: "esm" },
    plugins: [dts()],
  },
];
