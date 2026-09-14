"""Crop 5 Hajj-day card photos from the ChatGPT sheet."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 14, 2026, 06_09_05 PM.png")
OUT = Path(r"D:\mobarak\public\brand\hajj-journey")


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    arr = np.array(im)
    rgb = arr.astype(np.float32)
    white = (rgb.min(axis=2) > 248) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 8)
    mask = ~white
    x_hist = mask.any(axis=0)
    runs: list[tuple[int, int]] = []
    start = None
    for i, v in enumerate(x_hist):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= 80:
                runs.append((start, i - 1))
            start = None
    if start is not None and len(x_hist) - start >= 80:
        runs.append((start, len(x_hist) - 1))

    print("runs", len(runs), runs)
    if len(runs) != 5:
        ys, xs = np.where(mask)
        x0, x1 = int(xs.min()), int(xs.max())
        chunk = (x1 - x0 + 1) / 5
        runs = [(int(x0 + i * chunk), int(x0 + (i + 1) * chunk) - 1) for i in range(5)]
        print("fallback", runs)

    OUT.mkdir(parents=True, exist_ok=True)
    # Inset past rounded corners so card CSS can clip cleanly
    inset = 10
    for i, (x0, x1) in enumerate(runs, 1):
        col = mask[:, x0 : x1 + 1]
        ys = np.where(col.any(axis=1))[0]
        y0, y1 = int(ys.min()), int(ys.max())
        left = x0 + inset
        right = x1 - inset + 1
        top = y0 + inset
        bottom = y1 - inset + 1
        crop = im.crop((left, top, right, bottom))
        name = f"day-{i:02d}.png"
        crop.save(OUT / name, optimize=True)
        print(name, crop.size)


if __name__ == "__main__":
    main()
