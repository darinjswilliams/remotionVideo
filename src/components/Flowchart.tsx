import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const Flowchart: React.FC<{
  startFrame: number;
  endFrame?: number;
  x: number;
  y: number;
}> = ({ startFrame, endFrame, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  if (localFrame < 0) return null;

  // Fade out before endFrame
  let fadeOut = 1;
  if (endFrame !== undefined) {
    if (frame >= endFrame) return null;
    fadeOut = interpolate(frame, [endFrame - 15, endFrame], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const entrance = spring({ frame: localFrame, fps, config: { damping: 12 } });

  // Bright colors: neon green for nodes, orange for lines, white text
  const nodeColor = "#00ff88";
  const lineColor = "#ff9900";
  const textColor = "#ffffff";
  const nodeFill = "rgba(0,255,136,0.2)";

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
        opacity: entrance * fadeOut,
        transform: `scale(${entrance * 0.7})`,
        zIndex: 10,
      }}
    >
      <svg width={380} height={80} viewBox="-10 -50 400 100">
        {/* Glow filter */}
        <defs>
          <filter id="flowGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
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
              stroke={lineColor}
              strokeWidth={2.5}
              opacity={0.9}
              filter="url(#flowGlow)"
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
                fill={nodeFill}
                stroke={nodeColor}
                strokeWidth={1.5}
                filter="url(#flowGlow)"
              />
              <text
                x={node.cx + 30}
                y={node.cy + 4}
                fill={textColor}
                fontSize={10}
                fontFamily="Courier New"
                fontWeight="bold"
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
