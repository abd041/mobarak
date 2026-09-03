from pathlib import Path

import numpy as np
from PIL import Image

src = Path(r"D:\mobarak\ChatGPT Image Sep 4, 2026, 12_23_42 AM.png")
out_dir = Path(r"D:\mobarak\public\brand\icons\inquiry-source")
out_dir.mkdir(parents=True, exist_ok=True)

sheet = np.array(Image.open(src).convert("RGBA"))
h, w = sheet.shape[:2]
names = [
    ["instagram", "facebook", "google"],
    ["chatgpt", "friend", "know"],
]
cw, ch = w // 3, h // 2


def extract_sphere(cell: np.ndarray) -> Image.Image:
    alpha = cell[:, :, 3]
    fg = alpha > 40
    ys, xs = np.where(fg)
    cy = float(np.median(ys))
    cx = float(np.median(xs))
    dist = np.sqrt((xs.astype(np.float64) - cx) ** 2 + (ys.astype(np.float64) - cy) ** 2)
    radius = float(np.percentile(dist, 96))

    size = int(np.round(radius * 2))
    if size % 2:
        size += 1
    left = int(np.round(cx - size / 2))
    top = int(np.round(cy - size / 2))
    left = max(0, min(left, cell.shape[1] - size))
    top = max(0, min(top, cell.shape[0] - size))
    size = min(size, cell.shape[1] - left, cell.shape[0] - top)
    crop = cell[top : top + size, left : left + size].copy()

    yy, xx = np.ogrid[: crop.shape[0], : crop.shape[1]]
    cc_x = (crop.shape[1] - 1) / 2.0
    cc_y = (crop.shape[0] - 1) / 2.0
    d = np.sqrt((xx - cc_x) ** 2 + (yy - cc_y) ** 2)
    r = min(crop.shape[0], crop.shape[1]) / 2.0 - 0.4
    mask = np.clip((r + 0.6 - d) * 255.0, 0, 255).astype(np.uint8)
    crop[:, :, 3] = np.minimum(crop[:, :, 3], mask)
    return Image.fromarray(crop, "RGBA").resize((256, 256), Image.Resampling.LANCZOS)


for ri, row in enumerate(names):
    for ci, name in enumerate(row):
        cell = sheet[ri * ch : (ri + 1) * ch, ci * cw : (ci + 1) * cw]
        extract_sphere(cell).save(out_dir / f"{name}.png")
        a = np.array(Image.open(out_dir / f"{name}.png"))
        print(name, "cornerA", int(a[0, 0, 3]), "midEdgeA", int(a[0, 128, 3]), "centerA", int(a[128, 128, 3]))

(out_dir / "other.png").write_bytes((out_dir / "know.png").read_bytes())
print("done")
