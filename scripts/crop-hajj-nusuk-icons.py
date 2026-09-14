"""Crop 10 Nusuk step badges from the ChatGPT sheet."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 14, 2026, 05_45_43 PM.png")
OUT = Path(r"D:\mobarak\public\brand\icons\hajj-nusuk")


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.array(im)
    mask = arr[:, :, 3] > 20
    x_hist = mask.any(axis=0)
    runs: list[tuple[int, int]] = []
    start = None
    for i, v in enumerate(x_hist):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= 40:
                runs.append((start, i - 1))
            start = None
    if start is not None and len(x_hist) - start >= 40:
        runs.append((start, len(x_hist) - 1))

    print("runs", len(runs), runs)
    if len(runs) != 10:
        ys, xs = np.where(mask)
        x0, x1 = int(xs.min()), int(xs.max())
        chunk = (x1 - x0 + 1) / 10
        runs = [(int(x0 + i * chunk), int(x0 + (i + 1) * chunk) - 1) for i in range(10)]
        print("fallback", runs)

    OUT.mkdir(parents=True, exist_ok=True)
    pad = 6
    for i, (x0, x1) in enumerate(runs, 1):
        col = mask[:, x0 : x1 + 1]
        ys = np.where(col.any(axis=1))[0]
        y0, y1 = int(ys.min()), int(ys.max())
        left, top = max(0, x0 - pad), max(0, y0 - pad)
        right, bottom = min(im.width, x1 + pad + 1), min(im.height, y1 + pad + 1)
        crop = im.crop((left, top, right, bottom))
        bbox = crop.getbbox()
        if bbox:
            crop = crop.crop(bbox)
        w, h = crop.size
        side = max(w, h)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(crop, ((side - w) // 2, (side - h) // 2), crop)
        canvas = canvas.resize((200, 200), Image.Resampling.LANCZOS)
        name = f"step-{i:02d}.png"
        canvas.save(OUT / name, optimize=True)
        print(name, canvas.size)


if __name__ == "__main__":
    main()
