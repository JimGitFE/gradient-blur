// remap from handles to points vice versa (format)
//  handles[] to Point[]

import { renderToString } from "react-dom/server"
import styles from "./styles.module.scss" // Import your SCSS module

import { ResolutionBlur } from "./Component"

// from samplingto data points
//  Point[] to Point

// TO GRAD STEPS

/** React component jsx to html string */
export function componentHTML(props: React.ComponentProps<typeof ResolutionBlur>) {
   const html = renderToString(ResolutionBlur(props))

   const css = Object.entries(styles)
      .map(([className, style]) => `.${className} { ${style} }`)
      .join("\n")

   return `
      <style>${css}</style>
      ${html}
   `
}
