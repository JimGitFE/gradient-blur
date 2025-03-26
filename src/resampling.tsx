/** Data Sampling (Llinearly resample avg data points to ne coords)
 * 1 sort ascending x 
 * 2 compute bins (get edges => left & right)
 * 3 aggregate bin data points (average, TODO: weighted average)
 * 4 compute interval `y` (linear interpolate aggregated data for both sides)
 * 
*///  * 2.1 downscale interpolate to intervals

// upsample via interpolation (edges: Nearest Neighbor)
// downsample aggregate (Binning) between intermediates
// resampling: new data points from existing samples new coords (involces interpolation)
/** Interpolate to intervals (at each res step, interpolate blur) */
function resampling({ intervals, points }: Props) {
   // prettier-ignore
   const targets = [0,...Array(intervals).fill(0).map((_,i)=> (100/intervals)*(i+1))];

   const polated: Point[] = []

   targets.map((targetPos, i) => {
      // When no data points between intermediates use closest
      let indx = 0
      while (indx < points.length - 1 && points[indx + 1].x < targetPos) {
         indx++
      }

      // Average of data points between intermediates (more data points between)

      // Left 
      // bin edge left (intermediate point between data points)
      const binDxLeft = targetPos - (targetPos - (targets[i - 1] ?? targetPos)) / 2 // undefined ? all Left
      // left bin
      let leftHandles = points.filter(({ x }) => x > (binDxLeft || 0) && x <= targetPos)

      if (!(leftHandles.length > 0)) leftHandles = [points[indx]]

      // bin: interval that groups data points
      // left data bin (on down-sampling )

      // aggregated data 
      const leftDataSum = leftHandles.reduce(([poss, blurs], { x, y }) => [poss + x, blurs + y], [0, 0])
      const leftDataAvg = [leftDataSum[0] / leftHandles.length, leftDataSum[1] / leftHandles.length]

      // Right
      const binDxRight = targetPos + ((targets[i + 1] ?? targetPos) - targetPos) / 2
      let rightHandles = points.filter(({ x }) => x <= (binDxRight || 100) && x > targetPos)
      if (!(rightHandles.length > 0)) rightHandles = [points[indx + 1] ?? points[indx]]
      const rightDataSum = rightHandles.reduce(([poss, blurs], { x, y }) => [poss + x, blurs + y], [0, 0])
      const rightDataAvg = [rightDataSum[0] / rightHandles.length, rightDataSum[1] / rightHandles.length]

      // linear interpolation
      const normal = (targetPos - leftDataAvg[0]) / (rightDataAvg[0] - leftDataAvg[0])
      const y = normal < 1 ? leftDataAvg[1] + normal * (rightDataAvg[1] - leftDataAvg[1]) : leftDataAvg[1]

      polated.push({ x: targetPos, y: y ?? polated[i - 1].y })
   })
   // 1 scale handles to res index
   // 2 interpolate blurs between handles
   // Down-Sampling
   console.log(polated)
   return polated
}

function avg(times: number[]) {
   const sum = times.reduce((a, b) => a + b, 0)
   return sum / times.length || 0
}

export { resampling }

// TODO: Assign Uid to each point return same data structure