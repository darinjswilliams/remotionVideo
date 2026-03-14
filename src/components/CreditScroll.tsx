import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

/**
 * CreditScroll -- Scrolls credit text smoothly upward from below the
 * viewport to above the viewport, like movie end credits.
 *
 * The text starts fully below the screen and travels upward at a
 * constant speed until it has completely rolled off the top.
 */

const CREDITS = [
  { type: "heading", text: "Espresso Yourself -- Characters" },
  { type: "blank", text: "" },
  {
    type: "character",
    text: "LangGraph -- Great for workflow",
  },
  { type: "blank", text: "" },
  {
    type: "character",
    text: "OpenAI -- Easy to validate and integrate with other frameworks",
  },
  { type: "blank", text: "" },
  {
    type: "character",
    text: "CrewAI -- Agents have personality by design",
  },
  { type: "blank", text: "" },
  { type: "blank", text: "" },
  { type: "heading", text: "Cappuccino Lesson" },
  { type: "blank", text: "" },
  {
    type: "lesson",
    text: "1. Don't over-engineer simple problems with AI agents.",
  },
  { type: "blank", text: "" },
  {
    type: "lesson",
    text: "2. AI agents don't inherently remember things. State persistence is a design choice, not automatic. Memory and state management are real challenges.",
  },
  { type: "blank", text: "" },
  {
    type: "lesson",
    text: "3. AI works best when humans provide direction and intent.",
  },
  { type: "blank", text: "" },
  {
    type: "lesson",
    text: "4. MCP and A2A are the emerging interoperability standards.",
  },
  { type: "blank", text: "" },
  {
    type: "lesson",
    text: "5. Collaboration beats complexity -- not through more sophisticated AI, but through agents simply communicating with each other when prompted by the human.",
  },
  { type: "blank", text: "" },
  {
    type: "lesson",
    text: "6. AI agents are tools, not replacements.",
  },
  { type: "blank", text: "" },
  {
    type: "lesson",
    text: "7. Even AI has limits -- and that's okay. They're powerful, but not omniscient.",
  },
  { type: "blank", text: "" },
  { type: "blank", text: "" },
  { type: "blank", text: "" },
  { type: "creator", text: "Created by Autonami AI LLC" },
];

export const CreditScroll: React.FC<{
  totalFrames: number;
}> = ({ totalFrames }) => {
  const frame = useCurrentFrame();

  // Estimate content height for scroll math
  const estimatedContentHeight = CREDITS.reduce((sum, line) => {
    if (line.type === "blank") return sum + 28;
    if (line.type === "heading") return sum + 75;
    if (line.type === "creator") return sum + 80;
    if (line.type === "character") return sum + 55;
    return sum + 60; // lessons with larger font
  }, 0);

  const viewportHeight = 720;

  // Scroll: start below viewport, end above viewport
  const scrollY = interpolate(
    frame,
    [0, totalFrames],
    [viewportHeight, -estimatedContentHeight - 100],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        right: 100,
        top: scrollY,
        fontFamily: "'Courier New', monospace",
        zIndex: 70,
      }}
    >
      {CREDITS.map((line, i) => {
        if (line.type === "blank") {
          return <div key={i} style={{ height: 28 }} />;
        }

        if (line.type === "heading") {
          return (
            <div
              key={i}
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#ff00ff",
                textShadow:
                  "0 0 12px #ff00ff, 0 0 24px #ff00ff60",
                letterSpacing: 3,
                marginBottom: 12,
                lineHeight: 1.4,
                textAlign: "center",
              }}
            >
              {line.text}
            </div>
          );
        }

        if (line.type === "character") {
          return (
            <div
              key={i}
              style={{
                fontSize: 22,
                color: "#00ccff",
                textShadow: "0 0 8px #00ccff60",
                letterSpacing: 1,
                marginBottom: 8,
                lineHeight: 1.5,
                textAlign: "left",
              }}
            >
              {line.text}
            </div>
          );
        }

        if (line.type === "creator") {
          return (
            <div
              key={i}
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#ffffff",
                textShadow:
                  "0 0 10px #ffffff80, 0 0 20px #ff00ff40",
                letterSpacing: 2,
                marginTop: 20,
                lineHeight: 1.4,
                textAlign: "center",
              }}
            >
              {line.text}
            </div>
          );
        }

        // lesson -- left-aligned, larger font, brighter color
        return (
          <div
            key={i}
            style={{
              fontSize: 20,
              color: "#e0eeff",
              textShadow: "0 0 6px #00ccff40",
              letterSpacing: 0.5,
              marginBottom: 8,
              lineHeight: 1.6,
              textAlign: "left",
            }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
};
