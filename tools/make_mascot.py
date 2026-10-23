"""Builds the Mini Kunjal assets from the reference illustration.

Mini Kunjal (with her laptop and drink) is cut out of the hero panel of
reference/reference-ui.webp with a transparent background:

  1. u2net (via onnxruntime) gives a rough foreground probability.
  2. GrabCut refines it, seeded with hand-placed keep/drop regions and a
     colour hint (her hair is warm brown, the backdrop behind it is violet).
  3. The edge is softened, the hair fades out where it meets the cropped desk,
     and a soft rose rim light is baked in on the side facing the sun.

Requirements: pip install opencv-python onnxruntime numpy pillow
The u2net model (~176 MB) is downloaded once to ~/.u2net/u2net.onnx from
https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx

Run from the repo root:  python tools/make_mascot.py
"""
import os
import urllib.request

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image

SRC = "reference/reference-ui.webp"
OUT = "public/mascot"
MODEL = os.path.expanduser("~/.u2net/u2net.onnx")
MODEL_URL = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx"
X0, Y0, X1, Y1 = 125, 88, 470, 400  # crop in the 1536x1024 reference
S = 3  # work at 3x so the matte edge is smooth

ref = cv2.imread(SRC)
crop = ref[Y0:Y1, X0:X1]
up = cv2.resize(crop, (crop.shape[1] * S, crop.shape[0] * S), interpolation=cv2.INTER_LANCZOS4)
h, w = up.shape[:2]


def o2u(pts):
    """Reference-image coordinates -> working-image coordinates."""
    return np.array([[(x - X0) * S, (y - Y0) * S] for x, y in pts], np.int32)


def rect(x0, y0, x1, y1):
    return o2u([(x0, y0), (x1, y0), (x1, y1), (x0, y1)])


# 1. u2net prior -------------------------------------------------------------
if not os.path.exists(MODEL):
    os.makedirs(os.path.dirname(MODEL), exist_ok=True)
    urllib.request.urlretrieve(MODEL_URL, MODEL)
