"""Builds the Dreamscape artwork: Mini Kunjal's poses, the world planets and
the painted skies.

Sources
  reference/reference-ui.webp — Kunjal's reference board. Every character
  pose and illustrated planet is cut from it (no generated characters).

Steps
  1. Crops are upscaled 4x with Real-ESRGAN (x4plus-anime, GPU via Vulkan),
     reusing _work/ref_x4.png if a previous run left it there.
  2. Each pose / planet is cut out with u2net (onnxruntime) and given a soft,
     feathered alpha; flat crop edges are faded so they melt into the scene.
  3. Painted nebula skies are generated procedurally (fractal noise) per world.

Run from the repo root:   python tools/make_dreamscape.py [poses|planets|skies]
Requires: pip install opencv-python numpy pillow onnxruntime realesrgan-ncnn-py
The u2net model (~176 MB) is downloaded once to ~/.u2net/u2net.onnx.
"""
import os
import sys
import urllib.request

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
REF = "reference/reference-ui.webp"
CACHE = "_work/ref_x4.png"
OUT = "public/dream"
MODEL = os.path.expanduser("~/.u2net/u2net.onnx")
os.makedirs(OUT, exist_ok=True)
ONLY = sys.argv[1] if len(sys.argv) > 1 else None

_x4 = None


def x4_crop(box):
    """4x-upscaled crop of the reference (box in reference pixels), RGB array."""
    global _x4
    a, b, c, d = box
    if _x4 is None and os.path.exists(CACHE):
        _x4 = cv2.cvtColor(cv2.imread(CACHE), cv2.COLOR_BGR2RGB)
    if _x4 is not None:
        return _x4[b * 4 : d * 4, a * 4 : c * 4].copy()
    from realesrgan_ncnn_py import Realesrgan

    ref = Image.open(REF).convert("RGB").crop(box)
    up = Realesrgan(gpuid=0, model=3, tilesize=128).process_pil(ref)
    return np.asarray(up)


_sess = None


def u2net_prob(rgb):
    global _sess
    if _sess is None:
        if not os.path.exists(MODEL):
            os.makedirs(os.path.dirname(MODEL), exist_ok=True)
            urllib.request.urlretrieve("https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx", MODEL)
        so = ort.SessionOptions()
        so.enable_cpu_mem_arena = False
        so.enable_mem_pattern = False
        _sess = ort.InferenceSession(MODEL, so, providers=["CPUExecutionProvider"])
    h, w = rgb.shape[:2]
    a = cv2.resize(rgb, (320, 320), interpolation=cv2.INTER_AREA).astype(np.float32)
    a = (a / max(a.max(), 1) - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
    p = _sess.run(None, {_sess.get_inputs()[0].name: a.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
    p = (p - p.min()) / (p.max() - p.min() + 1e-6)
    return cv2.resize(p, (w, h), interpolation=cv2.INTER_CUBIC)


def cutout(rgb, fade_bottom=0.0, fade_left=0.0, fade_right=0.0, keep=None, drop=None, grab=True, prior=True):
    """Transparent cut-out. keep/drop: lists of (x0,y0,x1,y1) fractions of the crop
    that are definitely subject / definitely background."""
    h, w = rgb.shape[:2]
    p = u2net_prob(rgb)
    alpha = p
    if grab:
        if prior:
            m = np.where(p > 0.5, cv2.GC_PR_FGD, cv2.GC_PR_BGD).astype(np.uint8)
            m[p > 0.92] = cv2.GC_FGD
            m[p < 0.04] = cv2.GC_BGD
        else:  # u2net missed the subject: let GrabCut work from the hints alone
            m = np.full((h, w), cv2.GC_PR_FGD, np.uint8)
            p = np.ones_like(p)
        for (x0, y0, x1, y1) in drop or []:
            m[int(y0 * h) : int(y1 * h), int(x0 * w) : int(x1 * w)] = cv2.GC_BGD
        for (x0, y0, x1, y1) in keep or []:
            m[int(y0 * h) : int(y1 * h), int(x0 * w) : int(x1 * w)] = cv2.GC_FGD
        small = 900 / max(h, w)
        if small < 1:
            sm = cv2.resize(rgb, None, fx=small, fy=small, interpolation=cv2.INTER_AREA)
            mm = cv2.resize(m, (sm.shape[1], sm.shape[0]), interpolation=cv2.INTER_NEAREST)
        else:
            sm, mm = rgb, m
        bgd, fgd = np.zeros((1, 65)), np.zeros((1, 65))
        cv2.grabCut(cv2.cvtColor(sm, cv2.COLOR_RGB2BGR), mm, None, bgd, fgd, 5, cv2.GC_INIT_WITH_MASK)
        hard = np.where((mm == cv2.GC_FGD) | (mm == cv2.GC_PR_FGD), 1.0, 0.0).astype(np.float32)
        hard = cv2.resize(hard, (w, h), interpolation=cv2.INTER_LINEAR)
        n, lab, st, _ = cv2.connectedComponentsWithStats((hard > 0.5).astype(np.uint8))
        if n > 1:
            hard = hard * (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]))
        soft = cv2.GaussianBlur(hard, (0, 0), 1.6)
        band = cv2.dilate((hard > 0.5).astype(np.uint8), np.ones((11, 11))) - cv2.erode((hard > 0.5).astype(np.uint8), np.ones((11, 11)))
        alpha = np.where(band > 0, np.minimum(soft, p), soft)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    if fade_bottom:
        alpha *= np.clip((h - yy) / (fade_bottom * h), 0, 1)
    if fade_left:
        alpha *= np.clip(xx / (fade_left * w), 0, 1)
    if fade_right:
        alpha *= np.clip((w - xx) / (fade_right * w), 0, 1)
    a8 = (np.clip(alpha, 0, 1) * 255).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, a8]), "RGBA")
    box = img.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
    return img.crop(box)


