"""Crop offer-detail info/child-price icons from ChatGPT sheet."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 3, 2026, 03_55_40 PM.png")
OUT_DIR = Path(r"D:\mobarak\public\brand\icons\offer-info")

# Expected left-to-right, top-then-bottom (skip trailing duplicate suitcase if present)
NAMES = [
    "luggage",
    "bed",
    "guides",
    "infants",
    "camera",
    "transfers",
    "visa",
    "kaaba",
]


def find_runs(hist: np.ndarray, min_gap: int = 20) -> list[tuple[int, int]]:
    runs: list[list[int]] = []
    start: int | None = None
    for i, v in enumerate(hist):
        if v and start is None:
            start = i
        elif not v and start is not None:
            runs.append([start, i - 1])
            start = None
    if start is not None:
        runs.append([start, len(hist) - 1])

    merged: list[list[int]] = []
    for s, e in runs:
        if not merged or s - merged[-1][1] >= min_gap:
            merged.append([s, e])
        else:
            merged[-1][1] = e
    return [(s, e) for s, e in merged]


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.array(im)
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3].astype(np.int16)
    # Content = non-white / opaque pixels (icons are dark brown + orange)
    whiteish = (rgb.min(axis=2) > 240) & (rgb.max(axis=2) > 245)
    mask = (~whiteish) & (alpha > 20)

    y_hist = mask.any(axis=1)
    row_runs = find_runs(y_hist, min_gap=40)
    print("rows", len(row_runs), row_runs)
    if len(row_runs) < 2:
        raise SystemExit(f"Expected 2 icon rows, got {len(row_runs)}")

    cells: list[tuple[int, int, int, int]] = []
    for y0, y1 in row_runs[:2]:
        row_mask = mask[y0 : y1 + 1, :]
        x_hist = row_mask.any(axis=0)
        col_runs = find_runs(x_hist, min_gap=30)
        print("cols in row", len(col_runs), col_runs)
        for x0, x1 in col_runs:
            cells.append((x0, y0, x1, y1))

    print("cells", len(cells))
    if len(cells) < 8:
        raise SystemExit(f"Expected at least 8 icons, got {len(cells)}")

    # Take first 8 unique icons (ignore duplicate suitcase if 9th)
    cells = cells[:8]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pad = 10
    for name, (x0, y0, x1, y1) in zip(NAMES, cells):
        col = mask[y0 : y1 + 1, x0 : x1 + 1]
        ys = np.where(col.any(axis=1))[0]
        xs = np.where(col.any(axis=0))[0]
        yy0, yy1 = int(ys.min()) + y0, int(ys.max()) + y0
        xx0, xx1 = int(xs.min()) + x0, int(xs.max()) + x0
        left = max(0, xx0 - pad)
        top = max(0, yy0 - pad)
        right = min(im.width, xx1 + pad + 1)
        bottom = min(im.height, yy1 + pad + 1)
        crop = arr[top:bottom, left:right].copy()
        # Transparent near-white background
        near_white = crop[:, :, :3].min(axis=2) > 235
        crop[near_white, 3] = 0
        out = Image.fromarray(crop, "RGBA")
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)
        w, h = out.size
        side = max(w, h, 1)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(out, ((side - w) // 2, (side - h) // 2), out)
        canvas = canvas.resize((256, 256), Image.Resampling.LANCZOS)
        path = OUT_DIR / f"{name}.png"
        canvas.save(path, optimize=True)
        print(name, "->", path, canvas.size)


if __name__ == "__main__":
    main()
