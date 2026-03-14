import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CafeBackground } from "../components/CafeBackground";
import { Character } from "../components/Character";
import { DialogueBubble } from "../components/DialogueBubble";
import { Flowchart } from "../components/Flowchart";
import { TitleCard } from "../components/TitleCard";
import { HolographicProjector } from "../components/HolographicProjector";
import { CafeTable } from "../components/CafeTable";
import { SceneAudio } from "../components/SceneAudio";
import { TinyRobots } from "../components/TinyRobots";

// Scene 1: "Ordering the Impossible" -- 30 seconds at 30fps = 900 frames
export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <CafeBackground />

      {/* Human character -- alone at the table initially */}
      <Character type="man" x={120} y={-10} enterDelay={0} speaking={frame > 30 && frame < 150} />

      {/* Circular cafe table near human's left hand */}
      <CafeTable x={500} y={555} radius={65} />

      {/* Holographic projector disc sits on the circular table.
          Appears at frame 5. Human presses it at frame 30 (pressDelay=25).
          Four AI characters project upward from the disc. */}
      <HolographicProjector
        x={470}
        y={530}
        startFrame={5}
        pressDelay={25}
        scale={1.0}
      />

      {/* Two tiny robots appear when CrewAI mentions assembling a team.
          They hover near BaristaBot and persist through end of Scene 1. */}
      <TinyRobots x={840} y={270} appearFrame={280} />

      {/* ========== Dialogue sequence ========== */}

      {/* Man orders */}
      <DialogueBubble
        speaker="man"
        text={"\"Can I get a triple-shot, oat milk, low-latency, hallucination-free cappuccino?\""}
        startFrame={40}
        durationFrames={120}
        position={{ x: 350, y: 440 }}
      />

      {/* LangGraph responds (projected hologram) */}
      <DialogueBubble
        speaker="langgraph"
        text={"Mapping request to structured workflow..."}
        startFrame={170}
        durationFrames={90}
        position={{ x: 60, y: 200 }}
      />

      {/* CrewAI responds (projected hologram) */}
      <DialogueBubble
        speaker="crewai"
        text={"I'll assemble a team: BaristaBot, MilkOptimizer, and FoamStrategist!"}
        startFrame={280}
        durationFrames={100}
        position={{ x: 580, y: 200 }}
      />

      {/* OpenAI responds (projected hologram) */}
      <DialogueBubble
        speaker="openai"
        text={"Analyzing beverage preferences based on historical caffeine behavior."}
        startFrame={400}
        durationFrames={100}
        position={{ x: 300, y: 100 }}
      />

      {/* Man's deadpan response */}
      <DialogueBubble
        speaker="man"
        text={"\"...I just wanted coffee.\""}
        startFrame={520}
        durationFrames={80}
        position={{ x: 400, y: 450 }}
      />

      {/* After "I just wanted coffee", the AIs respond sequentially */}

      {/* Flowchart appears with LangGraph and disappears when he finishes */}
      <Flowchart startFrame={615} endFrame={680} x={50} y={440} />

      {/* 1. LangGraph: "I am updating my state..." */}
      <DialogueBubble
        speaker="langgraph"
        text={"\"I am updating my state...\""}
        startFrame={615}
        durationFrames={60}
        position={{ x: 60, y: 200 }}
      />

      {/* 2. OpenAI: "Memory... Memory." */}
      <DialogueBubble
        speaker="openai"
        text={"\"Memory... Memory.\""}
        startFrame={685}
        durationFrames={55}
        position={{ x: 300, y: 100 }}
      />

      {/* 3. CrewAI: "Memory is explicit, not automatic." */}
      <DialogueBubble
        speaker="crewai"
        text={"\"Memory is explicit, not automatic.\""}
        startFrame={750}
        durationFrames={70}
        position={{ x: 580, y: 200 }}
      />

      {/* ========== Audio ========== */}
      <SceneAudio
        voiceLines={[
          { file: "s1-man-order.mp3", startFrame: 40 },
          { file: "s1-langgraph.mp3", startFrame: 170 },
          { file: "s1-crewai.mp3", startFrame: 280 },
          { file: "s1-openai.mp3", startFrame: 400 },
          { file: "s1-man-deadpan.mp3", startFrame: 520 },
          { file: "s1-langgraph-state.mp3", startFrame: 615 },
          { file: "s1-openai-memory.mp3", startFrame: 685 },
          { file: "s1-crewai-memory.mp3", startFrame: 750 },
        ]}
      />

      {/* Title card at end -- appears after CrewAI finishes (750+70=820) */}
      <Sequence from={830} durationInFrames={70}>
        <TitleCard
          text="When Agentic AI Overthinks Your Coffee"
          subtitle="Scene 1 of 3"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
