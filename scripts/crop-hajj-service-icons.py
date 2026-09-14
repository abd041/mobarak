"""Crop 4 Hajj service icons and punch out black / white sheet backgrounds."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 14, 2026, 12_32_47 AM.png")
OUT_DIR = Path(r"D:\mobarak\public\brand\icons\hajj-services")
NAMES = ["booking", "travel", "trip", "hajj-days"]


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.float32)
    whiteish = (rgb.min(axis=2) > 245) & (rgb.max(axis=2) - rgb.min(axis=2) < 12)
    mask = ~whiteish

    ys, xs = np.where(mask)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    chunk = (x1 - x0 + 1) / 4
    icons = [(int(x0 + i * chunk), int(x0 + (i + 1) * chunk) - 1) for i in range(4)]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pad = 6
    for name, (left_x, right_x) in zip(NAMES, icons):
        col = mask[:, left_x : right_x + 1]
        ys_c = np.where(col.any(axis=1))[0]
        top = max(0, int(ys_c.min()) - pad)
        bottom = min(im.height, int(ys_c.max()) + pad + 1)
        left = max(0, left_x - pad)
        right = min(im.width, right_x + pad + 1)
        crop = arr[top:bottom, left:right].copy().astype(np.float32)
        c_rgb = crop[:, :, :3]
        lum = c_rgb.mean(axis=2)
        chroma = c_rgb.max(axis=2) - c_rgb.min(axis=2)

        # Keep pale-blue disc + blue glyph. Drop black sheet and white page.
        keep = ((lum > 55) & (chroma > 8)) | ((lum > 200) & (chroma > 4))
        alpha = np.where(keep, 255.0, 0.0)

        # Soft circular cut so leftover corners vanish
        ys_k, xs_k = np.where(keep)
        cx = float(np.median(xs_k))
        cy = float(np.median(ys_k))
        radius = float(np.percentile(np.sqrt((xs_k - cx) ** 2 + (ys_k - cy) ** 2), 96.5))
        yy, xx = np.ogrid[: crop.shape[0], : crop.shape[1]]
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        circle = np.clip((radius + 0.8 - d) * 255.0, 0, 255)
        crop[:, :, 3] = np.minimum(alpha, circle)

        out = Image.fromarray(crop.astype(np.uint8), "RGBA")
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)
        w, h = out.size
        side = max(w, h)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(out, ((side - w) // 2, (side - h) // 2), out)
        canvas = canvas.resize((256, 256), Image.Resampling.LANCZOS)
        path = OUT_DIR / f"{name}.png"
        canvas.save(path, optimize=True)
        print(name, "->", path, "alpha0", np.array(canvas)[0, 0, 3])


if __name__ == "__main__":
    main()
