import React from "react";
import {
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

/**
 * Animated BaristaBot that walks in from the right side,
 * delivers coffee to the table, then walks back and fades out.
 *
 * Timeline (relative to startFrame):
 *   0-20:   Barista enters from right edge
 *   20-60:  Barista walks to the table
 *   60-80:  Barista pauses at table (places coffee)
 *   80-120: Barista walks back to original position
 *   120-150: Barista fades out
 */
export const BaristaDelivery: React.FC<{
  startFrame: number;
  tableX: number;
  tableY: number;
}> = ({ startFrame, tableX, tableY }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > 150) return null;

  // Positions
  const startX = 950;  // off-screen right
  const startY = 380;  // standing height
  const deliverX = tableX + 60; // just to the right of the cup spot
  const deliverY = tableY - 30; // at table level

  // Phase 1: Enter from right (frames 0-20)
  const enterProgress = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Walk to table (frames 20-60)
  const walkToProgress = interpolate(localFrame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3: Pause at table (frames 60-80) - barista stays put

  // Phase 4: Walk back (frames 80-120)
  const walkBackProgress = interpolate(localFrame, [80, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5: Fade out (frames 120-150)
  const fadeOut = interpolate(localFrame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate current position
  let currentX: number;
  let currentY: number;

  if (localFrame <= 20) {
    // Entering from off-screen to starting visible position
    currentX = interpolate(enterProgress, [0, 1], [startX + 100, startX]);
    currentY = startY;
  } else if (localFrame <= 60) {
    // Walking to the table
    currentX = interpolate(walkToProgress, [0, 1], [startX, deliverX]);
    currentY = interpolate(walkToProgress, [0, 1], [startY, deliverY]);
  } else if (localFrame <= 80) {
    // At the table
    currentX = deliverX;
    currentY = deliverY;
  } else if (localFrame <= 120) {
    // Walking back
    currentX = interpolate(walkBackProgress, [0, 1], [deliverX, startX]);
    currentY = interpolate(walkBackProgress, [0, 1], [deliverY, startY]);
  } else {
    // Fading out at start position
    currentX = startX;
    currentY = startY;
  }

  // Bob up and down while walking
  const isWalking =
    (localFrame > 5 && localFrame < 60) ||
    (localFrame > 80 && localFrame < 120);
  const bobY = isWalking ? Math.sin(localFrame * 0.8) * 3 : 0;

  // Arm holding tray animation - arm goes down at table
  const isAtTable = localFrame >= 55 && localFrame <= 85;
  const armAngle = isAtTable
    ? interpolate(localFrame, [55, 65, 75, 85], [0, 15, 15, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Glow pulse
  const glowPulse = interpolate(
    Math.sin(localFrame / 8),
    [-1, 1],
    [0.4, 0.8]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: currentX,
        top: currentY + bobY,
        opacity: fadeOut,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 20,
      }}
    >
      {/* Holographic glow ring */}
      <div
        style={{
          position: "absolute",
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: "2px solid #888888",
          boxShadow:
            "0 0 15px #88888860, 0 0 30px #88888830, inset 0 0 15px #88888820",
          top: -5,
          opacity: glowPulse,
        }}
      />

      {/* Bot body */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(136,136,136,0.4), rgba(136,136,136,0.15))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          border: "1px solid rgba(136,136,136,0.6)",
          boxShadow: "0 0 20px rgba(136,136,136,0.3)",
        }}
      >
        🤖
      </div>

      {/* Tray / serving indicator */}
      {localFrame < 80 && (
        <div
          style={{
            marginTop: 4,
            width: 40,
            height: 6,
            borderRadius: 3,
            background: "linear-gradient(90deg, #666, #999, #666)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            transform: `rotate(${armAngle}deg)`,
          }}
        />
      )}

      {/* Label */}
      <div
        style={{
          marginTop: 6,
          fontFamily: "'Courier New', monospace",
          fontSize: 10,
          fontWeight: "bold",
          color: "#888888",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        BARISTABOT
      </div>
    </div>
  );
};
