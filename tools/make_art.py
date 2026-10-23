"""Builds the illustrated artwork from Kunjal's reference board.

Every illustration on the site (her room, the illustrated universe, the robot,
the cat, the chibi Kunjals, desktop icons and moodboard images) comes from
reference/reference-ui.webp. Baked-in text is erased so the site can draw real,
accessible text on top, and everything is upscaled 4x with Real-ESRGAN
(x4plus-anime, via realesrgan-ncnn-py on the GPU) before export.

Run from the repo root:  python tools/make_art.py
Requires: pip install opencv-python pillow realesrgan-ncnn-py
"""
import os

import cv2
import numpy as np
from PIL import Image
from realesrgan_ncnn_py import Realesrgan

Image.MAX_IMAGE_PIXELS = None
SRC = "reference/reference-ui.webp"
OUT = "public/art"
os.makedirs(OUT, exist_ok=True)
ref = cv2.imread(SRC)
def x4(bgr):
    """4x upscale with realesrgan-x4plus-anime (a fresh GPU session per image)."""
    rgb = Image.fromarray(np.ascontiguousarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)))
    up = Realesrgan(gpuid=0, model=3, tilesize=128)
    out = up.process_pil(rgb)
    del up
    return out


def clean(box, erase, pad=3, night=False, source=None):
    """Crop `box` and inpaint every rectangle in `erase` (reference coords).

    night=True is for text on dark sky: the erased patch is pulled toward the
    surrounding sky colour and sprinkled with a few stars so it doesn't read
    as a smudge.
    """
    x0, y0, x1, y1 = box
    img = (ref if source is None else source)[y0:y1, x0:x1].copy()
    mask = np.zeros(img.shape[:2], np.uint8)
    for a, b, c, d in erase:
        cv2.rectangle(mask, (a - x0 - pad, b - y0 - pad), (c - x0 + pad, d - y0 + pad), 255, -1)
    out = cv2.inpaint(img, mask, 4, cv2.INPAINT_TELEA)
    if night:
        soft = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 3)[..., None]
        sky = cv2.GaussianBlur(out, (0, 0), 9).astype(np.float32)
        sky = sky * 0.75 + np.array([40, 16, 30], np.float32) * 0.25  # BGR toward deep plum
        out = (out * (1 - soft) + sky * soft).astype(np.uint8)
        rng = np.random.default_rng(7)
        ys, xs = np.nonzero(mask)
        for i in rng.choice(len(xs), size=max(1, len(xs) // 900), replace=False):
            v = int(rng.integers(150, 255))
            cv2.circle(out, (int(xs[i]), int(ys[i])), 0, (v, v - 20, v), -1)
    return out


def save(img, name, widths):
    for wdt in widths:
        h = round(img.height * wdt / img.width)
        img.resize((wdt, h), Image.LANCZOS).save(f"{OUT}/{name}-{wdt}.webp", quality=84, method=6)


import sys

ONLY = sys.argv[1] if len(sys.argv) > 1 else None

# Her room (hero). Text, bubbles and the menu card are erased; the site draws them.
HERO = (0, 30, 824, 398)
hero = None
if ONLY in (None, "hero"):
    # the title sits on night sky: fill it as sky; the rest is covered by UI
    sky = ref.copy()
    sky[HERO[1]:HERO[3], HERO[0]:HERO[2]] = clean(HERO, [(345, 70, 608, 163)], pad=5, night=True)
    hero = clean(HERO, [(75, 129, 198, 209), (467, 181, 590, 342), (682, 314, 760, 356)], source=sky)
if hero is not None:
    save(x4(hero), "hero", [1100, 1800, 2600])

# The illustrated universe. Title, planet labels and the bubble are erased.
UNIV = (833, 30, 1536, 431)
univ = clean(
    UNIV,
    [
        (1068, 40, 1291, 98),
        (1020, 107, 1118, 150),
        (1198, 120, 1313, 160),
        (1403, 112, 1530, 155),
        (979, 189, 1068, 229),
        (1400, 221, 1509, 262),
        (969, 302, 1071, 343),
        (1433, 313, 1517, 355),
        (1258, 368, 1369, 409),
        (1460, 381, 1530, 420),
        (940, 352, 1056, 418),
    ],
    pad=5,
    night=True,
)
if ONLY in (None, "universe"):
    save(x4(univ), "universe", [1100, 1800, 2600])
if ONLY:
    raise SystemExit(0)

# Stickers, portraits and moodboard pieces (plain crops, upscaled).
crops = {
    "robot": (596, 280, 690, 402),
    "robot-os": (716, 590, 800, 705),
    "cat": (122, 325, 216, 396),
    "archive-girl": (140, 858, 330, 1012),
    "camera-girl": (1388, 895, 1476, 1012),
    "project-girl": (1462, 600, 1536, 722),
    "portrait": (482, 503, 580, 612),
    "blinkbridge-icon": (968, 481, 1033, 545),
    "mood-dance": (845, 810, 1004, 1008),
    "mood-back": (1010, 810, 1153, 940),
    "mood-portrait": (1158, 810, 1330, 905),
    "mood-sketch": (1224, 930, 1332, 1008),
}
for name, (a, b, c, d) in crops.items():
    img = x4(ref[b:d, a:c])
    target = min(img.width, 720)
    save(img, name, [target])

# Desktop icons (labels are drawn by the site).
icons = {"me": (38, 486), "projects": (103, 486), "research": (38, 550), "creative": (103, 550),
         "archive": (38, 609), "terminal": (103, 609), "resume": (38, 669), "trash": (103, 669)}
for name, (cx, cy) in icons.items():
    img = x4(ref[cy - 18:cy + 17, cx - 18:cx + 18])
    img.resize((96, 96), Image.LANCZOS).save(f"{OUT}/icon-{name}.webp", quality=88)
print("art done")
