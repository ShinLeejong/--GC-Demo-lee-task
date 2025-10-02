import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
// terser는 선택
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/limejs.umd.js",
    format: "umd",
    name: "limejs", // window.limejs
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      clean: true
    }),
    terser()
  ]
};
