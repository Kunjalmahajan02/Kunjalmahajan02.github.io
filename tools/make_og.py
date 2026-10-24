"""Builds public/og-image.png (1200x630), the link-preview image: Mini
Kunjal's apartment (rendered by tools/render_house.mjs) on pink gingham,
with her name.

Run from the repo root:  python tools/make_og.py
Fonts: Segoe UI / Georgia on Windows, DejaVu elsewhere."""
import glob
import os
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PLUM = (154, 95, 134)
INK = (74, 39, 66)
INK_SOFT = (111, 71, 102)
PINK = (255, 126, 182)
HOT = (226, 70, 138)
BLUSH = (255, 191, 219)

# 1. the apartment, drawn by the site's own scene code (late morning, coding)
tmp = os.path.join(tempfile.gettempdir(), "kx-house.png")
subprocess.run(["node", "tools/render_house.mjs", tmp, "11", "code", "1.25"], check=True)
house = Image.open(tmp).convert("RGB")  # 800 x 500

# 2. pink gingham background
img = Image.new("RGB", (W, H), (255, 243, 248))
d = ImageDraw.Draw(img, "RGBA")
for i in range(0, max(W, H), 28):
    d.rectangle([i, 0, i + 13, H], fill=(255, 191, 219, 70))
    d.rectangle([0, i, W, i + 13], fill=(255, 191, 219, 70))

# 3. the house in a cream frame with a hard plum shadow
hx, hy = W - house.width - 22, (H - house.height) // 2
d.rounded_rectangle([hx - 6 + 8, hy - 6 + 8, hx + house.width + 6 + 8, hy + house.height + 6 + 8], 14, fill=PLUM)
d.rounded_rectangle([hx - 6, hy - 6, hx + house.width + 6, hy + house.height + 6], 14, fill=(255, 250, 244), outline=PLUM, width=3)
img.paste(house, (hx, hy))


def font(patterns, size):
    for pat in patterns:
        for f in glob.glob(pat, recursive=True):
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                pass
    return ImageFont.load_default()


big = font(["C:/Windows/Fonts/segoeuib.ttf", "/usr/share/fonts/**/DejaVuSans-Bold.ttf"], 64)
mid = font(["C:/Windows/Fonts/segoeuib.ttf", "/usr/share/fonts/**/DejaVuSans-Bold.ttf"], 21)
hand = font(["C:/Windows/Fonts/segoeprb.ttf", "C:/Windows/Fonts/georgiai.ttf", "/usr/share/fonts/**/DejaVuSerif-Italic.ttf"], 23)
small = font(["C:/Windows/Fonts/segoeui.ttf", "/usr/share/fonts/**/DejaVuSans.ttf"], 17)

# 4. text on a cream card on the left
cx, cy, cw, ch = 30, 120, 340, 390
d.rounded_rectangle([cx + 6, cy + 6, cx + cw + 6, cy + ch + 6], 14, fill=BLUSH)
d.rounded_rectangle([cx, cy, cx + cw, cy + ch], 14, fill=(255, 250, 244), outline=PLUM, width=3)
d.text((cx + 24, cy + 26), "hi, i'm", font=hand, fill=HOT)
d.text((cx + 27, cy + 69), "Kunjal", font=big, fill=BLUSH)
d.text((cx + 24, cy + 66), "Kunjal", font=big, fill=INK)
d.text((cx + 27, cy + 137), "Mahajan", font=big, fill=BLUSH)
d.text((cx + 24, cy + 134), "Mahajan", font=big, fill=INK)
d.text((cx + 24, cy + 222), "AI & Data Science Engineer", font=mid, fill=INK)
d.text((cx + 24, cy + 252), "Computer Vision · Deep Learning · GenAI", font=small, fill=INK_SOFT)
d.text((cx + 24, cy + 300), "part engineer, part artist,", font=hand, fill=HOT)
d.text((cx + 24, cy + 334), "entirely too curious.", font=hand, fill=HOT)

# 5. the menu-bar label
d.rounded_rectangle([30, 40, 340, 84], 22, fill=(255, 250, 244), outline=PLUM, width=3)
d.rounded_rectangle([40, 49, 66, 75], 7, fill=PINK, outline=PLUM, width=2)
d.text((46, 47), "♡", font=mid, fill=(255, 255, 255))
d.text((78, 51), "KUNJAL.EXE · a little universe", font=small, fill=INK)

img.save("public/og-image.png", optimize=True)
print("og-image.png written")
