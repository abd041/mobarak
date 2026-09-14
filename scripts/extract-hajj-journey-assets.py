"""Extract photos and icons from the Hajj journey reference screenshot."""
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(
    r"C:\Users\HP\.cursor\projects\d-mobarak\assets"
    r"\c__Users_HP_AppData_Roaming_Cursor_User_workspaceStorage"
    r"_1ac929647578e3758f26a91980cab204_images"
    r"_image-d4179bb6-f309-4427-a817-d11fc8c3ed88.jpg"
)
OUT = Path(r"D:\mobarak\public\brand\hajj-journey")


def save(im: Image.Image, name: str, size: tuple[int, int] | None = None) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    if size:
        im = im.resize(size, Image.Resampling.LANCZOS)
    im.save(OUT / name, optimize=True)
    print(name, im.size)


def crop(im: Image.Image, box: tuple[int, int, int, int], pad: int = 0) -> Image.Image:
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def punch_white(im: Image.Image, thresh: int = 248) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    rgb = arr[:, :, :3].astype(np.int16)
    white = (rgb.min(axis=2) > thresh) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 12)
    arr[white, 3] = 0
    return Image.fromarray(arr, "RGBA")


def punch_circle(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    h, w = arr.shape[:2]
    yy, xx = np.ogrid[:h, :w]
    cx, cy = (w - 1) / 2.0, (h - 1) / 2.0
    r = min(w, h) / 2.0 - 0.4
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    mask = np.clip((r + 0.7 - d) * 255, 0, 255).astype(np.uint8)
    arr[:, :, 3] = np.minimum(arr[:, :, 3], mask)
    return Image.fromarray(arr, "RGBA")


def main() -> None:
    im = Image.open(SRC).convert("RGB")

    medina = [
        ((18, 168, 102, 221), "medina-flight.png"),
        ((107, 168, 192, 221), "medina-arrival.png"),
        ((197, 168, 285, 221), "medina-stay.png"),
        ((289, 168, 374, 221), "medina-ziyarat.png"),
    ]
    for box, name in medina:
        save(crop(im, box), name, (640, 400))

    save(punch_white(crop(im, (378, 298, 500, 392))), "talbiyah.png", (400, 240))

    to_makkah = [
        ((17, 326, 101, 374), "makkah-ihram.png"),
        ((107, 326, 192, 374), "makkah-miqat.png"),
        ((197, 326, 285, 374), "makkah-travel.png"),
        ((290, 326, 374, 374), "makkah-checkin.png"),
    ]
    for box, name in to_makkah:
        save(crop(im, box), name, (640, 360))

    # 7 phase icons — equal slots on the gold timeline
    phase_centers = [36, 96, 154, 212, 268, 332, 392]
    for i, cx in enumerate(phase_centers, 1):
        icon = punch_white(crop(im, (cx - 14, 74, cx + 16, 104)), 250)
        save(punch_circle(icon), f"phase-{i:02d}.png", (112, 112))

    # 6 Umrah ritual icons
    ritual = [
        (35, 60),
        (112, 142),
        (192, 219),
        (260, 295),
        (340, 373),
        (427, 458),
    ]
    for i, (x0, x1) in enumerate(ritual, 1):
        icon = punch_white(crop(im, (x0 - 6, 496, x1 + 6, 520), 1), 250)
        save(punch_circle(icon), f"ritual-{i:02d}.png", (140, 140))

    # 5 Hajj-day photos
    days = [
        ((18, 608, 106, 654), "day-01.png"),
        ((114, 608, 201, 654), "day-02.png"),
        ((208, 608, 296, 654), "day-03.png"),
        ((303, 608, 390, 654), "day-04.png"),
        ((398, 608, 486, 654), "day-05.png"),
    ]
    for box, name in days:
        save(crop(im, box), name, (560, 300))

    # Chapter 5
    ch5 = [
        ((18, 750, 107, 788), "return-makkah.png"),
        ((115, 750, 214, 788), "return-wada.png"),
        ((222, 750, 320, 788), "return-flight.png"),
        ((338, 740, 502, 838), "return-sunset.png"),
    ]
    for box, name in ch5:
        save(crop(im, box), name, (640, 400))

    # Final CTA — pilgrim sunset (use as photo bg)
    save(crop(im, (0, 846, 504, 942)), "final-cta.png", (1600, 480))
    save(punch_white(crop(im, (430, 6, 504, 72))), "deco-minaret-top.png", (200, 170))


if __name__ == "__main__":
    main()
