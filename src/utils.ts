// remap from handles to points vice versa (format)
//  handles[] to Point[]
import { ResolutionBlur } from "./Component"

import { renderToString } from "react-dom/server"

// from samplingto data points
//  Point[] to Point

// TO GRAD STEPS

/** React component jsx to html string */
export function componentHTML(props: React.ComponentProps<typeof ResolutionBlur>) {
   const html = renderToString(ResolutionBlur(props))
   return `${html}`
}
