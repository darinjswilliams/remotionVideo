import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

/**
 * Voice line definition for a dialogue line in a scene.
 */
export type VoiceLine = {
  /** Audio file name inside public/voiceover/ (e.g. "s1-man-order.mp3") */
  file: string;
  /** Frame at which this voice line starts playing */
  startFrame: number;
};

// Workaround for Remotion 4.0.0 strict type issue with Audio component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AudioAny = Audio as any;

/**
 * SceneAudio -- renders voiceover lines + background jazz for a scene.
 *
 * Each voice line plays at its specified startFrame, one at a time.
 * Background jazz loops softly underneath.
 */
export const SceneAudio: React.FC<{
  voiceLines: VoiceLine[];
  jazzVolume?: number;
  voiceVolume?: number;
}> = ({ voiceLines, jazzVolume = 0.015, voiceVolume = 0.85 }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {/* Soft jazz background -- loops throughout the scene */}
      <AudioAny
        src={staticFile("music/bossa-by-the-sea.mp3")}
        volume={jazzVolume}
        loop
      />

      {/* Individual voiceover lines at their start times */}
      {voiceLines.map((line) => (
        <Sequence key={line.file} from={line.startFrame}>
          <AudioAny
            src={staticFile(`voiceover/${line.file}`)}
            volume={voiceVolume}
          />
        </Sequence>
      ))}
    </>
  );
};
