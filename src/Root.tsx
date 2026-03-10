import { Composition, Sequence } from "remotion";
import React from "react";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";

const FPS = 30;
const SCENE_DURATION = 900; // 30 seconds per scene

// Full video combining all 3 scenes
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
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full video — all 3 scenes */}
      <Composition
        id="EspressoYourself"
        component={EspressoYourselfVideo}
        durationInFrames={SCENE_DURATION * 3}
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
    </>
  );
};
