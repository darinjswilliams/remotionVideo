import React from "react";

/**
 * Circular cafe table matching the background tables:
 *  - Dark wood surface with light tan/beige edge (from overhead spotlight)
 *  - Single center pedestal with circular base
 *  - Drawn as an ellipse in slight perspective
 *  - Colors sampled from the background image tables
 */
export const CafeTable: React.FC<{
  x: number;
  y: number;
  radius?: number;
}> = ({ x, y, radius = 75 }) => {
  // Perspective: the table is viewed from slightly above,
  // so it appears as an ellipse (wider than tall)
  const rx = radius;           // horizontal radius
  const ry = radius * 0.35;    // vertical radius (perspective squash)
  const thickness = 6;         // visible edge thickness
  const pedestalW = 8;
  const pedestalH = 155;
  const baseRx = 24;
  const baseRy = 8;

  const svgW = rx * 2 + 30;
  const svgH = ry * 2 + thickness + pedestalH + baseRy + 20;
  const cx = svgW / 2;
  const surfaceY = ry + 10;

  return (
    <div
      style={{
        position: "absolute",
        left: x - svgW / 2,
        top: y - surfaceY,
        zIndex: 12,
        pointerEvents: "none",
      }}
    >
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        <defs>
          {/* Dark wood surface -- matches background tables */}
          <radialGradient id="cTblSurf" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#2a2218" />
            <stop offset="50%" stopColor="#1e1812" />
            <stop offset="100%" stopColor="#14100c" />
          </radialGradient>

          {/* Edge rim -- the tan/beige highlight from overhead light */}
          <linearGradient id="cTblRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a08b6e" />
            <stop offset="50%" stopColor="#b89c7a" />
            <stop offset="100%" stopColor="#7a6a55" />
          </linearGradient>

          {/* Pedestal metal */}
          <linearGradient id="cTblPed" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#111111" />
            <stop offset="40%" stopColor="#2a2a2a" />
            <stop offset="60%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#111111" />
          </linearGradient>

          {/* Spotlight reflection on surface */}
          <radialGradient id="cTblLight" cx="40%" cy="35%" r="40%">
            <stop offset="0%" stopColor="rgba(220,200,170,0.10)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Neon ambient (purple/blue from neon signs) */}
          <radialGradient id="cTblNeon" cx="60%" cy="55%" r="50%">
            <stop offset="0%" stopColor="rgba(120,80,180,0.05)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          <filter id="cTblShadow"><feGaussianBlur stdDeviation="4" /></filter>
        </defs>

        {/* Floor shadow */}
        <ellipse
          cx={cx}
          cy={surfaceY + thickness + pedestalH + baseRy + 4}
          rx={baseRx + 8}
          ry={5}
          fill="rgba(0,0,0,0.3)"
          filter="url(#cTblShadow)"
        />

        {/* Pedestal leg */}
        <rect
          x={cx - pedestalW / 2}
          y={surfaceY + thickness}
          width={pedestalW}
          height={pedestalH}
          rx={2}
          fill="url(#cTblPed)"
        />

        {/* Pedestal highlight strip */}
        <rect
          x={cx - 1}
          y={surfaceY + thickness + 4}
          width={2}
          height={pedestalH - 8}
          rx={1}
          fill="rgba(255,255,255,0.05)"
        />

        {/* Base plate */}
        <ellipse
          cx={cx}
          cy={surfaceY + thickness + pedestalH + 2}
          rx={baseRx}
          ry={baseRy}
          fill="#1a1a1a"
          stroke="rgba(60,60,60,0.3)"
          strokeWidth={0.5}
        />

        {/* Visible edge / rim (the thickness below the surface) */}
        <ellipse
          cx={cx}
          cy={surfaceY + thickness / 2 + 1}
          rx={rx}
          ry={ry}
          fill="url(#cTblRim)"
          opacity={0.7}
        />

        {/* Table surface (top) */}
        <ellipse
          cx={cx}
          cy={surfaceY}
          rx={rx}
          ry={ry}
          fill="url(#cTblSurf)"
        />

        {/* Tan/beige edge highlight ring */}
        <ellipse
          cx={cx}
          cy={surfaceY}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="#b89c7a"
          strokeWidth={2}
          opacity={0.5}
        />

        {/* Spotlight reflection */}
        <ellipse
          cx={cx}
          cy={surfaceY}
          rx={rx}
          ry={ry}
          fill="url(#cTblLight)"
        />

        {/* Neon ambient tint */}
        <ellipse
          cx={cx}
          cy={surfaceY}
          rx={rx}
          ry={ry}
          fill="url(#cTblNeon)"
        />
      </svg>
    </div>
  );
};
