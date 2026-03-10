import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

export const TitleCard: React.FC<{
  text: string;
  subtitle?: string;
}> = ({ text, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const glowPulse = interpolate(Math.sin(frame / 20), [-1, 1], [0.6, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.85)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          transform: `scale(${entrance})`,
          opacity: entrance,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 32,
            fontWeight: "bold",
            color: "#ff00ff",
            textShadow: `0 0 10px #ff00ff, 0 0 30px #ff00ff60`,
            letterSpacing: 3,
            opacity: glowPulse,
            marginBottom: 20,
          }}
        >
          {text}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 18,
              color: "#00ccff",
              textShadow: `0 0 8px #00ccff60`,
              letterSpacing: 2,
              opacity: interpolate(frame, [15, 30], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
