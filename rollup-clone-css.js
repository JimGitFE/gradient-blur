import * as sass from "sass"
import fs from "fs"
import path from "path"

const DEFAULTS = { in: "./src", out: "./build/styles.css", cloneToIn: false }

/** Component to html utility function (extracts styles generates CSS file) */
function cloneCss(inputOptions) {
   console.log(inputOptions)
   const options = { ...DEFAULTS, ...inputOptions }
   let injectCSS = ""
   return {
      name: "clone-css",
      buildStart: async () => {
         try {
            const scssFiles = dirsAt(options.in, ".scss")

            // 1 Find all SCSS files in the src/ directory
            injectCSS = await scssFiles.reduce(async (acc, file) => {
               const result = await sass.compileAsync(file, {
                  includePaths: ["src/styles", "node_modules"],
                  outputStyle: "compressed", // or 'expanded'
               })

               // 2 Append the compiled CSSfrom Buffer to the combined string
               return acc + result.css.toString()
            }, "")

            // 3 Write the combined CSS to a single file (!needs buildStart to work)
            fs.writeFileSync(options.out, injectCSS)
            if (options.cloneToIn) {
               fs.writeFileSync(path.join(options.in, "styles.css"), injectCSS)
            }

            console.log("Compiled all SCSS files into styles.css successfully!")
         } catch (error) {
            console.error("Something went wrong in cloneCss rollup:", error)
         }
      },
      // 2️⃣  PER-FILE HOOK — replace the placeholder
      transform(code, id) {
         if (!id.endsWith(".ts") && !id.endsWith(".js")) return null

         return {
            code: code.replace(/\b__CSS__\b/g, JSON.stringify(injectCSS)),
            map: null, // keeps things fast
         }
      },
   }
}

/** Helper function to recursively find `${.ext}` files */
function dirsAt(dir, ext = ".scss") {
   let results = []
   const files = fs.readdirSync(dir)
   for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
         results = results.concat(dirsAt(filePath, ext))
      } else if (file.endsWith(ext)) {
         results.push(filePath)
      }
   }

   return results
}

export { cloneCss }
