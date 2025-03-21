// sort
// down scale accordignh handles to res
// llinearly resample amounts to res pos

interface Handle {
   pos: number
   blur: number
}

interface Props {
   resolution: number
   handles: Handle[]
}

// resampling: new data points from existing samples
/** Interpolate to resolution (at each res step, interpolate blur) */
function interpolateHandles({ resolution, handles }: Props) {
   // prettier-ignore
   const targets = [0,...Array(resolution).fill(0).map((_,i)=> (100/resolution)*(i+1))];

   const polated: Handle[] = []

   targets.map((targetPos, i) => {
      // Closest match
      let indx = 0
      while (indx < handles.length - 1 && handles[indx + 1].pos < targetPos) {
         indx++
      }

      // Average for data points between targets intermediates and targetPos

      // Left
      const leftMiddlePos = targetPos - (targetPos - (targets[i - 1] ?? targetPos)) / 2 // undefined ? all Left
      let leftHandles = handles.filter(({ pos }) => pos > (leftMiddlePos || 0) && pos <= targetPos)

      if (!(leftHandles.length > 0)) leftHandles = [handles[indx]]

      const leftDataSum = leftHandles.reduce(([poss, blurs], { pos, blur }) => [poss + pos, blurs + blur], [0, 0])
      const leftDataAvg = [leftDataSum[0] / leftHandles.length, leftDataSum[1] / leftHandles.length]

      // Right
      const rightMiddlePos = targetPos + ((targets[i + 1] ?? targetPos) - targetPos) / 2
      let rightHandles = handles.filter(({ pos }) => pos <= (rightMiddlePos || 100) && pos > targetPos)
      if (!(rightHandles.length > 0)) rightHandles = [handles[indx + 1] ?? handles[indx]]
      const rightDataSum = rightHandles.reduce(([poss, blurs], { pos, blur }) => [poss + pos, blurs + blur], [0, 0])
      const rightDataAvg = [rightDataSum[0] / rightHandles.length, rightDataSum[1] / rightHandles.length]

      // linear interpolation
      const normal = (targetPos - leftDataAvg[0]) / (rightDataAvg[0] - leftDataAvg[0])
      const blur = normal < 1 ? leftDataAvg[1] + normal * (rightDataAvg[1] - leftDataAvg[1]) : leftDataAvg[1]

      polated.push({ pos: targetPos, blur: blur ?? polated[i - 1].blur })
   })
   // 1 scale handles to res index
   // 2 interpolate blurs between handles
   // Down-Sampling
   console.log(polated)
}

function avg(times: number[]) {
   const sum = times.reduce((a, b) => a + b, 0)
   return sum / times.length || 0
}

export { interpolateHandles }
