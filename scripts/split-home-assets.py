from PIL import Image
from pathlib import Path
from collections import deque

# --- Card backgrounds 2x2 ---
bg = Image.open("ChatGPT Image Sep 2, 2026, 02_03_01 PM.png").convert("RGBA")
print("bg", bg.size)
w, h = bg.size
cx, cy = w // 2, h // 2


def is_white(p):
    return p[0] > 245 and p[1] > 245 and p[2] > 245


mid_row = [bg.getpixel((x, cy))[:3] for x in range(w)]
xs = [i for i, p in enumerate(mid_row) if is_white(p)]
gutter_x = [x for x in xs if abs(x - cx) < w * 0.08]
gx0, gx1 = min(gutter_x), max(gutter_x)
print("gutter_x", gx0, gx1)

mid_col = [bg.getpixel((cx, y))[:3] for y in range(h)]
ys = [i for i, p in enumerate(mid_col) if is_white(p)]
gutter_y = [y for y in ys if abs(y - cy) < h * 0.08]
gy0, gy1 = min(gutter_y), max(gutter_y)
print("gutter_y", gy0, gy1)

left = 0
while left < w and is_white(bg.getpixel((left, h // 4))[:3]):
    left += 1
right = w - 1
while right > 0 and is_white(bg.getpixel((right, h // 4))[:3]):
    right -= 1
top = 0
while top < h and is_white(bg.getpixel((w // 4, top))[:3]):
    top += 1
bottom = h - 1
while bottom > 0 and is_white(bg.getpixel((w // 4, bottom))[:3]):
    bottom -= 1
print("bounds", left, top, right, bottom)

boxes = {
    "umrah": (left, top, gx0, gy0),
    "individual": (gx1, top, right + 1, gy0),
    "hajj": (left, gy1, gx0, bottom + 1),
    "visa": (gx1, gy1, right + 1, bottom + 1),
}
out = Path("public/brand/home-categories")
out.mkdir(parents=True, exist_ok=True)
for name, box in boxes.items():
    crop = bg.crop(box)
    path = out / f"{name}-bg.png"
    crop.save(path)
    print(name, crop.size, path)

# --- Icons ---
ic = Image.open("ChatGPT Image Sep 2, 2026, 02_03_28 PM.png").convert("RGBA")
print("icons sheet", ic.size)
iw, ih = ic.size
pixels = ic.load()
visited = set()


def neighbors(x, y):
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        yield x + dx, y + dy


def is_icon_px(p):
    r, g, b, a = p
    return a > 20 and (r + g + b) > 40


comps = []
for y in range(ih):
    for x in range(iw):
        if (x, y) in visited:
            continue
        if not is_icon_px(pixels[x, y]):
            continue
        q = deque([(x, y)])
        visited.add((x, y))
        minx = maxx = x
        miny = maxy = y
        count = 0
        while q:
            cx0, cy0 = q.popleft()
            count += 1
            minx = min(minx, cx0)
            maxx = max(maxx, cx0)
            miny = min(miny, cy0)
            maxy = max(maxy, cy0)
            for nx, ny in neighbors(cx0, cy0):
                if (
                    0 <= nx < iw
                    and 0 <= ny < ih
                    and (nx, ny) not in visited
                    and is_icon_px(pixels[nx, ny])
                ):
                    visited.add((nx, ny))
                    q.append((nx, ny))
        if count > 800:
            comps.append((minx, miny, maxx + 1, maxy + 1, count))

print("components", len(comps))
row1 = sorted([b for b in comps if (b[1] + b[3]) / 2 < ih * 0.55], key=lambda b: b[0])
row2 = sorted([b for b in comps if (b[1] + b[3]) / 2 >= ih * 0.55], key=lambda b: b[0])
ordered = row1 + row2
print("ordered", len(ordered), "row1", len(row1), "row2", len(row2))

names = ["trophy", "people", "shield", "heart", "plane", "kaaba", "document"]
icons_out = Path("public/brand/icons/home")
icons_out.mkdir(parents=True, exist_ok=True)
for name, box in zip(names, ordered):
    crop = ic.crop(box[:4])
    datas = list(crop.getdata())
    new = []
    for r, g, b, a in datas:
        if r < 25 and g < 25 and b < 25:
            new.append((0, 0, 0, 0))
        else:
            new.append((r, g, b, a))
    crop.putdata(new)
    side = max(crop.size)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(crop, ((side - crop.size[0]) // 2, (side - crop.size[1]) // 2))
    path = icons_out / f"{name}.png"
    sq.save(path)
    print("icon", name, sq.size)

print("done")
