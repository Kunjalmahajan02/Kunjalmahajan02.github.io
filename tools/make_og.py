"""Builds public/og-image.png (1200x630), the link-preview image, from the
Dreamscape art in public/dream (built by tools/make_dreamscape.py).

Run from the repo root:  python tools/make_og.py
Fonts: Georgia / Segoe UI on Windows, DejaVu elsewhere."""
import glob

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
img = Image.open("public/dream/sky-home.webp").convert("RGBA").resize((W, H), Image.LANCZOS)


def paste(path, height, xy):
    im = Image.open(path).convert("RGBA")
    im = im.resize((round(im.width * height / im.height), height), Image.LANCZOS)
    img.alpha_composite(im, xy)
    return im.size


# the Kunjal.exe planet and Mini Kunjal beside it
paste("public/dream/planet-core-900.webp", 330, (690, 60))
paste("public/dream/planet-inventor-272.webp", 110, (1050, 380))
paste("public/dream/planet-daydream-310.webp", 96, (600, 420))
paste("public/dream/pose-hello-402.webp", 300, (835, 330))


def font(patterns, size):
    for pat in patterns:
        for f in glob.glob(pat, recursive=True):
            try:
                return ImageFont.truetype(f, size)
            except OSError:
                pass
    return ImageFont.load_default()


serif_i = font(["C:/Windows/Fonts/georgiaz.ttf", "/usr/share/fonts/**/DejaVuSerif-BoldItalic.ttf"], 96)
body = font(["C:/Windows/Fonts/segoeuib.ttf", "/usr/share/fonts/**/DejaVuSans-Bold.ttf"], 22)
hand = font(["C:/Windows/Fonts/segoeprb.ttf", "C:/Windows/Fonts/georgiai.ttf", "/usr/share/fonts/**/DejaVuSerif-Italic.ttf"], 30)
small = font(["C:/Windows/Fonts/segoeui.ttf", "/usr/share/fonts/**/DejaVuSans.ttf"], 20)

glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(glow).text((60, 180), "Kunjal.exe", font=serif_i, fill=(243, 196, 220, 255))
glow = glow.filter(ImageFilter.GaussianBlur(16))
img.alpha_composite(glow)
d = ImageDraw.Draw(img)
d.text((64, 140), "AN INTERACTIVE DREAMSCAPE", font=small, fill=(221, 167, 198))
d.text((60, 180), "Kunjal", font=serif_i, fill=(255, 247, 251))
d.text((60 + d.textlength("Kunjal", font=serif_i), 180), ".exe", font=serif_i, fill=(221, 167, 198))
d.text((64, 300), "H E R   L I T T L E   U N I V E R S E", font=body, fill=(185, 174, 216))
d.text((64, 350), "part engineer, part artist, entirely too curious.", font=hand, fill=(243, 196, 220))
d.text((64, 540), "Kunjal Mahajan · AI & Data Science Engineer", font=small, fill=(215, 211, 223))
img.convert("RGB").save("public/og-image.png", optimize=True)
print("og-image.png written")
