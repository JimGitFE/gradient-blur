// remap from handles to points vice versa (format)
//  handles[] to Point[]
import fs from "fs"
import path from "path"

import { renderToString } from "react-dom/server"
import styles from "./styles.module.scss" // Import your SCSS module

import { ResolutionBlur } from "./Component"

declare const __CSS__: string // put this once near the top

// from samplingto data points
//  Point[] to Point

// TO GRAD STEPS
async function loadCssAsString() {
   const res = await fetch(new URL("./styles.css", import.meta.url))
   return res.text()
}

/** React component jsx to html string */
export async function componentHTML(props: React.ComponentProps<typeof ResolutionBlur>) {
   const html = renderToString(ResolutionBlur(props))

   // Read the CSS file content
   // const cssFilePath = path.resolve(__dirname, "./styles.css") // Adjust the path as needed
   // const css = fs.readFileSync(cssFilePath, "utf-8")

   const cssString = await loadCssAsString()

   return `
         <style>${__CSS__}</style>
         <style>${styles.container}</style>
         ${html}
      `
}
