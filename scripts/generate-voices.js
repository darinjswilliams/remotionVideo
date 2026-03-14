#!/usr/bin/env node
/**
 * Generate voiceover audio for all dialogue lines using WaveSpeed AI API
 * with the Inworld 1.5 Max text-to-speech model.
 *
 * Usage:
 *   node scripts/generate-voices.js
 *
 * The script reads WAVESPEED_API_KEY from the .env file automatically.
 * You can also override via environment variable:
 *   WAVESPEED_API_KEY=your_key node scripts/generate-voices.js
 *
 * Each character gets a unique Inworld voice:
 *   - Man (human):  "Alex"      -- warm, natural male
 *   - LangGraph:    "Edward"    -- analytical, measured
 *   - CrewAI:       "Blake"     -- energetic, warm
 *   - OpenAI:       "Dominus"   -- calm, authoritative
 *   - BaristaBot:   "Hades"     -- deep, commanding
 */

const fs = require("fs");
const path = require("path");

// Load .env file from project root
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const API_KEY = process.env.WAVESPEED_API_KEY;
if (!API_KEY) {
  console.error("ERROR: No WAVESPEED_API_KEY found in .env or environment");
  process.exit(1);
}

const TTS_URL =
  "https://api.wavespeed.ai/api/v3/inworld/inworld-1.5-max/text-to-speech";

// Inworld voice names -- distinct character voices
const VOICES = {
  man: "Alex",
  langgraph: "Edward",
  crewai: "Blake",
  openai: "Dominus",
  barista: "Hades",
};

// All dialogue lines grouped by scene
const DIALOGUE = [
  // ===== SCENE 1: "Ordering the Impossible" =====
  {
    id: "s1-man-order",
    speaker: "man",
    text: "Can I get a triple-shot, oat milk, low-latency, hallucination-free cappuccino?",
  },
  {
    id: "s1-langgraph",
    speaker: "langgraph",
    text: "Mapping request to structured workflow.",
  },
  {
    id: "s1-crewai",
    speaker: "crewai",
    text: "I'll assemble a team: BaristaBot, MilkOptimizer, and FoamStrategist!",
  },
  {
    id: "s1-openai",
    speaker: "openai",
    text: "Analyzing beverage preferences based on historical caffeine behavior.",
  },
  {
    id: "s1-man-deadpan",
    speaker: "man",
    text: "I just wanted coffee.",
  },
  {
    id: "s1-langgraph-state",
    speaker: "langgraph",
    text: "I am updating my state...",
  },
  {
    id: "s1-openai-memory",
    speaker: "openai",
    text: "Memory... Memory.",
  },
  {
    id: "s1-crewai-memory",
    speaker: "crewai",
    text: "Memory is explicit, not automatic.",
  },

  // ===== SCENE 2: "Unexpected Connection" =====
  {
    id: "s2-crewai",
    speaker: "crewai",
    text: "Team coordination failure detected.",
  },
  {
    id: "s2-langgraph",
    speaker: "langgraph",
    text: "Re-routing decision nodes.",
  },
  {
    id: "s2-openai",
    speaker: "openai",
    text: "Suggest adaptive reasoning under uncertainty.",
  },
  {
    id: "s2-man",
    speaker: "man",
    text: "Why don't you just... talk to each other?",
  },
  {
    id: "s2-all-langgraph",
    speaker: "langgraph",
    text: "Hmmm, great decision. Do you mean MCP or A2A?",
  },
  {
    id: "s2-all-crewai",
    speaker: "crewai",
    text: "Hmmm, great decision. Do you mean MCP or A2A?",
  },
  {
    id: "s2-all-openai",
    speaker: "openai",
    text: "Hmmm, great decision. Do you mean MCP or A2A?",
  },
  {
    id: "s2-man-thanks",
    speaker: "man",
    text: "Thank you! For keeping Humans in the Loop.",
  },

  // ===== SCENE 3: "The Real Insight" =====
  {
    id: "s3-man-question",
    speaker: "man",
    text: "So you're not replacing humans... you just need better workflows?",
  },
  {
    id: "s3-man-coffee",
    speaker: "man",
    text: "I just love... autonomous coffee.",
  },
  {
    id: "s3-langgraph",
    speaker: "langgraph",
    text: "Structured coordination improves outcomes.",
  },
  {
    id: "s3-crewai",
    speaker: "crewai",
    text: "Teamwork makes the dream work!",
  },
  {
    id: "s3-openai",
    speaker: "openai",
    text: "Human intent remains the highest-quality signal.",
  },
  {
    id: "s3-man-joke",
    speaker: "man",
    text: "Good. Because I still don't understand quantum foam.",
  },
  {
    id: "s3-all-langgraph",
    speaker: "langgraph",
    text: "Neither do we.",
  },
  {
    id: "s3-all-crewai",
    speaker: "crewai",
    text: "Neither do we.",
  },
  {
    id: "s3-all-openai",
    speaker: "openai",
    text: "Neither do we.",
  },
];

