import { Composition, Sequence } from "remotion";
import React from "react";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { SceneCredits } from "./scenes/SceneCredits";

const FPS = 30;
const SCENE_DURATION = 900; // 30 seconds per main scene
const CREDITS_DURATION = 1350; // 45 seconds for credits (slower scroll)
const TOTAL_DURATION = SCENE_DURATION * 3 + CREDITS_DURATION; // 3 scenes + credits

// Full video combining all scenes
const EspressoYourselfVideo: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <Scene1 />
      </Sequence>
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <Scene2 />
      </Sequence>
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <Scene3 />
      </Sequence>
      <Sequence from={SCENE_DURATION * 3} durationInFrames={CREDITS_DURATION}>
        <SceneCredits />
      </Sequence>
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full video — 3 main scenes + credits */}
      <Composition
        id="EspressoYourself"
        component={EspressoYourselfVideo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1080}
        height={720}
      />

      {/* Individual scenes for preview */}
      <Composition
        id="Scene1-OrderingTheImpossible"
        component={Scene1}
        durationInFrames={SCENE_DURATION}
        fps={FPS}
        width={1080}
        height={720}
      />
      <Composition
        id="Scene2-UnexpectedConnection"
        component={Scene2}
        durationInFrames={SCENE_DURATION}
        fps={FPS}
        width={1080}
        height={720}
      />
      <Composition
        id="Scene3-TheRealInsight"
        component={Scene3}
        durationInFrames={SCENE_DURATION}
        fps={FPS}
        width={1080}
        height={720}
      />
      <Composition
        id="Scene4-Credits"
        component={SceneCredits}
        durationInFrames={CREDITS_DURATION}
        fps={FPS}
        width={1080}
        height={720}
      />
    </>
  );
};
