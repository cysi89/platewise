from PIL import Image
import os

LOGO_PATH = r"public\images\genie-logo.png"
OUTPUT_DIR = r"public\splash"
BG_COLOR = (45, 90, 39, 255)
LOGO_RATIO = 0.35

os.makedirs(OUTPUT_DIR, exist_ok=True)

splash_sizes = [
    ("splash-1290x2796.png", 1290, 2796),
    ("splash-1179x2556.png", 1179, 2556),
    ("splash-1284x2778.png", 1284, 2778),
    ("splash-750x1334.png",   750, 1334),
]

logo = Image.open(LOGO_PATH).convert("RGBA")

for filename, w, h in splash_sizes:
    canvas = Image.new("RGBA", (w, h), BG_COLOR)
    logo_w = int(w * LOGO_RATIO)
    logo_h = int(logo_w * logo.height / logo.width)
    logo_resized = logo.resize((logo_w, logo_h), Image.LANCZOS)
    x = (w - logo_w) // 2
    y = (h - logo_h) // 2 - int(h * 0.05)
    canvas.paste(logo_resized, (x, y), logo_resized)
    out = os.path.join(OUTPUT_DIR, filename)
    canvas.save(out, "PNG")
    print(f"Created {out}")

print("Done! Splash screens created in public/splash/")
