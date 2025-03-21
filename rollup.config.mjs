import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    preserveModules: true,
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
        tsconfig: "./tsconfig.json",
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
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.tsx",
    output: { file: "dist/types.d.ts", format: "esm" },
    plugins: [dts()],
  },
];
