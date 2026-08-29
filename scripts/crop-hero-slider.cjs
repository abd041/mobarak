const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "public/brand/offer-hero");

const HERO_W = 2400;
const HERO_H = 900;

async function exportHero(name, srcPath, position = "centre") {
  const out = path.join(outDir, name);
  await sharp(srcPath)
    .resize(HERO_W, HERO_H, { fit: "cover", position })
    .png({ compressionLevel: 6 })
    .toFile(out);
  console.log("✓", name);
}

async function cropGroupGrid() {
  const src = path.join(root, "group-photos.png");
  const meta = await sharp(src).metadata();
  const cols = 3;
  const rows = 2;
  const cellW = Math.floor(meta.width / cols);
  const cellH = Math.floor(meta.height / rows);

  let i = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      i += 1;
      const out = path.join(outDir, `group-${String(i).padStart(2, "0")}.png`);
      await sharp(src)
        .extract({
          left: col * cellW,
          top: row * cellH,
          width: cellW,
          height: cellH,
        })
        .resize(HERO_W, HERO_H, { fit: "cover", position: "centre" })
        .png({ compressionLevel: 6 })
        .toFile(out);
      console.log("✓", `group-${String(i).padStart(2, "0")}.png`);
    }
  }
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const singles = [
    ["kaaba.png", path.join(root, "public/brand/offer-hero-kaaba.png"), "right"],
    ["medina.png", path.join(root, "medina.png"), "centre"],
    ["group-photo.png", path.join(root, "group-photo.png"), "centre"],
    ["ziyarat.png", path.join(root, "Ziyarat.png"), "centre"],
    ["makkah.png", path.join(root, "Makkah.png"), "centre"],
  ];

  for (const [name, src, pos] of singles) {
    if (!fs.existsSync(src)) {
      console.error("Missing:", src);
      process.exit(1);
    }
    await exportHero(name, src, pos);
  }

  await cropGroupGrid();
  console.log("\nDone →", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
