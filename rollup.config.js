import typescript from "@rollup/plugin-typescript"
import postcss from "rollup-plugin-postcss"
import del from "rollup-plugin-delete"
import { cloneCsslog } from "./rollup-clone-css.js"

import * as sass from "sass"
import fs from "fs"
import path from "path"

/** 2) Component to html utility function (extracts styles generates CSS file) */
function cloneCss(options = {}) {
   const hook = "buildEnd"

   return {
      name: "clone-css",

      // eslint-disable-next-line perfectionist/sort-objects
      [hook]: async () => {
         cloneCsslog(options)
         // Helper function to recursively find SCSS files
         function findScssFiles(dir) {
            let results = []
            const files = fs.readdirSync(dir)
            for (const file of files) {
               const filePath = path.join(dir, file)
               const stat = fs.statSync(filePath)

               if (stat.isDirectory()) {
                  results = results.concat(findScssFiles(filePath))
               } else if (file.endsWith(".scss")) {
                  results.push(filePath)
               }
            }

            return results
         }
         try {
            const scssFiles = findScssFiles("./src")
            console.log("SCSS files found:", scssFiles)
            let combinedCss = ""

            // Find all SCSS files in the src/ directory
            for (const file of scssFiles) {
               const result = await sass.compileAsync(file, {
                  includePaths: ["src/styles", "node_modules"],
                  outputStyle: "compressed", // or 'expanded'
               })

               // // `result.css` is a Buffer containing your compiled CSS
               // // Convert it to a string
               // Append the compiled CSS to the combined string
               combinedCss += result.css.toString()
            }

            // // Write the CSS to a file
            // Write the combined CSS to a single file
            fs.writeFileSync("build/styles.css", combinedCss)

            console.log("Compiled all SCSS files into styles.css successfully!")
         } catch (error) {
            console.error("Something went wrong in cloneCss rollup:", error)
         }
      },
   }
}

export default [
   {
      input: "src/index.ts", // your main entry
      output: {
         dir: "build", // or file: 'dist/bundle.js'
         format: "esm", // or 'cjs'
         sourcemap: true,
         preserveModules: true,
         preserveModulesRoot: "src",
         // // This JS output is usually a “throwaway” or unused,
         // // but it's required to trigger the CSS extraction
         // file: "build/bundle-for-css.js",
      },
      plugins: [
         del({ targets: "build/*" }), // Delete the build folder before building
         cloneCss({
            inputDir: "src",
            distDir: "dist",
            alsoCopyToSrc: true,
         }),
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
   },
]
