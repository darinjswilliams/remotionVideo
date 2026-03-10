# CLAUDE.md — Project Instructions

## Video Creation

When asked to create a video, always use **Remotion** (React-based video framework).

- All video projects live in this folder (`remotionVideos/`)
- Use TypeScript (`.tsx`) for all components and compositions
- Follow the Remotion best practices skill at `.agents/skills/remotion-best-practices/`
- Structure videos with reusable components in `src/components/` and scenes in `src/scenes/`
- Register all compositions in `src/Root.tsx`
- Use `npm start` to preview in Remotion Studio and `npm run build` to render final MP4

## Skills & Services

When new skills or services are introduced, adopt them immediately for relevant tasks. Always check for available skills before starting work and use them when they apply.

### Currently Available

- **Remotion Best Practices** — Video creation patterns, animations, sequencing, audio, fonts, and more (`.agents/skills/remotion-best-practices/`)
- **WaveSpeed AI** — API-based service for voiceover generation and image generation (see details below)

## WaveSpeed AI

API access is configured via the `.env` file (`WAVESPEED_API_KEY`). Never hardcode the key in source files.

### Voiceover Generation

When asked to create a voiceover or narration, use the **WaveSpeed API** with the **elevenlabs/eleven-v3** model.

- API endpoint: `https://api.wavespeed.ai/api/v3/voice/elevenlabs/eleven-v3`
- This is the preferred model for all voice generation tasks
- Use this for video narration, character dialogue, or any spoken audio

### Image Generation

When asked to generate images, use the **WaveSpeed API** with the **Nano Banana Pro** model.

- API endpoint: `https://api.wavespeed.ai/api/v3/google/nano-banana-pro/text-to-image`
- Request body params: `prompt`, `resolution` ("1k" or "4k"), `output_format` ("png"), `enable_sync_mode` (true for immediate result)
- Use this for scene backgrounds, character art, thumbnails, or any visual assets

### Authentication

All WaveSpeed API calls must include the header:
```
Authorization: Bearer $WAVESPEED_API_KEY
```
The key is stored in `.env` (gitignored, never committed).

## General Guidelines

- Keep all final output files in this workspace folder so they persist
- Use JSX expression syntax `text={"..."}` for string props (avoid raw curly quotes or special Unicode characters that break esbuild)
- Prefer ASCII characters in source code; use HTML entities or JS strings for special characters
