#!/usr/bin/env node
/**
 * Generate a vibrant Bossa Nova background loop with multiple instruments.
 *
 * Instruments:
 *  1. Nylon guitar -- classic bossa strumming pattern
 *  2. Piano -- gentle comping chords
 *  3. Upright bass -- smooth walking/bossa line
 *  4. Shaker / cabasa -- steady 16th-note pulse
 *  5. Rim click -- bossa clave pattern
 *  6. Flute -- gentle melodic line floating on top
 *
 * Style: "Girl from Ipanema" / "Corcovado" vibe -- warm, catchy, relaxed
 *
 * Usage: node scripts/generate-jazz.js
 * Output: public/music/soft-jazz-loop.wav
 */

const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const DURATION = 30;
const NUM_SAMPLES = SAMPLE_RATE * DURATION;
const BPM = 140; // Bossa Nova typically 130-150
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

// ── Note helpers ──
function noteFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// MIDI notes
const C2=36, D2=38, E2=40, F2=41, G2=43, A2=45, Bb2=46, B2=47;
const C3=48, D3=50, E3=52, F3=53, G3=55, A3=57, Bb3=58, B3=59;
const C4=60, D4=62, E4=64, F4=65, Fs4=66, G4=67, Ab4=68, A4=69, Bb4=70, B4=71;
const C5=72, D5=74, E5=76, F5=77, G5=79, A5=81, Bb5=82;

// ── Bossa Nova chord progression ──
// Classic bossa: | Cmaj7 | D7(9) | Dm7 | G7 | Cmaj7 | C#dim | Dm7 | G7 |
const CHORDS = [
  { name: "Cmaj7",  guitar: [E3, G3, B3, C4, E4],    piano: [C4, E4, G4, B4],     bassRoot: C2, bassNotes: [C2, G2, E2, C3] },
  { name: "D9",     guitar: [D3, Fs4, A3, C4, E4],    piano: [D4, Fs4, A4, C5],    bassRoot: D2, bassNotes: [D2, A2, F2, D3] },
  { name: "Dm7",    guitar: [D3, F3, A3, C4],          piano: [D4, F4, A4, C5],     bassRoot: D2, bassNotes: [D2, F2, A2, D3] },
  { name: "G7",     guitar: [G3, B3, D4, F4],          piano: [G4, B4, D5, F5],     bassRoot: G2, bassNotes: [G2, B2, D3, G2] },
  { name: "Cmaj7",  guitar: [E3, G3, B3, C4, E4],      piano: [C4, E4, G4, B4],    bassRoot: C2, bassNotes: [C2, E2, G2, C3] },
  { name: "A7",     guitar: [A3, C4+1, E4, G4],        piano: [A4, C5+1, E5, G5],  bassRoot: A2, bassNotes: [A2, E2, C3, A2] },
  { name: "Dm7",    guitar: [D3, F3, A3, C4],           piano: [D4, F4, A4, C5],    bassRoot: D2, bassNotes: [D2, A2, F2, D3] },
  { name: "G7",     guitar: [G3, B3, D4, F4],           piano: [G4, B4, D5, F5],    bassRoot: G2, bassNotes: [G2, D3, B2, G2] },
];

// ── Flute melody (catchy bossa melody) ──
// [midi, startBeat, duration] -- spans 32 beats (8 bars)
const FLUTE_MELODY = [
  // Bars 1-2: Cmaj7 / D9
  [E5, 0.5, 1.0], [G5, 1.5, 0.5], [A5, 2.0, 1.5], [G5, 3.5, 0.5],
  [E5, 4.0, 1.0], [D5, 5.0, 0.5], [C5, 5.5, 0.5], [D5, 6.0, 1.5],
  // rest at 7.5

  // Bars 3-4: Dm7 / G7
  [F5, 8.5, 0.75], [E5, 9.25, 0.25], [D5, 9.5, 0.5], [C5, 10.0, 1.0],
  [A4, 11.0, 0.5], [C5, 11.5, 0.5], [D5, 12.0, 1.5], [C5, 13.5, 0.5],
  [B4, 14.0, 1.0], [D5, 15.0, 1.0],

  // Bars 5-6: Cmaj7 / A7
  [E5, 16.0, 0.5], [G5, 16.5, 1.0], [E5, 17.5, 0.5],
  [C5, 18.0, 0.75], [D5, 18.75, 0.25], [E5, 19.0, 1.5],
  [C5+1, 20.5, 0.5], [E5, 21.0, 0.75], [C5+1, 21.75, 0.25],
  [A4, 22.0, 1.5], [G4, 23.5, 0.5],

  // Bars 7-8: Dm7 / G7 -- resolve back
  [A4, 24.0, 0.5], [C5, 24.5, 0.5], [D5, 25.0, 1.0],
  [F5, 26.0, 0.5], [E5, 26.5, 0.5], [D5, 27.0, 0.5], [C5, 27.5, 0.5],
  [B4, 28.0, 1.0], [C5, 29.0, 0.5], [D5, 29.5, 0.5],
  [E5, 30.0, 2.0],
];