const OUT_DIR = path.join(__dirname, "..", "public", "voiceover");

/**
 * Poll a WaveSpeed task until it completes or fails.
 */
async function pollTask(taskId, maxAttempts = 60) {
  const pollUrl = `https://api.wavespeed.ai/api/v3/predictions/${taskId}/result`;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, 2000));

    const res = await fetch(pollUrl, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Poll error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const status = data.status || data.data?.status;

    if (status === "completed" || status === "succeeded") {
      return data;
    } else if (status === "failed" || status === "error") {
      throw new Error(
        `Task ${taskId} failed: ${JSON.stringify(data.error || data)}`
      );
    }
    if (attempt % 5 === 4) {
      console.log(`    ...still processing (attempt ${attempt + 1})`);
    }
  }
  throw new Error(`Task ${taskId} timed out after ${maxAttempts} attempts`);
}

/**
 * Extract audio URL from a WaveSpeed response object.
 */
function extractAudioUrl(data) {
  // Try various known response shapes
  if (data.data?.outputs && Array.isArray(data.data.outputs) && data.data.outputs.length > 0) {
    return data.data.outputs[0];
  }
  if (data.data?.output?.audio_url) return data.data.output.audio_url;
  if (data.data?.output?.url) return data.data.output.url;
  if (typeof data.data?.output === "string") return data.data.output;
  if (data.data?.audio_url) return data.data.audio_url;
  if (data.data?.url) return data.data.url;
  if (data.outputs && Array.isArray(data.outputs) && data.outputs.length > 0) {
    return data.outputs[0];
  }
  if (data.output?.audio_url) return data.output.audio_url;
  if (data.audio_url) return data.audio_url;
  if (data.url) return data.url;
  return null;
}

/**
 * Download audio from a URL and save to disk.
 */
async function downloadAudio(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed (${res.status}): ${url}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buffer);
  return buffer.length;
}

async function generateVoice(line) {
  const voiceName = VOICES[line.speaker];

  console.log(
    `  Generating: ${line.id} (${line.speaker} -> ${voiceName}): "${line.text.slice(0, 50)}${
      line.text.length > 50 ? "..." : ""
    }"`
  );

  // Submit TTS task to WaveSpeed Inworld 1.5 Max
  const response = await fetch(TTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: line.text,
      voice_id: voiceName,
      speaking_rate: 1,
      temperature: 1,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `WaveSpeed API error for ${line.id}: ${response.status} ${errText}`
    );
  }

  const result = await response.json();

  // Try to get audio URL directly (sync response)
  let audioUrl = extractAudioUrl(result);

  // If no direct URL, poll with task ID (async response)
  if (!audioUrl) {
    const taskId = result.data?.id || result.id;
    if (!taskId) {
      throw new Error(
        `No audio URL or task ID for ${line.id}: ${JSON.stringify(result)}`
      );
    }

    console.log(`    Async task ${taskId} -- polling...`);
    const completed = await pollTask(taskId);
    audioUrl = extractAudioUrl(completed);

    if (!audioUrl) {
      throw new Error(
        `No audio URL in completed task for ${line.id}: ${JSON.stringify(completed)}`
      );
    }
  }

  // Download the audio file
  const outPath = path.join(OUT_DIR, `${line.id}.mp3`);
  const fileSize = await downloadAudio(audioUrl, outPath);
  console.log(`  Saved: ${outPath} (${(fileSize / 1024).toFixed(1)} KB)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Using WaveSpeed Inworld 1.5 Max TTS`);
  console.log(`API Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);
  console.log(`\nGenerating ${DIALOGUE.length} voiceover lines...\n`);

  let success = 0;
  let failed = 0;

  for (const line of DIALOGUE) {
    try {
      await generateVoice(line);
      success++;
    } catch (err) {
      console.error(`  FAILED: ${line.id} -- ${err.message}`);
      failed++;
    }
    // Delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(
    `\nDone! ${success} succeeded, ${failed} failed out of ${DIALOGUE.length} total.`
  );
  console.log(`Files saved to: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
