import React from "react";
import {
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";

type CharacterType = "man" | "langgraph" | "crewai" | "openai" | "barista";

const CHARACTER_CONFIG: Record<
  CharacterType,
  { color: string; glow: string; label: string; emoji: string; image?: string }
> = {
  man: {
    color: "#e0d0b0",
    glow: "#00ccff",
    label: "Human",
    emoji: "",
    image: "assets/human-character.png",
  },
  langgraph: {
    color: "#00ccff",
    glow: "#00ccff",
    label: "LangGraph",
    emoji: "🔷",
  },
  crewai: {
    color: "#ff6600",
    glow: "#ff6600",
    label: "CrewAI",
    emoji: "🚀",
  },
  openai: {
    color: "#10a37f",
    glow: "#10a37f",
    label: "OpenAI",
    emoji: "🤖",
  },
  barista: {
    color: "#888888",
    glow: "#444444",
    label: "BaristaBot",
    emoji: "🤖",
  },
};

export const Character: React.FC<{
  type: CharacterType;
  x: number;
  y: number;
  enterDelay?: number;
  frozen?: boolean;
  speaking?: boolean;
}> = ({ type, x, y, enterDelay = 0, frozen = false, speaking = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = CHARACTER_CONFIG[type];

  const isAI = type !== "man" && type !== "barista";
  const hasImage = Boolean(config.image);

  // Spring entrance
  const entranceProgress = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Hover float for AI characters only (human stays grounded)
  const floatY = isAI
    ? interpolate(Math.sin((frame + enterDelay * 3) / 20), [-1, 1], [-6, 6])
    : 0;

  // Speaking pulse
  const speakingScale = speaking
    ? interpolate(Math.sin(frame / 3), [-1, 1], [1, 1.05])
    : 1;

  // Frozen effect
  const frozenOpacity = frozen ? 0.5 : 1;

  const scale = entranceProgress * speakingScale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        ...(hasImage
          ? { bottom: y, transform: `scale(${scale})`, transformOrigin: "bottom center" }
          : { top: y + floatY, transform: `scale(${scale})` }),
        opacity: entranceProgress * frozenOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Holographic glow ring for AI */}
      {isAI && (
        <div
          style={{
            position: "absolute",
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: `2px solid ${config.glow}`,
            boxShadow: `0 0 15px ${config.glow}, 0 0 30px ${config.glow}40, inset 0 0 15px ${config.glow}20`,
            top: -5,
            opacity: interpolate(
              Math.sin(frame / 15 + enterDelay),
              [-1, 1],
              [0.5, 1]
            ),
          }}
        />
      )}

      {/* Character body */}
      {config.image ? (
        <Img
          src={staticFile(config.image)}
          style={{
            width: 750,
            height: 600,
            objectFit: "contain",
            objectPosition: "bottom center",
          }}
        />
      ) : (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: isAI ? "50%" : "40%",
            background: isAI
              ? `radial-gradient(circle at 30% 30%, ${config.color}40, ${config.color}15)`
              : `radial-gradient(circle at 30% 30%, ${config.color}, #a08060)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            border: isAI ? `1px solid ${config.color}60` : "none",
            boxShadow: isAI
              ? `0 0 20px ${config.glow}30`
              : "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {config.emoji}
        </div>
      )}

      {/* Frozen indicator */}
      {frozen && (
        <div
          style={{
            position: "absolute",
            top: 15,
            fontSize: 28,
            opacity: interpolate(Math.sin(frame / 10), [-1, 1], [0.5, 1]),
          }}
        >
          ❄️
        </div>
      )}

      {/* Name tag - hidden for image-based characters */}
      {!hasImage && (
        <div
          style={{
            marginTop: 8,
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            fontWeight: "bold",
            color: config.color,
            textShadow: isAI ? `0 0 8px ${config.glow}` : "none",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {config.label}
        </div>
      )}
    </div>
  );
};
