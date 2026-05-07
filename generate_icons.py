from PIL import Image
import os

LOGO_PATH = r"public\images\genie-logo.png"
OUTPUT_DIR = r"public\icons"

os.makedirs(OUTPUT_DIR, exist_ok=True)

sizes = [72, 96, 128, 144, 152, 192, 384, 512]

logo = Image.open(LOGO_PATH).convert("RGBA")

for size in sizes:
    canvas = Image.new("RGBA", (size, size), (45, 90, 39, 255))
    padding = int(size * 0.12)
    logo_size = size - (padding * 2)
    logo_resized = logo.resize((logo_size, logo_size), Image.LANCZOS)
    canvas.paste(logo_resized, (padding, padding), logo_resized)
    out_path = os.path.join(OUTPUT_DIR, f"icon-{size}x{size}.png")
    canvas.save(out_path, "PNG")
    print(f"Created {out_path}")

print("Done! All icons created in public/icons/")