so = ort.SessionOptions()
so.enable_cpu_mem_arena = False
so.enable_mem_pattern = False
sess = ort.InferenceSession(MODEL, so, providers=["CPUExecutionProvider"])
a = cv2.cvtColor(cv2.resize(up, (320, 320), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB).astype(np.float32)
a = (a / a.max() - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
prob = sess.run(None, {sess.get_inputs()[0].name: a.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
prob = cv2.resize((prob - prob.min()) / (prob.max() - prob.min()), (w, h))

# 2. GrabCut with seeds ------------------------------------------------------
m = np.where(prob > 0.5, cv2.GC_PR_FGD, cv2.GC_PR_BGD).astype(np.uint8)
drop = [
    rect(125, 128, 199, 211),  # speech bubble
    rect(125, 328, 214, 402),  # cat
    rect(368, 88, 470, 262),  # city / title behind her right side
    rect(125, 88, 470, 112),  # top strip
    rect(125, 88, 222, 124),
    rect(125, 88, 128, 402),  # left edge
    rect(462, 88, 470, 402),  # right edge
    rect(125, 396, 470, 402),  # desk edge
    o2u([(452, 333), (470, 333), (470, 402), (438, 402)]),  # headphones
]
keep = [
    rect(250, 163, 335, 250),  # face
    o2u([(262, 155), (290, 130), (310, 133), (318, 160), (322, 182), (255, 182)]),  # crown
    rect(212, 258, 288, 340),  # torso
    rect(232, 305, 278, 390),  # drink
    o2u([(298, 278), (452, 272), (440, 374), (296, 384)]),  # laptop lid
]
for poly in drop:
    cv2.fillPoly(m, [poly], cv2.GC_BGD)
hsv = cv2.cvtColor(up, cv2.COLOR_BGR2HSV)
violet = (hsv[..., 0] >= 112) & (hsv[..., 0] <= 176) & (hsv[..., 1] > 35) & (hsv[..., 2] > 60)
zones = np.zeros((h, w), np.uint8)
for z in [rect(125, 112, 234, 345), rect(195, 112, 372, 160), rect(300, 112, 372, 268)]:
    cv2.fillPoly(zones, [z], 1)
m[violet & (zones == 1)] = cv2.GC_BGD
for poly in keep:
    cv2.fillPoly(m, [poly], cv2.GC_FGD)
bgd, fgd = np.zeros((1, 65)), np.zeros((1, 65))
cv2.grabCut(up, m, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
mask = np.where((m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

n, lab, st, _ = cv2.connectedComponentsWithStats(mask)
mask = np.where(lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))

# 3. Soft edge, hair fade, rim light -----------------------------------------
soft = cv2.GaussianBlur(mask, (0, 0), 1.6).astype(np.float32)
band = cv2.dilate(mask, np.ones((9, 9), np.uint8)) - cv2.erode(mask, np.ones((9, 9), np.uint8))
alpha = np.where(band > 0, np.minimum(soft, prob * 255), soft)

yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
hair_end_y, hair_end_x = (328 - Y0) * S, (238 - X0) * S
fade = np.clip((hair_end_y - yy) / (70 * 1.0), 0, 1)  # left hair fades out above the cropped cat
alpha = np.where(xx < hair_end_x, alpha * np.maximum(fade, np.clip((xx - hair_end_x + 60) / 60, 0, 1)), alpha)
# where thin hair crosses the violet backdrop, keep the strands but drop the backdrop
lzone = np.zeros((h, w), np.uint8)
cv2.fillPoly(lzone, [rect(125, 150, 250, 345)], 1)
vio = cv2.GaussianBlur(violet.astype(np.float32), (0, 0), 1.2)
alpha = np.where(lzone == 1, alpha * (1 - 0.9 * vio), alpha)
alpha = np.clip(alpha, 0, 255)

img = up.astype(np.float32)
# gentle key-light falloff: a touch darker on the far (left) side
img *= (0.84 + 0.16 * (xx / w))[..., None]
# rim light on edges that face right (toward the sun)
a8 = alpha.astype(np.uint8)
shifted = np.zeros_like(a8)
shifted[:, : -10] = a8[:, 10:]
rim = np.clip(a8.astype(np.float32) - shifted.astype(np.float32), 0, 255) / 255.0
rim = cv2.GaussianBlur(rim, (0, 0), 3) * 0.55
rose = np.array([225, 205, 250], np.float32)  # BGR, warm rose-ivory
img = img * (1 - rim[..., None]) + rose * rim[..., None]
img = np.clip(img, 0, 255).astype(np.uint8)

rgba = np.dstack([cv2.cvtColor(img, cv2.COLOR_BGR2RGB), alpha.astype(np.uint8)])
full = Image.fromarray(rgba, "RGBA")
bbox = full.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
full = full.crop(bbox)

os.makedirs(OUT, exist_ok=True)
for name in os.listdir(OUT):
    if name.startswith("mini-kunjal"):
        os.remove(os.path.join(OUT, name))
full.save(f"{OUT}/mini-kunjal@2x.webp", quality=88, method=6)
half = full.resize((full.width // 2, full.height // 2), Image.LANCZOS)
half.save(f"{OUT}/mini-kunjal.webp", quality=88, method=6)
half.save(f"{OUT}/mini-kunjal.png", optimize=True)

# Round avatar (header, terminal, favicon) from the original pixels.
fx0, fy0, s = 236, 130, 116
face = cv2.cvtColor(ref[fy0:fy0 + s, fx0:fx0 + s], cv2.COLOR_BGR2RGB)
face = Image.fromarray(face).resize((256, 256), Image.LANCZOS)
circle = Image.new("L", (256, 256), 0)
from PIL import ImageDraw

ImageDraw.Draw(circle).ellipse((0, 0, 255, 255), fill=255)
face.putalpha(circle)
face.save(f"{OUT}/avatar.webp", quality=90)
face.resize((64, 64), Image.LANCZOS).save("public/favicon.png", optimize=True)
face.resize((180, 180), Image.LANCZOS).save("public/apple-touch-icon.png", optimize=True)
print("mascot", full.size, "->", half.size)
