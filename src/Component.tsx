import React from "react"
import { resampling } from "./resampling"

interface Props {
   resolution: number
   handles?: Handle[]
   type?: "linear" | "radial"
}

const DEFAULT_HANDLES: Handle[] = [
   { pos: 0, blur: 10 },
   { pos: 5, blur: 30 },
   { pos: 100, blur: 100 },
]

function ResolutionBlur({ resolution, handles = DEFAULT_HANDLES, type = "linear" }: Props) {
   // polated points
   const remapped = handles.map(({ pos, blur }) => ({ x: pos, y: blur }))
   const resampled = resampling({ intervals: resolution, points: remapped }) // to intervals

   console.log(resampled)
   return (
      // Contianer
      <div className="blur-container">
         {resampled.map(({ x, y: blur }, i) => {
            // feathering: 2
            const steps = `transparent ${x - 2}%, black ${x}%, black ${resampled[i + 1]?.x ?? 100}%, transparent ${resampled[i + 1]?.x ?? 100 + 2}%`
            const linear = `linear-gradient(to right,${steps})`
            const radial = `radial-gradient(circle, ${steps})`

            console.log({ blur, linear })
            return (
               <div
                  key={i}
                  style={{
                     backdropFilter: `blur(${blur}px)`,
                     maskImage: type == "linear" ? linear : radial,
                  }}
               />
            )
         })}
      </div>
   )
}
/*
  // TODO:
  - steps [x%, blur]
  - linear gradient mask from resolution
  - remap step.x% to resolution, compute auto smoothed values for intermediate steps
  
  Entries
  - gradient
  - resolution
  - steps {pos, blur}
  
  Utils
  - remap / autosmooth to resolution intervals
  - 
  */

export { ResolutionBlur }
