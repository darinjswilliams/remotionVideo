import React from "react";
import {
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

/**
 * Holographic Projector Device
 *
 * A small glowing blue device on the table. When "pressed" (at pressFrame),
 * it emits a beam of light upward and projects four holographic AI characters
 * that rise and spread out above it.
 *
 * Props:
 *   alreadyActive  -- if true, skip the press/rise animation; holograms start in place
 *   baristaDelivery -- optional timing for BaristaBot to animate a coffee delivery
 *
 * Timeline (relative to startFrame, when NOT alreadyActive):
 *   0-pressDelay:       Device sits idle with subtle glow pulse
 *   pressDelay:         Human "presses" it -- flash + activation
 *   pressDelay+10-60:   Beam of light shoots up
 *   pressDelay+30-90:   Four holograms rise and fan out to positions
 */

type HoloTarget = {
  id: string;
  label: string;
  color: string;
  emoji: string;
  targetX: number;
  targetY: number;
  delay: number;
};

const HOLO_TARGETS: HoloTarget[] = [
  { id: "langgraph", label: "LangGraph", color: "#00ccff", emoji: "\u{1F537}", targetX: -310, targetY: -320, delay: 0 },
  { id: "crewai", label: "CrewAI", color: "#ff6600", emoji: "\u{1F680}", targetX: 220, targetY: -310, delay: 6 },
  { id: "openai", label: "OpenAI", color: "#10a37f", emoji: "\u{1F916}", targetX: -40, targetY: -380, delay: 12 },
  { id: "barista", label: "BaristaBot", color: "#888888", emoji: "\u{1F916}", targetX: 350, targetY: -260, delay: 18 },
];

export const HolographicProjector: React.FC<{
  x: number;
  y: number;
  startFrame: number;
  pressDelay?: number;
  scale?: number;
  alreadyActive?: boolean;
  baristaDelivery?: {
    startFrame: number;   // absolute frame when delivery begins
    tableX: number;       // table position (absolute, relative to viewport)
    tableY: number;
  };
}> = ({
  x,
  y,
  startFrame,
  pressDelay = 40,
  scale = 1,
  alreadyActive = false,
  baristaDelivery,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  if (localFrame < 0 && !alreadyActive) return null;

  const effectiveLocalFrame = alreadyActive ? Math.max(localFrame, 0) : localFrame;
  const isPressed = alreadyActive ? true : effectiveLocalFrame >= pressDelay;
  const pressFrame2 = alreadyActive ? 9999 : effectiveLocalFrame - pressDelay;

  // Device idle glow pulse
  const idleGlow = interpolate(
    Math.sin(effectiveLocalFrame / 12),
    [-1, 1],
    [0.4, 0.9]
  );

  // Activation flash (skip if alreadyActive)
  const activationFlash =
    !alreadyActive && isPressed
      ? interpolate(pressFrame2, [0, 5, 20], [0, 1, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  // Beam intensity
  const beamOpacity = alreadyActive
    ? 0.25
    : isPressed
    ? interpolate(pressFrame2, [5, 15, 80, 100], [0, 0.8, 0.6, 0.3], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Beam height
  const beamHeight = alreadyActive
    ? 400
    : isPressed
    ? interpolate(pressFrame2, [5, 40], [0, 400], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Press animation (device pushes down slightly)
  const pressY =
    !alreadyActive && isPressed
      ? interpolate(pressFrame2, [0, 3, 8], [0, 3, 0], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        zIndex: 15,
      }}
    >
      {/* Light beam shooting upward */}
      {isPressed && beamHeight > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 20,
            transform: "translateX(-50%)",
            width: 60,
            height: beamHeight,
            background: `linear-gradient(to top,
              rgba(0, 150, 255, ${beamOpacity}),
              rgba(0, 200, 255, ${beamOpacity * 0.5}),
              rgba(100, 200, 255, 0))`,
            filter: "blur(8px)",
            transformOrigin: "bottom center",
            zIndex: -1,
          }}
        />
      )}

      {/* Inner beam (sharper) */}
      {isPressed && beamHeight > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 20,
            transform: "translateX(-50%)",
            width: 20,
            height: beamHeight * 0.9,
            background: `linear-gradient(to top,
              rgba(100, 200, 255, ${beamOpacity * 0.8}),
              rgba(150, 220, 255, ${beamOpacity * 0.3}),
              transparent)`,
            filter: "blur(3px)",
            transformOrigin: "bottom center",
            zIndex: -1,
          }}
        />
      )}

      {/* Activation flash ring */}
      {activationFlash > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${1 + activationFlash * 3})`,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2px solid rgba(0, 180, 255, 0.8)",
            boxShadow:
              "0 0 30px rgba(0, 180, 255, 0.6), 0 0 60px rgba(0, 180, 255, 0.3)",
            opacity: activationFlash,
          }}
        />
      )}

      {/* The device itself -- glowing blue disc */}
      <svg
        width={70}
        height={40}
        viewBox="0 0 70 40"
        style={{ transform: `translateY(${pressY}px)` }}
      >
        <ellipse cx={35} cy={35} rx={28} ry={5} fill="rgba(0,0,0,0.4)" filter="url(#deviceBlur)" />
        <ellipse cx={35} cy={28} rx={25} ry={8} fill="url(#deviceBase)" stroke="rgba(0,150,255,0.5)" strokeWidth={0.8} />
        <ellipse cx={35} cy={22} rx={22} ry={6} fill="url(#deviceTop)" stroke="rgba(0,180,255,0.6)" strokeWidth={0.5} />
        <ellipse
          cx={35} cy={22} rx={8} ry={3}
          fill={`rgba(0, 200, 255, ${isPressed ? 0.9 : idleGlow * 0.6})`}
          filter="url(#crystalGlow)"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2 + effectiveLocalFrame * 0.05;
          const dotX = 35 + Math.cos(angle) * 16;
          const dotY = 22 + Math.sin(angle) * 4.5;
          const dotOpacity = isPressed
            ? 0.9
            : interpolate(Math.sin(effectiveLocalFrame / 8 + i), [-1, 1], [0.2, 0.7]);
          return (
            <circle key={`ring-${i}`} cx={dotX} cy={dotY} r={1.2} fill={`rgba(0, 200, 255, ${dotOpacity})`} />
          );
        })}
        <defs>
          <filter id="deviceBlur"><feGaussianBlur stdDeviation="3" /></filter>
          <filter id="crystalGlow"><feGaussianBlur stdDeviation="2" /></filter>
          <linearGradient id="deviceBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2a3a" />
            <stop offset="50%" stopColor="#0d1f30" />
            <stop offset="100%" stopColor="#0a1520" />
          </linearGradient>
          <radialGradient id="deviceTop" cx="40%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#1a3050" />
            <stop offset="60%" stopColor="#0d1f30" />
            <stop offset="100%" stopColor="#081018" />
          </radialGradient>
        </defs>
      </svg>

      {/* Holographic projections of AI characters */}
      {isPressed &&
        HOLO_TARGETS.map((target, idx) => {
          // ---------- rise animation ----------
          let riseProgress: number;
          if (alreadyActive) {
            riseProgress = 1; // already in final position
          } else {
            const holoFrame = pressFrame2 - 20 - target.delay;
            if (holoFrame < 0) return null;
            riseProgress = spring({
              frame: holoFrame,
              fps,
              config: { damping: 14, stiffness: 60 },
            });
          }

          // Base hologram position (relative to projector center)
          let holoX = interpolate(riseProgress, [0, 1], [0, target.targetX]);
          let holoY = interpolate(riseProgress, [0, 1], [0, target.targetY]);
          let holoScale = interpolate(riseProgress, [0, 1], [0.15, 1.3]);
          let holoOpacity = interpolate(riseProgress, [0, 0.3, 1], [0, 0.8, 0.95]);

          // ---------- BaristaBot delivery override ----------
          let isBaristaDelivering = false;
          let baristaFadedOut = false;
          if (target.id === "barista" && baristaDelivery && riseProgress >= 0.95) {
            const dFrame = frame - baristaDelivery.startFrame;
            // Delivery timeline: 0-30 move to table, 30-50 pause/place, 50-80 return, 80-110 fade out
            if (dFrame >= 0) {
              isBaristaDelivering = true;
              // The barista hologram's resting position in absolute coords
              const restAbsX = x + 35 + target.targetX;
              const restAbsY = y + 15 + target.targetY;
              // Table position (absolute viewport coords)
              const tX = baristaDelivery.tableX;
              const tY = baristaDelivery.tableY;

              if (dFrame <= 30) {
                // Move from resting to table
                const p = interpolate(dFrame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
                const eased = p * p * (3 - 2 * p); // smoothstep
                const absX = restAbsX + (tX - restAbsX) * eased;
                const absY = restAbsY + (tY - restAbsY) * eased;
                holoX = absX - x - 35;
                holoY = absY - y - 15;
                holoScale = 1.3;
              } else if (dFrame <= 50) {
                // At table (pause, placing coffee)
                holoX = tX - x - 35;
                holoY = tY - y - 15;
                holoScale = 1.3;
                // Bob down slightly to "place" coffee
                const placeP = interpolate(dFrame, [33, 40, 48], [0, 5, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                holoY += placeP;
              } else if (dFrame <= 80) {
                // Return to resting position
                const p = interpolate(dFrame, [50, 80], [0, 1], { extrapolateRight: "clamp" });
                const eased = p * p * (3 - 2 * p);
                const absX = tX + (restAbsX - tX) * eased;
                const absY = tY + (restAbsY - tY) * eased;
                holoX = absX - x - 35;
                holoY = absY - y - 15;
                holoScale = interpolate(dFrame, [50, 80], [1.3, 1.0], { extrapolateRight: "clamp" });
              } else if (dFrame <= 110) {
                // Fade out at resting position -- scale down + opacity drop
                holoX = target.targetX;
                holoY = target.targetY;
                holoScale = interpolate(dFrame, [80, 110], [1.0, 0.3], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                holoOpacity = interpolate(dFrame, [80, 110], [0.95, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
              } else {
                baristaFadedOut = true;
              }
            }
          }

          if (baristaFadedOut) return null;

          // Holographic shimmer
          const shimmer = interpolate(
            Math.sin((effectiveLocalFrame + idx * 10) / 6),
            [-1, 1],
            [0.7, 1]
          );

          // Scan line effect
          const scanLineY = ((effectiveLocalFrame + idx * 20) % 80) / 80;

          // Walking bob for barista during delivery
          const deliveryBob =
            isBaristaDelivering ? Math.sin(frame * 0.8) * 3 : 0;

          // Float animation for idle holograms
          const floatY =
            !isBaristaDelivering
              ? Math.sin((effectiveLocalFrame + idx * 30) / 20) * 4
              : 0;

          return (
            <div
              key={target.label}
              style={{
                position: "absolute",
                left: 35 + holoX,
                top: 15 + holoY + floatY + deliveryBob,
                transform: `translate(-50%, -50%) scale(${holoScale})`,
                opacity: holoOpacity * shimmer,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: target.id === "barista" && isBaristaDelivering ? 25 : 10,
              }}
            >
              {/* Connection line to projector */}
              {!isBaristaDelivering && (
                <svg
                  width={4}
                  height={Math.abs(holoY) * (alreadyActive ? 1 : riseProgress)}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "100%",
                    transform: "translateX(-50%)",
                    opacity: 0.3,
                  }}
                >
                  <line
                    x1={2}
                    y1={0}
                    x2={2}
                    y2={Math.abs(holoY) * (alreadyActive ? 1 : riseProgress)}
                    stroke={target.color}
                    strokeWidth={1}
                    strokeDasharray="3 4"
                    opacity={0.5}
                  />
                </svg>
              )}

              {/* Holographic glow ring */}
              <div
                style={{
                  position: "absolute",
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  border: `2px solid ${target.color}`,
                  boxShadow: `0 0 18px ${target.color}, 0 0 36px ${target.color}50, inset 0 0 18px ${target.color}25`,
                  top: -4,
                  left: -4,
                  opacity: shimmer,
                }}
              />

              {/* Holographic body */}
              <div
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 30% 30%, ${target.color}40, ${target.color}15)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 38,
                  border: `1.5px solid ${target.color}60`,
                  boxShadow: `0 0 25px ${target.color}35`,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {target.emoji}
                {/* Scan line overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to bottom,
                      transparent ${scanLineY * 100 - 5}%,
                      rgba(255,255,255,0.1) ${scanLineY * 100}%,
                      transparent ${scanLineY * 100 + 5}%)`,
                    borderRadius: "50%",
                  }}
                />
              </div>

              {/* Tray indicator while delivering */}
              {isBaristaDelivering && (
                <div
                  style={{
                    marginTop: 2,
                    width: 30,
                    height: 4,
                    borderRadius: 2,
                    background: "linear-gradient(90deg, #666, #aaa, #666)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                />
              )}

              {/* Label */}
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 13,
                  fontWeight: "bold",
                  color: target.color,
                  textShadow: `0 0 8px ${target.color}, 0 0 16px ${target.color}40`,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {target.label}
              </div>
            </div>
          );
        })}
    </div>
  );
};
