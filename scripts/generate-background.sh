#!/bin/bash
# Generate matching cyberpunk café background via WaveSpeed Nano Banana Pro
# Run from remotionVideos/ folder: bash scripts/generate-background.sh

set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$WAVESPEED_API_KEY" ]; then
  echo "Error: WAVESPEED_API_KEY not found in .env"
  exit 1
fi

echo "Generating cyberpunk cafe background image..."

RESPONSE=$(curl -s -X POST "https://api.wavespeed.ai/api/v3/google/nano-banana-pro/text-to-image" \
  -H "Authorization: Bearer $WAVESPEED_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Wide establishing shot interior of a futuristic cyberpunk cafe called The Prompt and Pour, year 2045 aesthetic. Dark moody atmosphere with deep blue and purple tones. Neon pink and cyan signage glowing on walls. Sleek modern furniture, dark wood and metal tables. Holographic menu displays floating in the air. Volumetric fog and ambient lighting. Japanese and English neon signs on the walls. No people, empty cafe interior. Cinematic wide angle, 3D rendered, same style as a cyberpunk video game environment. Dark ceiling with exposed industrial pipes and soft overhead spotlights.",
    "resolution": "1k",
    "output_format": "png",
    "enable_sync_mode": true
  }')

echo "API Response:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

IMAGE_URL=$(echo "$RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'data' in data and 'output' in data['data']:
    out = data['data']['output']
    print(out[0] if isinstance(out, list) else out)
elif 'output' in data:
    out = data['output']
    print(out[0] if isinstance(out, list) else out)
elif 'image' in data:
    print(data['image'])
elif 'url' in data:
    print(data['url'])
" 2>/dev/null)

if [[ "$IMAGE_URL" == http* ]]; then
  mkdir -p public/assets
  echo "Downloading image..."
  curl -s -o public/assets/cafe-background.png "$IMAGE_URL"
  echo "Saved to public/assets/cafe-background.png"
else
  echo ""
  echo "Check response above for image URL, then save manually as:"
  echo "  public/assets/cafe-background.png"
fi
