import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import serve from "rollup-plugin-serve";
import replace from "@rollup/plugin-replace";

import pkg from "./package.json" assert { type: "json" };
import livereload from "rollup-plugin-livereload";

const isDev = process.env.NODE_ENV === "development";

export default [
  {
    input: "src/main.tsx",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify(
          isDev ? "development" : "production"
        ),
        preventAssignment: true,
      }),
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
      serve({
        open: true,
        contentBase: ["dist", "."],
        port: 3000,
      }),
      livereload({
        watch: "dist",
        port: 3000,
      }),
      json(),
    ],
    external: [],
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