// ── Bossa guitar strum pattern ──
// Classic pattern in 4/4: bass on 1, chord on "and of 1", bass on 3, chord on "and of 3"
// With syncopated anticipations
const GUITAR_PATTERN = [
  // [type, beatOffset] -- type: "bass" or "chord"
  { type: "bass",  beat: 0.0 },
  { type: "chord", beat: 0.5 },
  { type: "chord", beat: 1.5 },
  { type: "bass",  beat: 2.0 },
  { type: "chord", beat: 2.5 },
  { type: "chord", beat: 3.0 },
  { type: "chord", beat: 3.5 },
];

// ── Synth engines ──

function nylonGuitar(phase, t, isChord) {
  // Nylon string: warm fundamental, soft harmonics, quick pluck decay
  const attack = Math.min(1, t / 0.003);
  const decay = Math.exp(-t * (isChord ? 5.0 : 3.5));
  const env = attack * decay;
  const f = Math.sin(phase * 2 * Math.PI);
  const h2 = Math.sin(phase * 4 * Math.PI) * 0.35;
  const h3 = Math.sin(phase * 6 * Math.PI) * 0.12;
  const h5 = Math.sin(phase * 10 * Math.PI) * 0.03 * Math.exp(-t * 15);
  // Pluck noise burst
  const noise = (Math.random() * 2 - 1) * 0.15 * Math.exp(-t * 80);
  return (f + h2 + h3 + h5 + noise) * env;
}

function pianoComp(phase, t) {
  const attack = Math.min(1, t / 0.005);
  const decay = Math.exp(-t * 2.5);
  const env = attack * decay;
  const f = Math.sin(phase * 2 * Math.PI);
  const h2 = Math.sin(phase * 4 * Math.PI) * 0.3;
  const h3 = Math.sin(phase * 6 * Math.PI) * 0.1;
  return (f + h2 + h3) * env * 0.3;
}

function uprightBass(phase, t) {
  const attack = Math.min(1, t / 0.01);
  const decay = Math.exp(-t * 2.0);
  const env = attack * decay;
  const f = Math.sin(phase * 2 * Math.PI);
  const sub = Math.sin(phase * Math.PI) * 0.4;
  const h2 = Math.sin(phase * 4 * Math.PI) * 0.12;
  // Finger pluck character
  const pluck = Math.sin(phase * 8 * Math.PI) * 0.05 * Math.exp(-t * 20);
  return (f + sub + h2 + pluck) * env * 0.5;
}

function flute(phase, t, noteDur) {
  // Breathy flute: sine + slight breathiness + vibrato
  const attack = Math.min(1, t / 0.04); // soft attack
  const release = t > noteDur ? Math.exp(-(t - noteDur) * 12) : 1;
  const env = attack * release;
  const vibrato = Math.sin(t * 5.5 * 2 * Math.PI) * 0.003 * Math.min(1, t / 0.2);
  const f = Math.sin((phase + vibrato) * 2 * Math.PI);
  const h2 = Math.sin((phase + vibrato) * 4 * Math.PI) * 0.15;
  // Breath noise
  const breath = (Math.random() * 2 - 1) * 0.04 * env;
  return (f + h2 + breath) * env * 0.35;
}

function shaker(t16th) {
  // 16th note shaker pulse
  if (t16th < 0 || t16th > 0.04) return 0;
  return (Math.random() * 2 - 1) * Math.exp(-t16th * 80) * 0.12;
}

function rimClick(t) {
  if (t < 0 || t > 0.02) return 0;
  // Sharp click: short sine burst + noise
  const click = Math.sin(t * 1800 * 2 * Math.PI) * Math.exp(-t * 200);
  const noise = (Math.random() * 2 - 1) * Math.exp(-t * 150) * 0.5;
  return (click + noise) * 0.2;
}

// ── Bossa clave rhythm (rim click) ──
// Classic son clave adapted for bossa: hits on beats [1, "and of 2", 4, "and of 4+"]
const CLAVE_HITS = [0.0, 1.5, 3.0, 3.5]; // beat offsets within a bar

