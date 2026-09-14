"""Crop mobile hero so the Kaaba sits near the center of the frame."""

from pathlib import Path

from PIL import Image

SRC = Path(r"D:\mobarak\public\brand\hajj-2027-hero.png")
OUT = Path(r"D:\mobarak\public\brand\hajj-2027-hero-mobile-v2.png")


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    w, h = im.size

    # Place Kaaba slightly right of geometric mid so it reads centered on mobile.
    kaaba_x = 1531
    target_pct = 0.56

    # Match the current mobile hero band (~375x352 / 22rem).
    aspect = 375 / 352
    crop_h = h
    crop_w = int(crop_h * aspect)
    if crop_w > w:
        crop_w = w
        crop_h = int(crop_w / aspect)

    left = max(0, min(w - crop_w, int(kaaba_x - crop_w * target_pct)))
    top = 0
    box = (left, top, left + crop_w, top + crop_h)

    cropped = im.crop(box)
    out = cropped.resize((1200, int(1200 / aspect)), Image.Resampling.LANCZOS)
    out.save(OUT, "PNG", optimize=True)
    print(f"saved {OUT} from box={box} size={out.size}")


if __name__ == "__main__":
    main()
