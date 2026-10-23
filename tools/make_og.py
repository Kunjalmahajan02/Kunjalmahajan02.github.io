"""Builds public/og-image.png (1200x630), the link-preview image.

Her room (from public/art, built by make_art.py) on the right, fading into
the night on the left where the title sits. Run from the repo root:
    python tools/make_og.py
Fonts: Georgia / Segoe UI / Consolas on Windows, DejaVu elsewhere."""
import glob
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), (27, 16, 41))

glow = Image.new("RGB", (W, H), (0, 0, 0))
g = ImageDraw.Draw(glow)
g.ellipse((-200, 380, 500, 900), fill=(90, 40, 80))
img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(120)), 0.5)

d = ImageDraw.Draw(img)
rnd = random.Random(7)
for _ in range(90):
    x, y, r = rnd.uniform(0, 520), rnd.uniform(0, H), rnd.choice([1, 1, 1, 1.5, 2])
    c = rnd.randint(150, 255)
    d.ellipse((x - r, y - r, x + r, y + r), fill=(c, c - 10, c))

# her room: the girl, laptop, cat and books, faded in from the left
room = Image.open("public/art/hero-1800.webp").convert("RGBA")
RH = 780  # a little taller than the card, so the crop can stay on her side of the room
room = room.resize((int(room.width * RH / room.height), RH), Image.LANCZOS)
x0, x1 = int(room.width * 0.17), int(room.width * 0.555)  # between the erased bubble and menu card
RW = x1 - x0
room = room.crop((x0, RH - H - 40, x1, RH - 40))
ramp = Image.linear_gradient("L").rotate(90, expand=True).resize((RW, H))  # dark → light, left → right
alpha = ramp.point(lambda v: 255 if v > 110 else int(v / 110 * 255))
room.putalpha(alpha)
img.paste(room, (W - RW, 0), room)


def font(patterns, size):
    for pat in patterns:
        for f in glob.glob(pat, recursive=True):
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                pass
    return ImageFont.load_default()


serif_i = font(["C:/Windows/Fonts/georgiaz.ttf", "C:/Windows/Fonts/georgiai.ttf", "/usr/share/fonts/**/DejaVuSerif-BoldItalic.ttf"], 92)
body = font(["C:/Windows/Fonts/segoeui.ttf", "/usr/share/fonts/**/DejaVuSans.ttf"], 30)
small = font(["C:/Windows/Fonts/segoeuib.ttf", "/usr/share/fonts/**/DejaVuSans-Bold.ttf"], 18)

# glowing title
layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ld = ImageDraw.Draw(layer)
ld.text((60, 190), "Kunjal.exe", font=serif_i, fill=(255, 150, 205, 255))
img.paste(layer.filter(ImageFilter.GaussianBlur(14)), (0, 0), layer.filter(ImageFilter.GaussianBlur(14)))
d = ImageDraw.Draw(img)
d.text((60, 190), "Kunjal.exe", font=serif_i, fill=(255, 232, 244))
d.text((64, 310), "Welcome to her little universe", font=body, fill=(255, 238, 247))
d.text((66, 365), "ONE GIRL · A THOUSAND IDEAS · COUNTLESS SIDE QUESTS", font=small, fill=(240, 200, 225))
d.text((66, 520), "Kunjal Mahajan · AI & Data Science", font=small, fill=(200, 175, 210))

img.save("public/og-image.png", optimize=True)
print("og-image.png written")
