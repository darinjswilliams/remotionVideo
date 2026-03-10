import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { CafeBackground } from "../components/CafeBackground";
import { Character } from "../components/Character";
import { DialogueBubble } from "../components/DialogueBubble";
import { CappuccinoReveal } from "../components/CappuccinoReveal";
import { HolographicProjector } from "../components/HolographicProjector";
import { CafeTable } from "../components/CafeTable";
import { SceneAudio } from "../components/SceneAudio";

// Scene 2: "Unexpected Connection" -- 900 frames
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flickering for first portion
  const isFlickering = frame < 120;

  return (
    <AbsoluteFill>
      <CafeBackground flickering={isFlickering} />

      {/* System glitch overlay */}
      {isFlickering && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(255,0,0,${interpolate(
              Math.random(),
              [0, 1],
              [0, 0.03]
            )})`,
            zIndex: 5,
          }}
        />
      )}

      {/* Glitch text */}
      <Sequence from={20} durationInFrames={80}>
        <div
          style={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: `translateX(-50%) skewX(${
              Math.sin(frame * 2) * 3
            }deg)`,
            fontFamily: "'Courier New', monospace",
            fontSize: 20,
            color: "#ff0040",
            textShadow: "0 0 10px #ff004080, 2px 0 #00ffff, -2px 0 #ff00ff",
            letterSpacing: 4,
            opacity: interpolate(Math.sin(frame), [-1, 1], [0.5, 1]),
          }}
        >
          {"⚡ SYSTEM GLITCH DETECTED ⚡"}
        </div>
      </Sequence>

      {/* Human character */}
      <Character type="man" x={120} y={-10} enterDelay={0} speaking={frame > 310 && frame < 420} />

      {/* Circular cafe table near human's left hand */}
      <CafeTable x={500} y={555} radius={65} />

      {/* Holographic projector -- already active from Scene 1.
          BaristaBot delivers coffee at frame 660 to the table. */}
      <HolographicProjector
        x={470}
        y={530}
        startFrame={0}
        alreadyActive={true}
        scale={1.0}
        baristaDelivery={{
          startFrame: 660,
          tableX: 460,
          tableY: 510,
        }}
      />

      {/* CrewAI panic */}
      <DialogueBubble
        speaker="crewai"
        text={"Team coordination failure detected."}
        startFrame={130}
        durationFrames={80}
        position={{ x: 580, y: 200 }}
      />

      {/* LangGraph diagnosis */}
      <DialogueBubble
        speaker="langgraph"
        text={"Re-routing decision nodes."}
        startFrame={220}
        durationFrames={70}
        position={{ x: 60, y: 200 }}
      />

      {/* OpenAI suggestion */}
      <DialogueBubble
        speaker="openai"
        text={"Suggest adaptive reasoning under uncertainty."}
        startFrame={300}
        durationFrames={80}
        position={{ x: 300, y: 100 }}
      />

      {/* The man's key line */}
      <DialogueBubble
        speaker="man"
        text={"Why don't you just... talk to each other?"}
        startFrame={400}
        durationFrames={120}
        position={{ x: 340, y: 450 }}
      />

      {/* Dramatic pause -- all AIs "thinking" */}
      <Sequence from={530} durationInFrames={60}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "40%",
            transform: "translate(-50%, -50%)",
            fontFamily: "'Courier New', monospace",
            fontSize: 24,
            color: "#ffffff40",
            textAlign: "center",
            opacity: interpolate(frame - 530, [0, 30, 60], [0, 1, 0]),
          }}
        >
          . . . processing . . .
        </div>
      </Sequence>

      {/* Reorganization visuals */}
      <Sequence from={600} durationInFrames={100}>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 350,
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            color: "#00ccff",
            opacity: interpolate(frame - 600, [0, 20], [0, 0.8], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {"↻ Workflow restructured"}
        </div>
      </Sequence>

      <Sequence from={620} durationInFrames={100}>
        <div
          style={{
            position: "absolute",
            right: 100,
            top: 340,
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            color: "#ff6600",
            opacity: interpolate(frame - 620, [0, 20], [0, 0.8], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {"✓ Agents realigned"}
        </div>
      </Sequence>

      <Sequence from={640} durationInFrames={100}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 120,
            transform: "translateX(-50%)",
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            color: "#10a37f",
            opacity: interpolate(frame - 640, [0, 20], [0, 0.8], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {"✓ Output simplified"}
        </div>
      </Sequence>

      {/* Espresso appears on the circular table when BaristaBot reaches it */}
      <Sequence from={690}>
        <CappuccinoReveal
          startFrame={0}
          x={415}
          y={490}
          cupScale={0.45}
        />
      </Sequence>

      {/* Man thanks BaristaBot after coffee is placed */}
      <DialogueBubble
        speaker="man"
        text={"\"Thank you! For keeping Humans in the Loop.\""}
        startFrame={730}
        durationFrames={100}
        position={{ x: 340, y: 440 }}
      />

      {/* ========== Audio ========== */}
      <SceneAudio
        voiceLines={[
          { file: "s2-crewai.mp3", startFrame: 130 },
          { file: "s2-langgraph.mp3", startFrame: 220 },
          { file: "s2-openai.mp3", startFrame: 300 },
          { file: "s2-man.mp3", startFrame: 400 },
          { file: "s2-man-thanks.mp3", startFrame: 730 },
        ]}
      />

      {/* Foam art text */}
      <Sequence from={790} durationInFrames={110}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 80,
            transform: "translateX(-50%)",
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            fontWeight: "bold",
            color: "#ff00ff",
            textShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff60",
            textAlign: "center",
            letterSpacing: 3,
            opacity: interpolate(frame - 760, [0, 30], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {"Collaboration > Complexity"}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
