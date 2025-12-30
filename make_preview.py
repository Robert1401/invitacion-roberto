from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1200, 630
os.makedirs("assets", exist_ok=True)

img = Image.new("RGB", (W, H), (5, 6, 20))
d = ImageDraw.Draw(img)

# Gradiente oscuro
for y in range(H):
    t = y / (H - 1)
    r = int(6 + 10 * t)
    g = int(8 + 18 * t)
    b = int(20 + 35 * t)
    d.line((0, y, W, y), fill=(r, g, b))

# "Ladrillo" sutil
brick_w, brick_h = 60, 28
for y in range(0, H, brick_h):
    offset = (y // brick_h) % 2 * (brick_w // 2)
    for x in range(-brick_w, W + brick_w, brick_w):
        x0 = x + offset
        y0 = y
        d.rectangle((x0, y0, x0 + brick_w - 2, y0 + brick_h - 2), outline=(20, 30, 60))

# Glow blobs
def glow(cx, cy, radius, color):
    layer = Image.new("RGBA", (W, H), (0,0,0,0))
    ld = ImageDraw.Draw(layer)
    ld.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(radius/2))
    return layer

img = Image.alpha_composite(img.convert("RGBA"), glow(380, 120, 260, (55,240,255,70)))
img = Image.alpha_composite(img, glow(870, 170, 280, (195,91,255,55)))
img = Image.alpha_composite(img, glow(760, 520, 320, (255,79,216,45)))
img = img.convert("RGB")

# Marco
d = ImageDraw.Draw(img)
d.rounded_rectangle((60, 45, W-60, H-45), radius=36, outline=(80, 240, 255), width=3)
d.rounded_rectangle((85, 70, W-85, H-70), radius=28, outline=(255,255,255), width=1)

# Tipos (fallback si no hay fuentes)
def load_font(size, bold=False):
    try:
        # Windows: Segoe UI
        name = "C:\\Windows\\Fonts\\segoeui.ttf"
        if bold:
            name = "C:\\Windows\\Fonts\\segoeuib.ttf"
        return ImageFont.truetype(name, size)
    except:
        return ImageFont.load_default()

f_big = load_font(160, bold=True)
f_name = load_font(90, bold=True)
f_text = load_font(40, bold=False)
f_small = load_font(34, bold=True)

# Textos
age = "21"
name = "Roberto"
line1 = "INVITACIÓN • 10 • 5:00 PM"
line2 = "Atotonilco de Tula, Hidalgo • con abuelita"

# Centrados
def center_text(text, y, font, fill):
    w = d.textlength(text, font=font)
    x = (W - w) / 2
    d.text((x, y), text, font=font, fill=fill)

# Glow del texto principal
for dx, dy, a in [(0,0,220),(2,0,140),(-2,0,140),(0,2,140),(0,-2,140)]:
    center_text(age, 150+dy, f_big, (55,240,255))
center_text(age, 150, f_big, (235, 255, 255))

center_text(name, 300, f_name, (255, 255, 255))
center_text(line1, 420, f_small, (210, 245, 255))
center_text(line2, 470, f_text, (220, 235, 255))

img.save("assets/preview.png", "PNG")
print("OK -> assets/preview.png")
