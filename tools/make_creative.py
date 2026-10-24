"""Builds the CREATIVE.EXE illustrations: each of Kunjal's pose images (a
transparent PNG/WebP of Mini Kunjal) on a soft glowing background, 640 x 480,
saved as public/art/creative-<name>-640.webp.

Run from the repo root:
    python tools/make_creative.py DANCE.png ART.png FASHION.png MODELING.png
"""
import random
import sys

from PIL import Image, ImageDraw, ImageFilter

W, H = 640, 480
# each picture's background: top and bottom colour of the gradient
TONES = {
    'dance': ((248, 222, 236), (214, 196, 238)),
    'art': ((250, 232, 214), (240, 206, 196)),
    'fashion': ((252, 226, 236), (236, 190, 210)),
    'modeling': ((244, 230, 222), (214, 186, 200)),
}
if len(sys.argv) != 5:
    sys.exit(__doc__)
shots = dict(zip(TONES, sys.argv[1:]))


def background(c0, c1, seed):
    bg = Image.new('RGB', (W, H), c1)
    d = ImageDraw.Draw(bg)
    # soft vertical gradient
    for y in range(H):
        k = y / H
        d.line([(0, y), (W, y)], fill=tuple(round(c0[i] * (1 - k) + c1[i] * k) for i in range(3)))
    # a warm glow behind her
    glow = Image.new('L', (W, H), 0)
    ImageDraw.Draw(glow).ellipse([W * 0.2, H * 0.08, W * 0.8, H * 0.95], fill=150)
    glow = glow.filter(ImageFilter.GaussianBlur(70))
    bg = Image.composite(Image.new('RGB', (W, H), (255, 246, 236)), bg, glow)
    # a few sparkles
    d = ImageDraw.Draw(bg)
    rnd = random.Random(seed)
    for _ in range(14):
        x, y, s = rnd.randint(20, W - 20), rnd.randint(20, H - 60), rnd.choice([3, 4, 5, 6])
        col = (255, 255, 255)
        d.polygon([(x, y - s), (x + s * 0.3, y - s * 0.3), (x + s, y), (x + s * 0.3, y + s * 0.3), (x, y + s), (x - s * 0.3, y + s * 0.3), (x - s, y), (x - s * 0.3, y - s * 0.3)], fill=col)
    return bg


for i, (name, src) in enumerate(shots.items()):
    c0, c1 = TONES[name]
    fig = Image.open(src).convert('RGBA')
    fig = fig.crop(fig.getbbox())
    scale = min((H - 34) / fig.height, (W - 60) / fig.width)
    fig = fig.resize((round(fig.width * scale), round(fig.height * scale)), Image.LANCZOS)
    bg = background(c0, c1, i).convert('RGBA')
    # soft floor shadow
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse([W / 2 - fig.width * 0.32, H - 30, W / 2 + fig.width * 0.32, H - 12], fill=(90, 50, 70, 70))
    bg.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    bg.alpha_composite(fig, ((W - fig.width) // 2, H - 20 - fig.height))
    bg.convert('RGB').save(f'public/art/creative-{name}-{W}.webp', quality=92, method=4)
    print(name, fig.size, f'scale {scale:.2f}')
