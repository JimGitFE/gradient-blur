// down scale accordignh handles to res
// llinearly resample amounts to res pos

interface Handle {
  pos: number;
  blur: number;
}

interface Props {
  resolution: number;
  handles: Handle[];
}

// resampling: new data points from existing samples
/** Interpolate to resolution (at each res step, interpolate blur) */
function interpolateHandles({ resolution, handles }: Props) {
  const blurs = Array(resolution).fill(0);
  // 1 scale handles to res index
  // 2 interpolate blurs between handles
  // Down-Sampling
  if (handles.length > resolution) {
    handles.map(({ pos, blur }, i) => {
      const idx = Math.round((pos / 100) * (resolution - 1));

      // adjacent hanldes
      const adjBlurLeft = blurs[idx - 1] || blurs[i];
      const adjBlurRight = blurs[idx + 1] || blurs[i];
      const percentage = avg([adjBlurLeft.blur, blur, adjBlurRight.blur]);
      console.log(percentage);
    });
  } else {
    // Interpolate (approximate intermediate steps)
    // on edges Nearest Neighbor Interpolation
    // Linear Interpolation (Lerp)
    blurs.map((_, i) => {
      // get handles in res step pos
      const handlesIn = handles.filter(({ pos }) => {
        const idx = Math.round((pos / 100) * (resolution - 1));
        return idx === i;
      });
      console.log(handlesIn);

      const handle = handles[i];
      if (handle) {
        blurs[i] = handle;
      }
    });
  }
}

function avg(times: number[]) {
  const sum = times.reduce((a, b) => a + b, 0);
  return sum / times.length || 0;
}

export { interpolateHandles };
