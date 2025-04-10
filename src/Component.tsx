import { resampling } from "./resampling"
// import "./styles.css"
import styles from "./styles.module.scss"

interface BaseProps {
   resolution: number
   handles?: Handle[]
   feather?: number | `${number}%`
   position?: `${number}% ${number}%` | `${number}%`
   scale?: `${number}% ${number}%` | `${number}%`
}

interface LinearProps extends BaseProps {
   type: "linear"
   angle?: number | `${number}deg`
}

interface RadialProps extends BaseProps {
   type: "radial"
   angle?: never
}

type Props = LinearProps | RadialProps

const DEFAULT_HANDLES: Handle[] = [
   { pos: 0, blur: 10 },
   { pos: 5, blur: 30 },
   { pos: 100, blur: 100 },
]

function ResolutionBlur({
   resolution,
   handles = DEFAULT_HANDLES,
   feather: upFeather = "120%",
   type = "linear",
   angle: upAngle = "0deg",
   position,
   scale,
}: Props) {
   // polated points
   const remapped = handles.map(({ pos, blur }) => ({ x: pos, y: blur }))
   const resampled = resampling({ intervals: resolution, points: remapped }) // to intervals

   return (
      // Contianer
      // <div className={"blur-container"}>
      <div className={styles["blur-container"]}>
         {resampled.map(({ x, y: blur }, i) => {
            // dx to closest neighbor
            const minDx = Math.min(resampled[i].x - (resampled[i - 1]?.x ?? 100), (resampled[i + 1]?.x ?? 200) - resampled[i].x)
            const feather = typeof upFeather == "string" ? (minDx * parseFloat(upFeather)) / 100 : upFeather
            const angle = typeof upAngle == "string" ? parseFloat(upAngle) : upAngle

            const steps = `transparent ${x - feather}%, black ${x}%, black ${resampled[i + 1]?.x ?? 100}%, transparent ${(resampled[i + 1]?.x ?? 100) + feather}%`
            // Gradient Patterns
            const linear = `linear-gradient(${angle}deg, ${steps})`
            const radial = `radial-gradient(circle, ${steps})`

            return (
               <div
                  key={i}
                  style={{
                     backdropFilter: `blur(${blur}px)`,
                     maskImage: type == "linear" ? linear : radial,
                     backgroundSize: scale,
                     backgroundPosition: position,
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
