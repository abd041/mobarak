from PIL import Image
from pathlib import Path

src = Path(r"D:\mobarak\ChatGPT Image Aug 31, 2026, 01_51_51 AM.png")
out_dir = Path(r"D:\mobarak\public\brand\icons\hajj-prereg")
out_dir.mkdir(parents=True, exist_ok=True)

im = Image.open(src).convert("RGBA")
w, h = im.size
cols = 4
cell_w = w // cols
names = ["shield", "users", "clipboard", "award"]


def make_transparent(img: Image.Image, threshold: int = 245) -> Image.Image:
    pixels = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)
    return img


def trim(img: Image.Image, pad: int = 8) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(img.width, r + pad)
    b = min(img.height, b + pad)
    return img.crop((l, t, r, b))


for i, name in enumerate(names):
    left = i * cell_w
    right = (i + 1) * cell_w if i < cols - 1 else w
    cell = im.crop((left, 0, right, h))
    cell = make_transparent(cell)
    cell = trim(cell, pad=12)
    side = max(cell.width, cell.height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - cell.width) // 2
    oy = (side - cell.height) // 2
    canvas.paste(cell, (ox, oy), cell)
    if side < 512:
        canvas = canvas.resize((512, 512), Image.Resampling.LANCZOS)
    path = out_dir / f"{name}.png"
    canvas.save(path, optimize=True)
    print(name, canvas.size, "->", path)

print("done")
