import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { CreditScroll } from "../components/CreditScroll";

const AudioAny = Audio as any;

const CREDITS_DURATION = 1350; // 45 seconds at 30fps -- slow, smooth scroll

// Scene Credits: Scrolling credits over the cafe background with music
export const SceneCredits: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle star-field / particle effect behind credits
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: ((i * 137 + 50) % 1080),
    y: ((i * 97 + 20) % 720),
    size: 1 + (i % 3),
    speed: 0.3 + (i % 5) * 0.1,
    opacity: 0.2 + (i % 4) * 0.1,
  }));

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #050510 0%, #0a0a20 40%, #0d0520 100%)",
      }}
    >
      {/* Subtle ambient particles */}
      {particles.map((p, i) => {
        const drift = Math.sin(frame * 0.02 + i) * 20;
        const yPos = (p.y - frame * p.speed) % 720;
        const adjustedY = yPos < 0 ? yPos + 720 : yPos;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + drift,
              top: adjustedY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `rgba(100, 180, 255, ${p.opacity})`,
              boxShadow: `0 0 ${p.size * 3}px rgba(100, 180, 255, ${p.opacity * 0.5})`,
            }}
          />
        );
      })}

      {/* Neon border glow at top and bottom */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, #ff00ff80, #00ccff80, transparent)",
          boxShadow: "0 0 20px #ff00ff40, 0 4px 20px #00ccff30",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, #00ccff80, #ff00ff80, transparent)",
          boxShadow: "0 0 20px #00ccff40, 0 -4px 20px #ff00ff30",
        }}
      />

      {/* Credit scroll */}
      <CreditScroll totalFrames={CREDITS_DURATION} />

      {/* Background music continues playing */}
      <AudioAny
        src={staticFile("music/bossa-by-the-sea.mp3")}
        volume={0.015}
        loop
      />
    </AbsoluteFill>
  );
};