// ── Main generation ──

function generate() {
  const samples = new Float32Array(NUM_SAMPLES);
  const TOTAL_BEATS = CHORDS.length * 4; // 8 chords * 4 beats = 32 beats

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;

    const globalBeat = t / BEAT;
    const loopBeat = globalBeat % TOTAL_BEATS;
    const chordIdx = Math.floor(loopBeat / 4) % CHORDS.length;
    const chord = CHORDS[chordIdx];
    const barBeat = loopBeat % 4; // 0-4 within current bar

    // ── 1. Nylon Guitar ──
    for (const strum of GUITAR_PATTERN) {
      const strumT = (barBeat - strum.beat) * BEAT;
      if (strumT >= 0 && strumT < BEAT * 1.2) {
        if (strum.type === "bass") {
          // Bass note of guitar
          const freq = noteFreq(chord.bassRoot + 12); // one octave up from bass
          const phase = (t * freq) % 1;
          sample += nylonGuitar(phase, strumT, false) * 0.14;
        } else {
          // Chord strum -- play all chord tones with slight spread
          for (let n = 0; n < chord.guitar.length; n++) {
            const delay = n * 0.004; // strum spread
            const noteT = strumT - delay;
            if (noteT >= 0) {
              const freq = noteFreq(chord.guitar[n]);
              const phase = (t * freq) % 1;
              sample += nylonGuitar(phase, noteT, true) * 0.06;
            }
          }
        }
      }
    }

    // ── 2. Piano comping (on "and of 2" and beat 4) ──
    const pianoHits = [1.5, 3.75];
    for (const ph of pianoHits) {
      const pT = (barBeat - ph) * BEAT;
      if (pT >= 0 && pT < BEAT * 1.5) {
        for (const midi of chord.piano) {
          const freq = noteFreq(midi);
          const phase = (t * freq) % 1;
          sample += pianoComp(phase, pT) * 0.07;
        }
      }
    }

    // ── 3. Upright bass ──
    // Half notes with passing tones -- beat 1 and 3
    const bassBeats = [0, 2];
    for (let bi = 0; bi < bassBeats.length; bi++) {
      const bT = (barBeat - bassBeats[bi]) * BEAT;
      if (bT >= 0 && bT < BEAT * 2.2) {
        const bassMidi = chord.bassNotes[bi * 2]; // use root and 5th alternating
        const freq = noteFreq(bassMidi);
        const phase = (t * freq) % 1;
        sample += uprightBass(phase, bT);
      }
    }

    // ── 4. Flute melody ──
    const melodyBeat = loopBeat % 32;
    for (const [midi, startBeat, dur] of FLUTE_MELODY) {
      const noteStart = startBeat;
      const noteDur = dur * BEAT;
      const noteT = (melodyBeat - noteStart) * BEAT;
      if (noteT >= 0 && noteT < noteDur + 0.4) {
        const freq = noteFreq(midi);
        const phase = (t * freq) % 1;
        sample += flute(phase, noteT, noteDur);
      }
    }

    // ── 5. Shaker (16th notes) ──
    const sixteenthBeat = globalBeat * 4;
    const sixteenthT = (sixteenthBeat % 1) * (BEAT / 4);
    sample += shaker(sixteenthT);

    // ── 6. Rim click (bossa clave) ──
    for (const hit of CLAVE_HITS) {
      const rT = (barBeat - hit) * BEAT;
      sample += rimClick(rT);
    }

    // ── Gentle reverb-like warmth (simple delay feedback) ──
    if (i > SAMPLE_RATE * 0.12) {
      const delayIdx = i - Math.floor(SAMPLE_RATE * 0.12);
      sample += samples[delayIdx] * 0.08;
    }
    if (i > SAMPLE_RATE * 0.25) {
      const delayIdx2 = i - Math.floor(SAMPLE_RATE * 0.25);
      sample += samples[delayIdx2] * 0.04;
    }

    // ── Soft limit ──
    sample = Math.tanh(sample * 1.3) * 0.6;
    samples[i] = sample;
  }

  return samples;
}

function writeWav(filePath, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);

  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
}

const outPath = path.join(__dirname, "..", "public", "music", "soft-jazz-loop.wav");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

console.log("Generating Bossa Nova background (30s loop)...");
console.log("  Instruments: nylon guitar, piano, upright bass, flute, shaker, rim click");
const samples = generate();
writeWav(outPath, samples);
console.log(`Saved: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