def save(img, name, widths):
    for wdt in widths:
        if wdt > img.width:
            wdt = img.width
        h = round(img.height * wdt / img.width)
        img.resize((wdt, h), Image.LANCZOS).save(f"{OUT}/{name}-{wdt}.webp", quality=86, method=6)
        print(name, wdt, h)


# ---------------------------------------------------------------- poses ----
# All five come from the same reference board, so she stays one character.
POSES = {
    # chin on hand, head tilted — the guide's default
    "hello": dict(box=(834, 282, 950, 431), fade_bottom=0.16, prior=False,
                  keep=[(0.22, 0.32, 0.62, 1.0), (0.3, 0.12, 0.55, 0.32)],
                  drop=[(0.0, 0.0, 1.0, 0.03), (0.86, 0.0, 1.0, 1.0), (0.72, 0.0, 1.0, 0.3), (0.0, 0.0, 0.12, 0.12)]),
    # thoughtful, chin on hand (System Info portrait)
    "think": dict(box=(484, 505, 579, 611), fade_bottom=0.18),
    # hair blowing, warm light — her "wow" face
    "wow": dict(box=(1160, 812, 1328, 897), fade_bottom=0.2, prior=False,
                keep=[(0.3, 0.12, 0.72, 1.0)],
                drop=[(0.0, 0.0, 1.0, 0.02), (0.0, 0.0, 0.06, 1.0), (0.94, 0.0, 1.0, 1.0), (0.18, 0.08, 0.33, 0.38)]),
    # mid-dance, full figure
    "dance": dict(box=(866, 826, 1000, 1004), fade_bottom=0.04),
}

if ONLY in (None, "poses") or (ONLY or "").startswith("pose:"):
    for name, spec in POSES.items():
        if ONLY and ONLY.startswith("pose:") and name != ONLY[5:]:
            continue
        rgb = x4_crop(spec["box"])
        img = cutout(rgb, fade_bottom=spec.get("fade_bottom", 0), keep=spec.get("keep"), drop=spec.get("drop"), prior=spec.get("prior", True))
        if name == "wow":  # a sunlit window peeks through her hair on the left; remove it
            a = np.asarray(img).copy()
            hsv = cv2.cvtColor(np.ascontiguousarray(a[..., :3]), cv2.COLOR_RGB2HSV)
            left = np.zeros(a.shape[:2], bool)
            left[:, : int(a.shape[1] * 0.42)] = True
            pale = (hsv[..., 2] > 175) & (hsv[..., 1] < 95) & left
            pale = cv2.dilate(pale.astype(np.uint8), np.ones((9, 9))) > 0
            a[..., 3] = np.where(pale, 0, a[..., 3])
            a[..., 3] = cv2.GaussianBlur(a[..., 3], (0, 0), 1.2)
            img = Image.fromarray(a, "RGBA")
        save(img, f"pose-{name}", [520])
    # at her laptop (cut out earlier from the hero scene)
    work = Image.open("_work/pose-work-src.webp").convert("RGBA") if os.path.exists("_work/pose-work-src.webp") else None
    if work is not None:
        save(work, "pose-work", [620])

