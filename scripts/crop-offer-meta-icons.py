"""Crop meta-bar icons from ChatGPT silhouette sheet."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 3, 2026, 02_49_39 PM.png")
OUT_DIR = Path(r"D:\mobarak\public\brand\icons\offer-meta")
NAMES = ["duration", "period", "group", "airport", "destinations"]


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.array(im)
    # Icons are dark on black; detect non-black luminance
    lum = arr[:, :, :3].max(axis=2)
    # Prefer alpha if present
    if arr[:, :, 3].mean() > 5:
        mask = arr[:, :, 3] > 20
    else:
        mask = lum > 25

    # If almost full frame, use luminance against near-black bg
    if mask.mean() > 0.85:
        mask = lum > 30

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
        if not merged or s - merged[-1][1] >= 20:
            merged.append([s, e])
        else:
            merged[-1][1] = e

    print("merged:", merged, "count", len(merged))
    if len(merged) != 5:
        # Fall back to equal fifths of content bbox
        ys, xs = np.where(mask)
        x0, x1 = int(xs.min()), int(xs.max())
        y0, y1 = int(ys.min()), int(ys.max())
        w = x1 - x0 + 1
        chunk = w / 5
        merged = []
        for i in range(5):
            a = int(x0 + i * chunk)
            b = int(x0 + (i + 1) * chunk) - 1
            merged.append([a, b])
        print("fallback fifths:", merged)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pad = 8
    for name, (x0, x1) in zip(NAMES, merged):
        col = mask[:, x0 : x1 + 1]
        ys = np.where(col.any(axis=1))[0]
        y0, y1 = int(ys.min()), int(ys.max())
        left = max(0, x0 - pad)
        top = max(0, y0 - pad)
        right = min(im.width, x1 + pad + 1)
        bottom = min(im.height, y1 + pad + 1)
        crop = arr[top:bottom, left:right].copy()

        # Make near-black transparent; keep icon pixels opaque navy
        rgb = crop[:, :, :3]
        near_bg = rgb.max(axis=2) < 18
        crop[near_bg, 3] = 0

        # Force remaining opaque pixels to solid navy for crisp UI use
        opaque = crop[:, :, 3] > 40
        crop[opaque, 0] = 9
        crop[opaque, 1] = 36
        crop[opaque, 2] = 92
        crop[opaque, 3] = 255

        out = Image.fromarray(crop, "RGBA")
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)
        w, h = out.size
        side = max(w, h)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(out, ((side - w) // 2, (side - h) // 2), out)
        canvas = canvas.resize((128, 128), Image.Resampling.LANCZOS)
        path = OUT_DIR / f"{name}.png"
        canvas.save(path, optimize=True)
        print(name, "->", path)


if __name__ == "__main__":
    main()
