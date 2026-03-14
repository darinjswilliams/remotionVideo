import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

/**
 * Two tiny hovering robots that appear near BaristaBot.
 * They float around randomly and can fade out at a specified frame.
 *
 * Props:
 *   x, y        -- center position (absolute viewport coords)
 *   appearFrame -- frame when robots fade in
 *   fadeFrame   -- frame when robots start fading out (optional)
 *   fadeDuration -- how many frames the fade-out takes (default 30)
 */
export const TinyRobots: React.FC<{
  x: number;
  y: number;
  appearFrame: number;
  fadeFrame?: number;
  fadeDuration?: number;
}> = ({ x, y, appearFrame, fadeFrame, fadeDuration = 30 }) => {
  const frame = useCurrentFrame();

  // Not yet visible
  if (frame < appearFrame) return null;

  // Fully faded out
  if (fadeFrame !== undefined && frame >= fadeFrame + fadeDuration) return null;

  // Fade in over 20 frames
  const fadeIn = interpolate(frame, [appearFrame, appearFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out
  let fadeOut = 1;
  if (fadeFrame !== undefined) {
    fadeOut = interpolate(frame, [fadeFrame, fadeFrame + fadeDuration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const opacity = fadeIn * fadeOut;

  // Two robots with different hover patterns
  const robots = [
    {
      // Robot 1: hovers upper-left of center, figure-8 pattern
      offsetX: -25 + Math.sin(frame * 0.12) * 15 + Math.cos(frame * 0.07) * 8,
      offsetY: -20 + Math.cos(frame * 0.1) * 12 + Math.sin(frame * 0.15) * 5,
      size: 16,
      color: "#ff9900",
      bodyColor: "#cc7700",
    },
    {
      // Robot 2: hovers lower-right, circular orbit
      offsetX: 20 + Math.cos(frame * 0.09) * 18 + Math.sin(frame * 0.13) * 6,
      offsetY: -10 + Math.sin(frame * 0.11) * 14 + Math.cos(frame * 0.06) * 8,
      size: 14,
      color: "#00ddff",
      bodyColor: "#0099bb",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        zIndex: 16,
        pointerEvents: "none",
      }}
    >
      {robots.map((bot, i) => {
        // Propeller spin
        const propAngle = (frame * 12 + i * 180) % 360;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: bot.offsetX,
              top: bot.offsetY,
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg width={bot.size * 2} height={bot.size * 2.2} viewBox="0 0 32 36">
              {/* Glow filter */}
              <defs>
                <filter id={`tinyGlow${i}`}>
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Propeller */}
              <g transform={`translate(16, 6) rotate(${propAngle})`}>
                <rect
                  x={-8}
                  y={-1}
                  width={16}
                  height={2}
                  rx={1}
                  fill={`${bot.color}90`}
                  filter={`url(#tinyGlow${i})`}
                />
              </g>

              {/* Propeller hub */}
              <circle cx={16} cy={6} r={2} fill={bot.color} />

              {/* Body */}
              <rect
                x={10}
                y={8}
                width={12}
                height={10}
                rx={3}
                fill={bot.bodyColor}
                stroke={bot.color}
                strokeWidth={0.8}
                filter={`url(#tinyGlow${i})`}
              />

              {/* Eyes */}
              <circle cx={13} cy={13} r={1.5} fill={bot.color} />
              <circle cx={19} cy={13} r={1.5} fill={bot.color} />

              {/* Antenna */}
              <line
                x1={16}
                y1={8}
                x2={16}
                y2={4}
                stroke={bot.color}
                strokeWidth={0.8}
              />

              {/* Thruster glow */}
              <ellipse
                cx={16}
                cy={20}
                rx={4}
                ry={2}
                fill={`${bot.color}40`}
                filter={`url(#tinyGlow${i})`}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
