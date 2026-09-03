"""Crop offer-hero feature icons from ChatGPT icon sheet."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 3, 2026, 02_33_16 PM.png")
OUT_DIR = Path(r"D:\mobarak\public\brand\icons\offer-hero")
NAMES = ["destinations", "guide", "shield", "seats"]


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.array(im)
    mask = arr[:, :, 3] > 20

    x_hist = mask.any(axis=0)
    runs: list[tuple[int, int]] = []
    start: int | None = None
    for i, v in enumerate(x_hist):
        if v and start is None:
            start = i
        elif not v and start is not None:
            runs.append((start, i - 1))
            start = None
    if start is not None:
        runs.append((start, len(x_hist) - 1))

    merged: list[list[int]] = []
    for s, e in runs:
        if not merged or s - merged[-1][1] >= 15:
            merged.append([s, e])
        else:
            merged[-1][1] = e

    print("merged x ranges:", merged)
    if len(merged) != 4:
        raise SystemExit(f"Expected 4 icons, found {len(merged)}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pad = 6
    for name, (x0, x1) in zip(NAMES, merged):
        col = mask[:, x0 : x1 + 1]
        ys = np.where(col.any(axis=1))[0]
        y0, y1 = int(ys.min()), int(ys.max())
        left = max(0, x0 - pad)
        top = max(0, y0 - pad)
        right = min(im.width, x1 + pad + 1)
        bottom = min(im.height, y1 + pad + 1)
        crop = arr[top:bottom, left:right].copy()
        # Keep original alpha; clear near-transparent noise
        crop[crop[:, :, 3] < 12, 3] = 0
        out = Image.fromarray(crop, "RGBA")
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)
        # Normalize to square-ish with transparent padding for consistent UI sizing
        w, h = out.size
        side = max(w, h)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(out, ((side - w) // 2, (side - h) // 2), out)
        # Export at useful display size
        canvas = canvas.resize((256, 256), Image.Resampling.LANCZOS)
        path = OUT_DIR / f"{name}.png"
        canvas.save(path, optimize=True)
        print(name, canvas.size, "->", path)


if __name__ == "__main__":
    main()
