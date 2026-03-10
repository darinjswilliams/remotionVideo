import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const Flowchart: React.FC<{
  startFrame: number;
  x: number;
  y: number;
}> = ({ startFrame, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  if (localFrame < 0) return null;

  const entrance = spring({ frame: localFrame, fps, config: { damping: 12 } });

  const nodes = [
    { label: "Request", cx: 0, cy: 0 },
    { label: "Parse", cx: 80, cy: -30 },
    { label: "Validate", cx: 160, cy: 0 },
    { label: "Brew", cx: 240, cy: -30 },
    { label: "Serve", cx: 320, cy: 0 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: entrance,
        transform: `scale(${entrance * 0.7})`,
      }}
    >
      <svg width={380} height={80} viewBox="-10 -50 400 100">
        {/* Lines */}
        {nodes.slice(0, -1).map((node, i) => {
          const next = nodes[i + 1];
          const progress = interpolate(localFrame, [i * 8, (i + 1) * 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={`line-${i}`}
              x1={node.cx + 30}
              y1={node.cy}
              x2={node.cx + 30 + (next.cx - node.cx) * progress}
              y2={node.cy + (next.cy - node.cy) * progress}
              stroke="#00ccff"
              strokeWidth={2}
              opacity={0.7}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((node, i) => {
          const show = interpolate(localFrame, [i * 6, i * 6 + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={`node-${i}`} opacity={show}>
              <rect
                x={node.cx}
                y={node.cy - 15}
                width={60}
                height={30}
                rx={6}
                fill="rgba(0,204,255,0.15)"
                stroke="#00ccff"
                strokeWidth={1}
              />
              <text
                x={node.cx + 30}
                y={node.cy + 4}
                fill="#00ccff"
                fontSize={10}
                fontFamily="Courier New"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
