// Dependencies
import typescript from "@rollup/plugin-typescript"
import postcss from "rollup-plugin-postcss"
import del from "rollup-plugin-delete"
import { string } from "rollup-plugin-string"
// Internal
import { cloneCss } from "./rollup-clone-css.js"

export default [
   {
      input: "src/index.ts", // main entry
      output: {
         dir: "build", // or file: 'dist/bundle.js'
         format: "esm", // or 'cjs'
         sourcemap: true,
         preserveModules: true,
         preserveModulesRoot: "src",
      },
      plugins: [
         del({ targets: "build/*" }), // reset build/
         string({ include: "**/*.css" }),
         cloneCss({
            in: "./src",
            out: "./build/styles.css",
            // cloneToIn: true,
         }),
         typescript(),
         postcss({
            modules: true, // CSS modules & naming convention
            // If you want to embed CSS in JS, set `inject: true`.
            extract: false, // External .css file, use `extract: true`.
         }),
         injectStringIntoCss(), // Inject string into CSS
      ],

      external: ["react", "react-dom"],
   },
]
