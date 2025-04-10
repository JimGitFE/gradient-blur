import typescript from "@rollup/plugin-typescript"
import postcss from "rollup-plugin-postcss"
import del from "rollup-plugin-delete"

export default {
   input: "src/index.ts", // your main entry
   output: {
      dir: "build", // or file: 'dist/bundle.js'
      format: "esm", // or 'cjs'
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
   },
   plugins: [
      del({ targets: "build/*" }), // Delete the build folder before building
      typescript(),
      postcss({
         // Enable CSS modules and set a naming convention
         modules: true,

         // If you want to embed CSS in JS, set `inject: true`.
         // If you'd like an external .css file, use `extract: true`.
         extract: false,

         // Enable Sass
         use: {
            sass: {
               // Sass options
            },
         },
      }),
   ],
   external: ["react", "react-dom"],
}
