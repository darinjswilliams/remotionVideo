#!/usr/bin/env python3
"""
Remove green screen background from human-character image.
Run from remotionVideos/ folder:  python3 scripts/remove-bg.py
Requires: pip install Pillow numpy
"""
from PIL import Image
import numpy as np

import os
# Use raw file if available, otherwise the existing file
RAW = "public/assets/human-character-raw.png"
INPUT = RAW if os.path.exists(RAW) else "public/assets/human-character.png"
OUTPUT = "public/assets/human-character.png"

print(f"Loading {INPUT}...")
img = Image.open(INPUT).convert("RGBA")
data = np.array(img, dtype=np.float64)

r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# --- Green screen detection ---
# A pixel is "green screen" if green channel dominates red and blue
green_ratio_r = g / (r + 1)  # +1 to avoid division by zero
green_ratio_b = g / (b + 1)

# Core green mask: strong green pixels
core_green = (g > 80) & (green_ratio_r > 1.2) & (green_ratio_b > 1.2)

# Calculate how "green" each pixel is (0 to 1 scale)
greenness = np.clip((green_ratio_r - 1.0) * (green_ratio_b - 1.0), 0, 10) / 10.0
greenness[~core_green] = 0

# Make fully green pixels fully transparent
full_green = greenness > 0.3
data[full_green, 3] = 0

# Edge pixels: partial transparency for smooth blending
edge_zone = (greenness > 0.05) & (greenness <= 0.3)
edge_alpha = np.clip(1.0 - (greenness[edge_zone] / 0.3), 0, 1) * 255
data[edge_zone, 3] = edge_alpha

# Remove green spill from edge pixels (desaturate the green cast)
spill_mask = (greenness > 0.01) & (data[:,:,3] > 0)
if np.any(spill_mask):
    # Reduce green channel towards the average of red and blue
    avg_rb = (data[spill_mask, 0] + data[spill_mask, 2]) / 2.0
    spill_strength = np.clip(greenness[spill_mask] * 2, 0, 0.8)
    data[spill_mask, 1] = data[spill_mask, 1] * (1 - spill_strength) + avg_rb * spill_strength

result = Image.fromarray(data.astype(np.uint8))
result.save(OUTPUT, "PNG")
print(f"Done! Saved transparent image to {OUTPUT}")
print(f"Image size: {result.size[0]}x{result.size[1]}")
