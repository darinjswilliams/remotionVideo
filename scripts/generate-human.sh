#!/bin/bash
# Generate futuristic human character image via WaveSpeed Nano Banana Pro
# Character is sitting in a chair ONLY -- NO table in the image.
# The cafe table is provided by the CafeTable SVG component separately.
# Run from remotionVideos/ folder: bash scripts/generate-human.sh

set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$WAVESPEED_API_KEY" ]; then
  echo "Error: WAVESPEED_API_KEY not found in .env"
  exit 1
fi

echo "Generating futuristic human character image (no table)..."

RESPONSE=$(curl -s -X POST "https://api.wavespeed.ai/api/v3/google/nano-banana-pro/text-to-image" \
  -H "Authorization: Bearer $WAVESPEED_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "3D rendered character on solid bright green background for chroma key extraction. A futuristic man sitting casually in a dark modern chair, full body visible from head to feet. He wears a sleek cyberpunk leather jacket with subtle glowing cyan neon accents along the collar and shoulder seams. Short dark hair, friendly curious expression, looking slightly to the right. Arms resting naturally on the chair armrests, legs visible, feet on the ground. The chair is dark black modern design. IMPORTANT: No table, no desk, no furniture other than the single chair. Only the man and his chair on a plain bright green screen background. Clean 3D character render, soft rim lighting, video game character concept art style.",
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
  curl -s -o public/assets/human-character-raw.png "$IMAGE_URL"
  echo "Saved raw image to public/assets/human-character-raw.png"

  # --- Remove green screen background ---
  echo ""
  echo "Removing green screen background..."

  if python3 -c "from PIL import Image" 2>/dev/null; then
    python3 scripts/remove-bg.py
  else
    echo ""
    echo "WARNING: Pillow not found."
    echo "Install with:  pip install Pillow numpy"
    echo "Then run:  python3 scripts/remove-bg.py"
    echo ""
    echo "For now, copying raw image as-is."
    cp public/assets/human-character-raw.png public/assets/human-character.png
  fi

  echo ""
  echo "Final image saved to public/assets/human-character.png"
else
  echo ""
  echo "Check response above for image URL, then save manually as:"
  echo "  public/assets/human-character-raw.png"
  echo "Then run:  python3 scripts/remove-bg.py"
fi
