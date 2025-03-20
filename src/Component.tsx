import React from "react";

interface Props {
  resolution: number;
}

function ResolutionBlur({ resolution }: Props) {
  return (
    // Contianer
    <div className="blur-container">
      {Array(resolution)
        .fill(0)
        .map((_, i) => (
          <div
            //   style={{ backdropFilter: `blur(${i * 0.5}px)` }}
            style={{
              backdropFilter: `blur(${i * 0.5}px)`,
              maskImage: `linear-gradient(to right,transparent ${
                i * (100 / resolution) - 2 // feathering: 2
              }%, black ${i * (100 / resolution)}%, black ${
                (i + 1) * (100 / resolution)
              }%, transparent ${(i + 1) * (100 / resolution) + 2}%)`,
            }}
          />
        ))}
    </div>
  );
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

export { ResolutionBlur };
