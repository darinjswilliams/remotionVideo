import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const CappuccinoReveal: React.FC<{
  startFrame: number;
  foamText?: string;
  x?: number;
  y?: number;
  cupScale?: number;
}> = ({ startFrame, foamText, x = 480, y = 520, cupScale = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  if (localFrame < 0) return null;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Steam animation
  const steamPhase = localFrame / 10;

  // Foam art fade in
  const foamOpacity = interpolate(localFrame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${entrance * cupScale})`,
        transformOrigin: "bottom center",
        opacity: entrance,
        zIndex: 20,
      }}
    >
      {/* Shadow on table */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 14,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.4)",
          filter: "blur(6px)",
        }}
      />

      {/* Steam wisps */}
      <svg
        width={90}
        height={60}
        viewBox="0 0 90 60"
        style={{
          position: "absolute",
          top: -55,
          left: -5,
          opacity: interpolate(localFrame, [0, 30], [0, 0.6], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        {[0, 1, 2].map((i) => {
          const xOffset = 20 + i * 20;
          const phase = steamPhase + i * 2;
          const waveX = Math.sin(phase) * 6;
          const rise = interpolate(
            (localFrame + i * 10) % 60,
            [0, 60],
            [50, 0]
          );
          const fadeOut = interpolate(rise, [0, 10, 50], [0, 0.5, 0]);
          return (
            <path
              key={`steam-${i}`}
              d={`M${xOffset + waveX},${rise} Q${xOffset + waveX + 5},${rise - 8} ${xOffset + waveX - 3},${rise - 16} Q${xOffset + waveX + 4},${rise - 24} ${xOffset + waveX + 1},${rise - 30}`}
              fill="none"
              stroke="rgba(200,210,220,0.5)"
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={fadeOut}
            />
          );
        })}
      </svg>

      {/* Espresso cup - SVG for clean rendering */}
      <svg width={90} height={70} viewBox="0 0 90 70">
        {/* Saucer */}
        <ellipse
          cx={45}
          cy={62}
          rx={42}
          ry={7}
          fill="url(#saucerGrad)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.5}
        />

        {/* Cup body */}
        <path
          d="M15,20 L15,46 Q15,58 30,58 L60,58 Q75,58 75,46 L75,20 Z"
          fill="url(#cupGrad)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={0.5}
        />

        {/* Cup rim highlight */}
        <ellipse
          cx={45}
          cy={20}
          rx={30}
          ry={5}
          fill="url(#rimGrad)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={0.5}
        />

        {/* Crema / coffee surface */}
        <ellipse
          cx={45}
          cy={22}
          rx={27}
          ry={4}
          fill="url(#cremaGrad)"
        />

        {/* Handle */}
        <path
          d="M75,28 Q90,28 90,40 Q90,52 75,52"
          fill="none"
          stroke="url(#handleGrad)"
          strokeWidth={3.5}
          strokeLinecap="round"
        />

        {/* Foam art heart pattern */}
        <g opacity={foamOpacity}>
          <path
            d="M40,22 Q42,19 45,22 Q48,19 50,22 Q50,25 45,28 Q40,25 40,22"
            fill="rgba(255,248,230,0.6)"
            stroke="rgba(180,140,80,0.3)"
            strokeWidth={0.3}
          />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5f5f0" />
            <stop offset="30%" stopColor="#e8e4dc" />
            <stop offset="100%" stopColor="#c8c0b4" />
          </linearGradient>
          <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0dcd4" />
          </linearGradient>
          <radialGradient id="cremaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c8956a" />
            <stop offset="50%" stopColor="#a0703c" />
            <stop offset="100%" stopColor="#6e4420" />
          </radialGradient>
          <linearGradient id="saucerGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8e4dc" />
            <stop offset="50%" stopColor="#d0ccc4" />
            <stop offset="100%" stopColor="#b8b0a8" />
          </linearGradient>
          <linearGradient id="handleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8e4dc" />
            <stop offset="100%" stopColor="#c0b8ac" />
          </linearGradient>
        </defs>
      </svg>

      {/* Foam art text label (appears below the cup) */}
      {foamText && (
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Courier New', monospace",
            fontSize: 10,
            color: "#d4a574",
            textShadow: "0 0 6px rgba(212,165,116,0.4)",
            whiteSpace: "nowrap",
            opacity: foamOpacity,
            letterSpacing: 1,
          }}
        >
          {foamText}
        </div>
      )}
    </div>
  );
};
