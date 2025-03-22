import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";

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
      typescript({
        exclude: [
          "**/*.test.tsx",
          "**/*.test.ts",
          "**/*.stories.ts",
          "**/*.stories.tsx",
        ],
      }),
      postcss({
        extensions: [".css"],
        extract: false,
        inject: true,
        minimize: true,
      }),
      terser(),

      json(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.tsx",
    output: {
      file: pkg.types,
      format: "esm",
    },
    plugins: [dts()],
  },
];