# -------------------------------------------------------------- planets ----
# The illustrated planets from the reference universe panel.
PLANETS = {
    "inventor": (950, 88, 1045, 170),  # castle-machine planet with a ring
    "observatory": (1330, 104, 1406, 180),  # big blue-lavender world
    "garden": (1335, 205, 1404, 280),  # copper-and-lilac world
    "daydream": (1230, 300, 1322, 395),  # ringed pink planet with blossoms
    "core": (1068, 168, 1300, 345),  # Kunjal.exe planet with the bow
    "moonlet": (1140, 112, 1196, 165),  # little spired moon
}

if ONLY in (None, "planets"):
    for name, box in PLANETS.items():
        rgb = x4_crop(box)
        img = cutout(rgb, grab=True)
        save(img, f"planet-{name}", [480 if name != "core" else 900])


# ---------------------------------------------------------------- skies ----
def fbm(h, w, octaves, base, seed):
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp = tot = 0.0
    amp = 1.0
    for o in range(octaves):
        g = rng.random((max(2, int(base * 2**o * h / w)), max(2, int(base * 2**o)))).astype(np.float32)
        out += amp * cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)
        tot += amp
        amp *= 0.55
    out /= tot
    return (out - out.min()) / (out.max() - out.min())


def sky(name, glows, seed, base=(33, 22, 41)):
    """A painterly night sky: deep base, soft coloured nebula clouds, grain."""
    W, H = 1920, 1080
    img = np.zeros((H, W, 3), np.float32) + np.array(base, np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    cloud = fbm(H, W, 7, 3, seed)
    wisps = fbm(H, W, 6, 6, seed + 1)
    for (cx, cy, rx, ry, col, k) in glows:
        d = np.sqrt(((xx - cx * W) / (rx * W)) ** 2 + ((yy - cy * H) / (ry * H)) ** 2)
        mask = np.clip(1 - d, 0, 1) ** 1.2
        mask *= np.clip(cloud * 1.9 - 0.3 + wisps * 0.35, 0, 1)
        img += mask[..., None] * (np.array(col, np.float32) - img) * min(1.0, k * 1.55)
    grain = (np.random.default_rng(seed + 2).random((H, W)) - 0.5) * 6
    img += grain[..., None]
    # vignette
    v = np.clip(1.05 - 0.6 * (((xx - W / 2) / (W * 0.7)) ** 2 + ((yy - H / 2) / (H * 0.75)) ** 2), 0.55, 1)
    img *= v[..., None]
    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    out.save(f"{OUT}/sky-{name}.webp", quality=80, method=6)
    out.resize((960, 540), Image.LANCZOS).save(f"{OUT}/sky-{name}-960.webp", quality=80, method=6)
    print("sky", name)


if ONLY in (None, "skies"):
    rose, lav, ivory = (221, 167, 198), (185, 174, 216), (255, 236, 245)
    sky("home", [(0.72, 0.28, 0.55, 0.5, rose, 0.55), (0.22, 0.7, 0.5, 0.45, lav, 0.45), (0.5, 0.5, 0.25, 0.25, ivory, 0.12)], 11)
    sky("inventor", [(0.75, 0.3, 0.6, 0.55, (150, 190, 214), 0.42), (0.2, 0.75, 0.5, 0.5, lav, 0.4)], 21, base=(22, 22, 40))
    sky("observatory", [(0.5, 0.25, 0.7, 0.5, (120, 120, 210), 0.45), (0.85, 0.75, 0.4, 0.4, rose, 0.3)], 31, base=(16, 16, 38))
    sky("garden", [(0.3, 0.35, 0.55, 0.5, (140, 210, 190), 0.38), (0.75, 0.7, 0.55, 0.5, rose, 0.45)], 41, base=(20, 26, 36))
    sky("daydream", [(0.6, 0.35, 0.6, 0.55, (246, 170, 150), 0.42), (0.2, 0.6, 0.5, 0.5, rose, 0.5)], 51, base=(40, 22, 42))
print("dreamscape art done")
