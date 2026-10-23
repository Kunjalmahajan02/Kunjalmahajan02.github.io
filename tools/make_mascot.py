"""Builds the Mini Kunjal assets from the reference illustration.

The mascot is cut from reference/reference-ui.webp (hero panel), the speech
bubble beside her is inpainted away, and the portrait gets a feathered alpha
edge so it sits naturally on the plum background. Run from the repo root:
    python tools/make_mascot.py
"""
import cv2
import numpy as np
from PIL import Image, ImageFilter

SRC = "reference/reference-ui.webp"
OUT = "public/mascot"
BOX = (132, 90, 366, 398)  # x0, y0, x1, y1 in the 1536x1024 reference

img = cv2.imread(SRC, cv2.IMREAD_COLOR)

# 1. Remove the speech bubble (bright, low-saturation pixels left of her hair).
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
region = np.zeros(img.shape[:2], np.uint8)
region[118:216, 60:200] = 255
bright = ((hsv[..., 2] > 175) & (hsv[..., 1] < 80)).astype(np.uint8) * 255
bubble = cv2.bitwise_and(bright, region)
bubble = cv2.morphologyEx(bubble, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
# fill the bubble's interior (text strokes) and grow past its outline
cnts, _ = cv2.findContours(bubble, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cv2.drawContours(bubble, cnts, -1, 255, cv2.FILLED)
bubble = cv2.dilate(bubble, np.ones((7, 7), np.uint8))
clean = cv2.inpaint(img, bubble, 9, cv2.INPAINT_TELEA)

x0, y0, x1, y1 = BOX
crop = cv2.cvtColor(clean[y0:y1, x0:x1], cv2.COLOR_BGR2RGB)
h, w = crop.shape[:2]

# 2. Feathered alpha: soft ellipse, slightly wider at the bottom, fully opaque
#    over her face and shoulders.
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
cx, cy = w * 0.53, h * 0.5
rx, ry = w * 0.5, h * 0.5
d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
alpha = np.clip((1.0 - d) / 0.24, 0, 1)
alpha = alpha ** 0.8
# fade the bottom edge (desk / UI chips) a little earlier
alpha *= np.clip((h - 6 - yy) / 40, 0, 1)
a8 = (alpha * 255).astype(np.uint8)

rgba = np.dstack([crop, a8])
base = Image.fromarray(rgba, "RGBA")

# 3. Export a 2x and 1x version (Lanczos + gentle sharpening).
for scale, suffix in ((3, "@2x"), (1.5, "")):
    size = (round(w * scale), round(h * scale))
    out = base.resize(size, Image.LANCZOS)
    rgb = out.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    out = Image.merge("RGBA", (*rgb.split(), out.split()[3]))
    out.save(f"{OUT}/mini-kunjal{suffix}.webp", quality=90, method=6)
    out.save(f"{OUT}/mini-kunjal{suffix}.png", optimize=True)

# 4. Round face avatar (favicon, guide bubbles) from the same artwork.
fx0, fy0, s = 236, 130, 116
face = cv2.cvtColor(clean[fy0:fy0 + s, fx0:fx0 + s], cv2.COLOR_BGR2RGB)
face = Image.fromarray(face).resize((256, 256), Image.LANCZOS)
m = Image.new("L", (256, 256), 0)
from PIL import ImageDraw
ImageDraw.Draw(m).ellipse((0, 0, 255, 255), fill=255)
face.putalpha(m)
face.save(f"{OUT}/avatar.webp", quality=90)
face.save(f"{OUT}/avatar.png", optimize=True)
face.resize((64, 64), Image.LANCZOS).save("public/favicon.png", optimize=True)
face.resize((180, 180), Image.LANCZOS).save("public/apple-touch-icon.png", optimize=True)
print("mascot", w, h)
