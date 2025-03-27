/** Data Sampling (Llinearly resample avg data points to ne coords)
 * 1 sort ascending x
 * 2 compute bins (get edges => left & right) (def: interval that groups data points)
 * 3 aggregate bin data points (average, TODO: weighted average)
 * Average for data points between intermediates (more data points between)
 * 4 compute interval `y` (linear interpolate aggregated data for both sides)
 *
 */ //  * 2.1 downscale interpolate to intervals

interface Props<O extends Point> {
   /** sampling rate / interval (low => Aliasing) */
   intervals: number
   /** Data points  */
   points: O[]
}

// upsample via interpolation (edges: Nearest Neighbor)
// downsample aggregate (Binning) between intermediates
// resampling: new data points from existing samples new coords (involces interpolation)
/** Interpolate to intervals (at each res step, interpolate blur)
 * @return `O`
 */
function resampling<O extends Point>({ intervals, points }: Props<O>): Point[] {
   // remapping intervals
   // prettier-ignore
   const targets = Array(intervals).fill(0).map((_,i)=> ((100/(intervals-1))*i) || 0)

   // 1 scale handles to res index
   // 2 interpolate blurs between handles
   // Down-Sampling
   return targets.map((targetX, i) => {
      // When no data points between intermediates use closest or clamped borders
      // Closest point to interval
      // TODO: array is sortd, do binary search instead
      let indx = 0
      while (indx < points.length - 1 && points[indx + 1].x < targetX) {
         indx++
      }

      // bin edges (intermediate point between data points)
      const binXLeft = targetX - (targetX - (targets[i - 1] ?? targetX)) / 2 // undefined ? all Left
      const binXRight = targetX + ((targets[i + 1] ?? targetX) - targetX) / 2

      // Aggregate points within the left bin
      let binAggLeft = points.filter(({ x }) => x > (binXLeft || 0) && x <= targetX)
      if (!(binAggLeft.length > 0)) binAggLeft = [points[indx]] // closets (down-sampling)
      const binAvgLeft = binAggLeft.reduce(
         ([poss, blurs], { x, y }) => [poss + x / binAggLeft.length, blurs + y / binAggLeft.length],
         [0, 0],
      )

      // Aggregate points within the right bin
      let binAggRight = points.filter(({ x }) => x <= (binXRight || 100) && x > targetX)
      if (!(binAggRight.length > 0)) binAggRight = [points[indx + 1] ?? points[indx]] // closest (down-sampling)
      const binAvgRight = binAggRight.reduce(
         ([poss, blurs], { x, y }) => [poss + x / binAggRight.length, blurs + y / binAggRight.length],
         [0, 0],
      )

      // interpolation (linear)
      const normal = (targetX - binAvgLeft[0]) / (binAvgRight[0] - binAvgLeft[0] || 1) // division by 0
      const y = normal < 1 && normal > 0 ? binAvgLeft[1] + normal * (binAvgRight[1] - binAvgLeft[1]) : binAvgLeft[1]

      return { x: targetX, y }
   })
}

export { resampling }

// TODO: Assign Uid to each point return same data structure (useful?)
// TODO: optimize Double loop inside loop (O(n × m))
