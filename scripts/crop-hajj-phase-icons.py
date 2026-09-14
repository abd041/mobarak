"""Crop 8 gold-on-cream circular phase icons from ChatGPT sheet."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 14, 2026, 01_44_02 AM.png")
OUT = Path(r"D:\mobarak\public\brand\hajj-journey")


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.float32)
    # Icons sit in pale discs; page is near-white
    white = (rgb.min(axis=2) > 248) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 8)
    mask = ~white
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
    if len(runs) != 8:
        ys, xs = np.where(mask)
        x0, x1 = int(xs.min()), int(xs.max())
        chunk = (x1 - x0 + 1) / 8
        runs = [(int(x0 + i * chunk), int(x0 + (i + 1) * chunk) - 1) for i in range(8)]
        print("fallback", runs)

    OUT.mkdir(parents=True, exist_ok=True)
    # 7 journey phases: skip envelope (index 6)
    keep = [0, 1, 2, 3, 4, 5, 7]
    for out_i, src_i in enumerate(keep, 1):
        x0, x1 = runs[src_i]
        col = mask[:, x0 : x1 + 1]
        ys = np.where(col.any(axis=1))[0]
        y0, y1 = int(ys.min()), int(ys.max())
        pad = 8
        left, top = max(0, x0 - pad), max(0, y0 - pad)
        right, bottom = min(im.width, x1 + pad + 1), min(im.height, y1 + pad + 1)
        crop = arr[top:bottom, left:right].copy()
        c_rgb = crop[:, :, :3].astype(np.float32)
        c_white = (c_rgb.min(axis=2) > 248) & ((c_rgb.max(axis=2) - c_rgb.min(axis=2)) < 8)
        ys_f, xs_f = np.where(~c_white)
        cx, cy = float(np.median(xs_f)), float(np.median(ys_f))
        dist = np.sqrt((xs_f - cx) ** 2 + (ys_f - cy) ** 2)
        radius = float(np.percentile(dist, 97))
        yy, xx = np.ogrid[: crop.shape[0], : crop.shape[1]]
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        circle = np.clip((radius + 1.0 - d) * 255, 0, 255).astype(np.uint8)
        crop[:, :, 3] = np.minimum(np.where(c_white, 0, 255).astype(np.uint8), circle)
        out = Image.fromarray(crop, "RGBA")
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)
        w, h = out.size
        side = max(w, h)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(out, ((side - w) // 2, (side - h) // 2), out)
        canvas = canvas.resize((160, 160), Image.Resampling.LANCZOS)
        name = f"phase-{out_i:02d}.png"
        canvas.save(OUT / name, optimize=True)
        print(name, canvas.size)


if __name__ == "__main__":
    main()
