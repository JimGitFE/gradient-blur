import React from "react"
import { resampling } from "./resampling"

interface Props {
   resolution: number
}

function ResolutionBlur({ resolution }: Props) {
   console.log("asd sampeing ")
   // polated points
   const points = resampling({
      intervals: resolution,
      points: [
         { x: 0, y: 0 },
         { x: 100, y: 100 },
      ],
   })
   console.log(points)
   return (
      // Contianer
      <div className="blur-container">
         {Array(resolution)
            .fill(0)
            .map((_, i) => {
               const steps = `${
                  i * (100 / resolution) - 2 // feathering: 2
               }%, black ${i * (100 / resolution)}%, black ${
                  (i + 1) * (100 / resolution)
               }%, transparent ${(i + 1) * (100 / resolution) + 2}%`
               const linear = `linear-gradient(to right,${steps})`
               // const radial = `radial-gradient(circle, ${steps})`;

               return (
                  <div
                     //   style={{ backdropFilter: `blur(${i * 0.5}px)` }}
                     style={{
                        backdropFilter: `blur(${i * 0.5}px)`,
                        maskImage: linear,
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
