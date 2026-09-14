"""Crop quote + minaret illustration and punch the pale background."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(r"D:\mobarak\ChatGPT Image Sep 14, 2026, 05_55_18 PM.png")
OUT = Path(r"D:\mobarak\public\brand\hajj-journey\deco-quote-minaret.png")


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    arr = np.array(im).astype(np.float32)
    # Content lives on the right (quote + mosque)
    arr = arr[:, 1000:, :]
    rgb = arr[:, :, :3]
    lum = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    alpha = np.clip(np.maximum((chroma - 8.0) * 10.0, (236.0 - lum) * 6.0), 0, 255)

    # Drop isolated speckles
    opaque = (alpha > 40).astype(np.uint8)
    neigh = (
        np.roll(opaque, 1, 0)
        + np.roll(opaque, -1, 0)
        + np.roll(opaque, 1, 1)
        + np.roll(opaque, -1, 1)
    )
    alpha = np.where((opaque == 1) & (neigh >= 2), alpha, 0.0)
    arr[:, :, 3] = alpha

    out = Image.fromarray(arr.astype(np.uint8), "RGBA")
    bbox = out.getbbox()
    if bbox:
        l, t, r, b = bbox
        pad = 12
        out = out.crop(
            (
                max(0, l - pad),
                max(0, t - pad),
                min(out.width, r + pad),
                min(out.height, b + pad),
            )
        )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT, optimize=True)
    print("saved", OUT, out.size, "alpha0", np.array(out)[0, 0, 3])


if __name__ == "__main__":
    main()
