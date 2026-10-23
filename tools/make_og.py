"""Builds public/og-image.png (1200x630) for social sharing.
Run from the repo root after make_mascot.py:  python tools/make_og.py
Uses the bundled Fraunces/Manrope fonts from node_modules if available,
otherwise falls back to Georgia (Windows) or PIL's default font."""
import glob
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), (33, 22, 41))
d = ImageDraw.Draw(img)

# soft nebula glows
glow = Image.new("RGB", (W, H), (0, 0, 0))
g = ImageDraw.Draw(glow)
g.ellipse((700, -150, 1300, 350), fill=(70, 55, 100))
g.ellipse((-200, 380, 500, 900), fill=(80, 45, 75))
img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(120)), 0.55)
d = ImageDraw.Draw(img)

rnd = random.Random(7)
for _ in range(140):
    x, y, r = rnd.uniform(0, W), rnd.uniform(0, H), rnd.choice([1, 1, 1, 1.5, 2])
    c = rnd.randint(150, 255)
    d.ellipse((x - r, y - r, x + r, y + r), fill=(c, c - 10, c))

# orbit + planets on the right
d.ellipse((560, 120, 1160, 520), outline=(110, 100, 125), width=1)
d.ellipse((660, 190, 1060, 450), outline=(110, 100, 125), width=1)

def planet(cx, cy, r, light, dark):
    p = Image.new("RGBA", (r * 2, r * 2))
    pd = ImageDraw.Draw(p)
    for i in range(r, 0, -1):
        t = i / r
        col = tuple(int(light[k] * (1 - t) + dark[k] * t) for k in range(3))
        off = int((r - i) * 0.35)
        pd.ellipse((r - i - off, r - i - off, r + i - off, r + i - off), fill=col + (255,))
    mask = Image.new("L", (r * 2, r * 2))
    ImageDraw.Draw(mask).ellipse((0, 0, r * 2 - 1, r * 2 - 1), fill=255)
    img.paste(p, (cx - r, cy - r), mask)

planet(860, 320, 70, (255, 240, 248), (150, 90, 135))
planet(1075, 300, 34, (248, 220, 234), (106, 53, 89))
planet(700, 230, 30, (236, 231, 250), (65, 55, 106))
planet(960, 470, 28, (221, 240, 239), (47, 76, 90))
planet(820, 150, 22, (255, 246, 236), (119, 87, 74))

# mascot
m = Image.open("public/mascot/mini-kunjal@2x.webp").convert("RGBA")
m = m.resize((int(m.width * 380 / m.height), 380), Image.LANCZOS)
img.paste(m, (520, 250), m)

def font(patterns, size):
    for pat in patterns:
        for f in glob.glob(pat):
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                pass
    return ImageFont.load_default()

serif_i = font(["C:/Windows/Fonts/georgiai.ttf", "/usr/share/fonts/**/DejaVuSerif-Italic.ttf"], 92)
serif = font(["C:/Windows/Fonts/georgia.ttf", "/usr/share/fonts/**/DejaVuSerif.ttf"], 42)
mono = font(["C:/Windows/Fonts/consola.ttf", "/usr/share/fonts/**/DejaVuSansMono.ttf"], 20)
body = font(["C:/Windows/Fonts/segoeui.ttf", "/usr/share/fonts/**/DejaVuSans.ttf"], 24)

d = ImageDraw.Draw(img)
d.text((70, 130), "ORBIT 00 · HER LITTLE UNIVERSE", font=mono, fill=(221, 167, 198))
d.text((64, 170), "Kunjal", font=serif_i, fill=(255, 247, 251))
w = d.textlength("Kunjal", font=serif_i)
d.text((64 + w, 170), ".exe", font=serif_i, fill=(221, 167, 198))
d.text((70, 300), "Her Little Universe", font=serif, fill=(217, 207, 226))
d.text((70, 380), "AI & Data Science engineer", font=body, fill=(217, 207, 226))
d.text((70, 414), "& creative technologist", font=body, fill=(217, 207, 226))
d.text((70, 520), "Kunjal Mahajan", font=mono, fill=(179, 166, 194))

img.save("public/og-image.png", optimize=True)
print("og-image.png written")
