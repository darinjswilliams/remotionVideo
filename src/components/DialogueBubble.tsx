import React from "react";
import {
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

type Speaker = "man" | "langgraph" | "crewai" | "openai" | "all";

const SPEAKER_COLORS: Record<Speaker, { bg: string; border: string; text: string }> = {
  man: { bg: "rgba(40,35,30,0.9)", border: "#e0d0b0", text: "#f0e8d8" },
  langgraph: { bg: "rgba(0,20,40,0.9)", border: "#00ccff", text: "#00ccff" },
  crewai: { bg: "rgba(40,15,0,0.9)", border: "#ff6600", text: "#ff8833" },
  openai: { bg: "rgba(5,30,25,0.9)", border: "#10a37f", text: "#10a37f" },
  all: { bg: "rgba(20,10,30,0.9)", border: "#ff00ff", text: "#ffffff" },
};

export const DialogueBubble: React.FC<{
  speaker: Speaker;
  text: string;
  startFrame: number;
  durationFrames: number;
  position: { x: number; y: number };
  typewriter?: boolean;
}> = ({ speaker, text, startFrame, durationFrames, position, typewriter = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = SPEAKER_COLORS[speaker];

  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > durationFrames) return null;

  // Entrance spring
  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // Exit fade
  const exitStart = durationFrames - 15;
  const exitOpacity =
    localFrame > exitStart
      ? interpolate(localFrame, [exitStart, durationFrames], [1, 0])
      : 1;

  // Typewriter effect
  const charsToShow = typewriter
    ? Math.floor(
        interpolate(localFrame, [0, Math.min(durationFrames * 0.6, 60)], [0, text.length], {
          extrapolateRight: "clamp",
        })
      )
    : text.length;

  const displayText = text.slice(0, charsToShow);
  const showCursor = typewriter && charsToShow < text.length;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: `scale(${entrance})`,
        opacity: entrance * exitOpacity,
        maxWidth: 420,
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}40`,
          borderRadius: 12,
          padding: "12px 18px",
          boxShadow: `0 0 15px ${colors.border}20, 0 4px 20px rgba(0,0,0,0.4)`,
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 16,
            lineHeight: 1.5,
            color: colors.text,
            textShadow: `0 0 4px ${colors.border}30`,
          }}
        >
          {displayText}
          {showCursor && (
            <span
              style={{
                opacity: Math.sin(frame / 3) > 0 ? 1 : 0,
                color: colors.border,
              }}
            >
              ▌
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
