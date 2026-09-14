"""Crop Hajj trust-bar icons from ChatGPT blue-on-black sheet."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 11, 2026, 09_40_52 PM.png")
OUT_DIR = Path(r"D:\mobarak\public\brand\icons\hajj-trust")
NAMES = ["experience", "costs", "nusuk", "religious", "languages"]


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.array(im)
    lum = arr[:, :, :3].max(axis=2).astype(np.float32)
    mask = lum > 45

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

    # Keep only wide runs (drop noise between icon strokes)
    icons = [(s, e) for s, e in runs if (e - s) >= 120]
    print("icons:", icons, "count", len(icons))
    if len(icons) != 5:
        raise SystemExit(f"expected 5 icons, got {len(icons)}: {icons}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pad = 16
    for name, (x0, x1) in zip(NAMES, icons):
        col = mask[:, x0 : x1 + 1]
        ys = np.where(col.any(axis=1))[0]
        y0, y1 = int(ys.min()), int(ys.max())
        left = max(0, x0 - pad)
        top = max(0, y0 - pad)
        right = min(im.width, x1 + pad + 1)
        bottom = min(im.height, y1 + pad + 1)
        crop = arr[top:bottom, left:right].copy()
        rgb = crop[:, :, :3].astype(np.float32)
        bright = rgb.max(axis=2)

        # Transparent black bg; keep blue strokes with soft alpha
        alpha = np.clip((bright - 28.0) * 3.5, 0, 255).astype(np.uint8)
        out_arr = np.zeros_like(crop)
        out_arr[:, :, 0] = 18
        out_arr[:, :, 1] = 100
        out_arr[:, :, 2] = 245
        out_arr[:, :, 3] = alpha

        out = Image.fromarray(out_arr, "RGBA")
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)
        w, h = out.size
        side = max(w, h, 1) + 8
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(out, ((side - w) // 2, (side - h) // 2), out)
        canvas = canvas.resize((160, 160), Image.Resampling.LANCZOS)
        path = OUT_DIR / f"{name}.png"
        canvas.save(path, optimize=True)
        print(name, "->", path)


if __name__ == "__main__":
    main()
