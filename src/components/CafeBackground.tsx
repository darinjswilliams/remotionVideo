import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";

export const CafeBackground: React.FC<{
  flickering?: boolean;
}> = ({ flickering = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle neon pulse for overlay effects
  const neonPulse = interpolate(
    Math.sin(frame / (fps * 0.4)),
    [-1, 1],
    [0.7, 1]
  );

  // Flicker effect for Scene 2
  const flickerOpacity = flickering
    ? interpolate(
        Math.sin(frame * 2.5) + Math.sin(frame * 3.7),
        [-2, 2],
        [0.3, 1]
      )
    : 1;

  return (
    <AbsoluteFill>
      {/* Generated cafe background image */}
      <Img
        src={staticFile("assets/cafe-background.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          opacity: flickerOpacity,
        }}
      />

      {/* Subtle animated neon overlay for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,0,255,0.04), transparent 60%)",
          opacity: neonPulse,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(0,255,255,0.03), transparent 60%)",
          opacity: neonPulse,
        }}
      />

      {/* Slight vignette for cinematic feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
