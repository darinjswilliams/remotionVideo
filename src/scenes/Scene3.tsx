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
import { HolographicProjector } from "../components/HolographicProjector";
import { CafeTable } from "../components/CafeTable";
import { CappuccinoReveal } from "../components/CappuccinoReveal";
import { SceneAudio } from "../components/SceneAudio";

// Scene 3: "The Real Insight" -- 900 frames
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <CafeBackground />

      {/* Human character -- relaxed, warm scene */}
      <Character type="man" x={120} y={-10} enterDelay={0} speaking={(frame > 20 && frame < 150) || (frame > 515 && frame < 595) || (frame > 610 && frame < 710)} />

      {/* Circular cafe table near human's left hand */}
      <CafeTable x={500} y={555} radius={65} />

      {/* Coffee cup on table -- animated sip at frames 450-540 */}
      {(() => {
        // Cup rest position on the table
        const restX = 415;
        const restY = 490;
        // Cup "at mouth" position -- moves RIGHT toward character's face
        // and UP to mouth level
        const mouthX = 475;
        const mouthY = 340;

        // Sip timeline:
        //   0-450:   rest on table
        //   450-480: rise to mouth (right and up)
        //   480-510: tilt toward character & sip
        //   510-545: return to table
        //   545+:    rest on table

        let offsetX = 0;
        let offsetY = 0;
        let rotation = 0;
        let sipScale = 1;

        if (frame >= 450 && frame < 480) {
          // Rise to mouth -- moves right toward character, up to mouth level
          const p = interpolate(frame, [450, 480], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const eased = p * p * (3 - 2 * p); // smoothstep
          offsetX = (mouthX - restX) * eased;
          offsetY = (mouthY - restY) * eased;
          sipScale = interpolate(p, [0, 1], [1, 1.1]);
          // Tilt toward character (positive = clockwise, cup tips right)
          rotation = interpolate(p, [0, 1], [0, 18]);
        } else if (frame >= 480 && frame < 510) {
          // At mouth -- tilt further for sip
          offsetX = mouthX - restX;
          offsetY = mouthY - restY;
          sipScale = 1.1;
          // Extra tilt for the actual sip motion
          const sipP = interpolate(frame, [480, 495, 510], [0, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          rotation = 18 + sipP * 10; // tilts more toward character during sip
        } else if (frame >= 510 && frame < 545) {
          // Return to table
          const p = interpolate(frame, [510, 545], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const eased = p * p * (3 - 2 * p);
          offsetX = (mouthX - restX) * (1 - eased);
          offsetY = (mouthY - restY) * (1 - eased);
          sipScale = interpolate(p, [0, 1], [1.1, 1]);
          rotation = interpolate(p, [0, 1], [18, 0]);
        }

        return (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              zIndex: 25,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: restX + offsetX,
                top: restY + offsetY,
                transform: `scale(${sipScale}) rotate(${rotation}deg)`,
                transformOrigin: "center bottom",
              }}
            >
              <CappuccinoReveal
                startFrame={0}
                x={0}
                y={0}
                cupScale={0.45}
              />
            </div>
          </div>
        );
      })()}

      {/* Holographic projector -- already active.
          BaristaBot already delivered in Scene 2, so set a past startFrame
          so barista is already faded out when this scene begins. */}
      <HolographicProjector
        x={470}
        y={530}
        startFrame={0}
        alreadyActive={true}
        scale={1.0}
        baristaDelivery={{
          startFrame: -200,
          tableX: 510,
          tableY: 500,
        }}
      />

      {/* Man's opening question */}
      <DialogueBubble
        speaker="man"
        text={"\"So you're not replacing humans... you just need better workflows?\""}
        startFrame={30}
        durationFrames={120}
        position={{ x: 330, y: 440 }}
      />

      {/* LangGraph answer */}
      <DialogueBubble
        speaker="langgraph"
        text={"\"Structured coordination improves outcomes.\""}
        startFrame={165}
        durationFrames={80}
        position={{ x: 60, y: 200 }}
      />

      {/* CrewAI answer */}
      <DialogueBubble
        speaker="crewai"
        text={"\"Teamwork makes the dream work!\""}
        startFrame={255}
        durationFrames={70}
        position={{ x: 580, y: 200 }}
      />

      {/* OpenAI answer */}
      <DialogueBubble
        speaker="openai"
        text={"\"Human intent remains the highest-quality signal.\""}
        startFrame={340}
        durationFrames={80}
        position={{ x: 300, y: 100 }}
      />

      {/* Soft sip sound effect text -- appears during the sip */}
      <Sequence from={485} durationInFrames={35}>
        <div
          style={{
            position: "absolute",
            left: 500,
            top: 400,
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
            color: "#ffffff80",
            fontStyle: "italic",
            opacity: interpolate(frame - 485, [0, 8, 25, 35], [0, 0.7, 0.7, 0]),
          }}
        >
          {"*sip*"}
        </div>
      </Sequence>

      {/* "I just love autonomous coffee" -- spoken while cup floats back down (510-545) */}
      <DialogueBubble
        speaker="man"
        text={"\"I just love... autonomous coffee.\""}
        startFrame={515}
        durationFrames={80}
        position={{ x: 340, y: 450 }}
      />

      {/* Quantum foam joke -- after cup lands back on table (545) */}
      <DialogueBubble
        speaker="man"
        text={"\"Good. Because I still don't understand quantum foam.\""}
        startFrame={610}
        durationFrames={100}
        position={{ x: 340, y: 450 }}
      />

      {/* All AIs respond together -- immediately after quantum foam line */}
      <DialogueBubble
        speaker="all"
        text={"\"Neither do we.\""}
        startFrame={720}
        durationFrames={80}
        position={{ x: 380, y: 140 }}
      />

      {/* ========== Audio ========== */}
      <SceneAudio
        voiceLines={[
          { file: "s3-man-question.mp3", startFrame: 30 },
          { file: "s3-langgraph.mp3", startFrame: 165 },
          { file: "s3-crewai.mp3", startFrame: 255 },
          { file: "s3-openai.mp3", startFrame: 340 },
          { file: "s3-man-coffee.mp3", startFrame: 515 },
          { file: "s3-man-joke.mp3", startFrame: 610 },
          // All three AIs speak together
          { file: "s3-all-langgraph.mp3", startFrame: 720 },
          { file: "s3-all-crewai.mp3", startFrame: 720 },
          { file: "s3-all-openai.mp3", startFrame: 720 },
        ]}
      />

      {/* Freeze frame effect */}
      <Sequence from={810}>
        {/* Scan lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
            zIndex: 50,
            opacity: interpolate(frame - 810, [0, 30], [0, 0.6], {
              extrapolateRight: "clamp",
            }),
          }}
        />

        {/* Cafe logo glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 100,
            transform: "translateX(-50%)",
            textAlign: "center",
            zIndex: 60,
            opacity: interpolate(frame - 820, [0, 40], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 36,
              fontWeight: "bold",
              color: "#ff00ff",
              textShadow:
                "0 0 15px #ff00ff, 0 0 30px #ff00ff, 0 0 60px #ff00ff60",
              letterSpacing: 4,
              marginBottom: 10,
            }}
          >
            {"☕ THE PROMPT & POUR"}
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              color: "#00ccff",
              textShadow: "0 0 8px #00ccff",
              letterSpacing: 6,
              opacity: interpolate(frame - 850, [0, 30], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {"ESPRESSO YOURSELF -- AN AGENTIC AI CAFE"}
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              color: "#ffffff60",
              marginTop: 12,
              letterSpacing: 2,
              opacity: interpolate(frame - 870, [0, 30], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {"© 2045 -- WHERE AGENTS MEET ESPRESSO"}
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
