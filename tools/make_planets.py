"""Renders the planet surfaces as textured spheres (public/planets/*.webp).

Every planet shares one recipe so the system reads as a single art direction:
an equirectangular noise texture is wrapped onto a sphere, coloured from a
small palette and limb-darkened. Lighting (the day/night terminator) is NOT
baked in — the site adds it in CSS so each planet's dark side faces away from
the sun wherever it sits.

Run from the repo root:  python tools/make_planets.py
"""
import os

import cv2
import numpy as np
from PIL import Image

OUT = "public/planets"
N = 1024  # output size (px); a focused planet is drawn up to ~600 CSS px wide
rng_seed = 20261024


def fbm(h, w, octaves, base, seed, aniso=(1.0, 1.0)):
    """Fractal value noise in [0, 1], tileable horizontally enough for a sphere."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        gh = max(2, int(base * aniso[0] * 2 ** o))
        gw = max(2, int(base * aniso[1] * 2 ** o))
        g = rng.random((gh, gw)).astype(np.float32)
        g = np.concatenate([g, g[:, :1]], axis=1)  # wrap longitude
        layer = cv2.resize(g, (w + w // gw, h), interpolation=cv2.INTER_CUBIC)[:, :w]
        out += amp * layer
        total += amp
        amp *= 0.5
    out /= total
    return (out - out.min()) / (out.max() - out.min())


def palette(t, stops):
    """Map t in [0,1] through colour stops [(pos, '#rrggbb'), ...]."""
    pos = np.array([p for p, _ in stops], np.float32)
    cols = np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for _, c in stops], np.float32)
    out = np.zeros(t.shape + (3,), np.float32)
    for ch in range(3):
        out[..., ch] = np.interp(t, pos, cols[:, ch])
    return out


def sphere(texture_rgb, tilt_deg=0.0, rotate=0.0):
    """Wrap an equirectangular texture (H x W x 3) onto an N x N disc."""
    th, tw = texture_rgb.shape[:2]
    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
    x = (xx + 0.5) / N * 2 - 1
    y = (yy + 0.5) / N * 2 - 1
    r2 = x * x + y * y
    inside = r2 <= 1.0
    z = np.sqrt(np.clip(1 - r2, 0, 1))
    t = np.radians(tilt_deg)
    yr = y * np.cos(t) - x * np.sin(t)
    xr = x * np.cos(t) + y * np.sin(t)
    lat = np.arcsin(np.clip(yr, -1, 1))
    lon = np.arctan2(xr, z) + rotate
    u = ((lon / (2 * np.pi) + 0.5) % 1.0) * (tw - 1)
    v = (lat / np.pi + 0.5) * (th - 1)
    rgb = cv2.remap(texture_rgb.astype(np.float32), u.astype(np.float32), v.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
    limb = 0.62 + 0.38 * z ** 0.55  # soft limb darkening
    rgb = rgb * limb[..., None]
    # anti-aliased edge
    edge = np.clip((1 - np.sqrt(r2)) * N / 2.2, 0, 1)
    alpha = (edge * 255).astype(np.uint8)
    alpha[~inside] = 0
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    return np.dstack([rgb, alpha])


TH, TW = 768, 1536
lat = np.linspace(-1, 1, TH, dtype=np.float32)[:, None].repeat(TW, 1)


def gas_giant():  # 01 AI Lab — rose banded giant
    warp = fbm(TH, TW, 5, 3, rng_seed + 1)
    detail = fbm(TH, TW, 7, 4, rng_seed + 2, aniso=(3, 0.6))
    wide = 0.5 + 0.5 * np.sin(lat * 9 + (warp - 0.5) * 1.6)
    fine = 0.5 + 0.5 * np.sin(lat * 31 + (warp - 0.5) * 2.4 + detail * 1.5)
    t = np.clip(0.45 * wide + 0.3 * fine + 0.25 * detail, 0, 1)
    t = 0.18 + 0.7 * t
    tex = palette(t, [(0, "#6f3a62"), (0.35, "#b97c9f"), (0.6, "#dda7c6"), (0.82, "#f3d2e2"), (1, "#fbe9f1")])
    return sphere(tex, tilt_deg=-14)


def ice_world():  # 02 Observatory — pale lavender, faint bands (ringed in CSS/SVG)
    n = fbm(TH, TW, 6, 4, rng_seed + 3, aniso=(3, 0.7))
    bands = 0.5 + 0.5 * np.sin(lat * 15 + (n - 0.5) * 1.4)
    t = np.clip(0.55 * bands + 0.45 * n, 0, 1)
    t = 0.3 + 0.6 * t
    tex = palette(t, [(0, "#4a3f78"), (0.4, "#8f84c2"), (0.7, "#b9aed8"), (1, "#ece7fa")])
    return sphere(tex, tilt_deg=-16)


def cloud_world():  # 03 Living System — deep teal ocean with drifting cloud
    sea = fbm(TH, TW, 5, 4, rng_seed + 4)
    cloud = fbm(TH, TW, 7, 5, rng_seed + 5, aniso=(1, 2.2))
    cloud = np.clip((cloud - 0.5) * 2.6, 0, 1) ** 1.3
    base = palette(sea, [(0, "#20394a"), (0.5, "#2f5566"), (1, "#5f8f9a")])
    white = palette(np.ones_like(sea), [(0, "#e3f1f0"), (1, "#e3f1f0")])
    tex = base * (1 - cloud[..., None] * 0.85) + white * cloud[..., None] * 0.85
    return sphere(tex, tilt_deg=8)


def cratered_moon():  # 04 Archive — small ivory moon
    n = fbm(TH, TW, 6, 6, rng_seed + 6)
    tex_t = n.copy()
    rng = np.random.default_rng(rng_seed + 7)
    yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    for _ in range(26):
        cx, cy = rng.uniform(0, TW), rng.uniform(TH * 0.12, TH * 0.88)
        r = rng.uniform(6, 30)
        d = np.sqrt(((xx - cx) * 0.5) ** 2 + (yy - cy) ** 2) / r
        bowl = np.clip(1 - d, 0, 1) ** 0.6
        lit = np.exp(-((d - 0.95) ** 2) / 0.03) * np.clip((yy - cy) / r, 0, 1) * 0.12
        tex_t = tex_t - bowl * 0.22 + lit
    tex_t = np.clip((tex_t - tex_t.min()) / (tex_t.max() - tex_t.min()), 0, 1)
    tex = palette(tex_t, [(0, "#6e5245"), (0.45, "#c6a792"), (0.75, "#ead0bc"), (1, "#fff6ec")])
    return sphere(tex)


def marbled():  # 05 Creative — magenta marble
    w1 = fbm(TH, TW, 5, 3, rng_seed + 8)
    w2 = fbm(TH, TW, 5, 3, rng_seed + 9)
    yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    mx = (xx + (w1 - 0.5) * 220) % TW
    my = np.clip(yy + (w2 - 0.5) * 140, 0, TH - 1)
    base = fbm(TH, TW, 6, 4, rng_seed + 10, aniso=(1, 1.6))
    marble = cv2.remap(base, mx.astype(np.float32), my.astype(np.float32), cv2.INTER_LINEAR)
    veins = 0.5 + 0.5 * np.sin(marble * 26)
    t = np.clip(0.6 * marble + 0.4 * veins, 0, 1)
    t = 0.15 + 0.75 * t
    tex = palette(t, [(0, "#3f163a"), (0.4, "#8e4479"), (0.7, "#b4669a"), (0.9, "#e3a6c8"), (1, "#f6c4de")])
    return sphere(tex, tilt_deg=22)


def home_moon():  # Mini Kunjal's own moon — dusk violet, soft craters
    n = fbm(TH, TW, 7, 5, rng_seed + 11)
    rng = np.random.default_rng(rng_seed + 12)
    yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    t = n.copy()
    for _ in range(30):
        cx, cy, r = rng.uniform(0, TW), rng.uniform(TH * 0.15, TH * 0.85), rng.uniform(8, 40)
        d = np.sqrt(((xx - cx) * 0.5) ** 2 + (yy - cy) ** 2) / r
        t = t - np.clip(1 - d, 0, 1) ** 0.6 * 0.16 + np.exp(-((d - 0.95) ** 2) / 0.03) * np.clip((yy - cy) / r, 0, 1) * 0.08
    t = np.clip((t - t.min()) / (t.max() - t.min()), 0, 1)
    tex = palette(t, [(0, "#1d1424"), (0.5, "#3a2b45"), (0.8, "#5a4568"), (1, "#7a6388")])
    return sphere(tex)


os.makedirs(OUT, exist_ok=True)
for name, fn in [
    ("lab", gas_giant),
    ("observatory", ice_world),
    ("system", cloud_world),
    ("archive", cratered_moon),
    ("creative", marbled),
    ("home-moon", home_moon),
]:
    img = Image.fromarray(fn(), "RGBA")
    img.save(f"{OUT}/{name}.webp", quality=86, method=6)
    print(name)
