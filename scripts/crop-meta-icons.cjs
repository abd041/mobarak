const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../ChatGPT Image Aug 28, 2026, 02_24_28 AM.png");
const outDir = path.join(__dirname, "../public/brand/meta-icons");

/** Pixel-gap regions on 2172×724 sheet. */
const crops = [
  { name: "guide.png", left: 28, top: 80, width: 225, height: 560 },
  { name: "calendar.png", left: 357, top: 80, width: 218, height: 560 },
  { name: "group.png", left: 669, top: 80, width: 252, height: 560 },
  { name: "plane-airline.png", left: 990, top: 80, width: 231, height: 560 },
  { name: "plane-airport.png", left: 1300, top: 80, width: 219, height: 560 },
  { name: "egyptair-logo.png", left: 1581, top: 80, width: 450, height: 560 },
];

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const crop of crops) {
    const raw = await sharp(src)
      .extract({
        left: crop.left,
        top: crop.top,
        width: crop.width,
        height: crop.height,
      })
      .png()
      .toBuffer();

    const trimmed = await sharp(raw).trim({ threshold: 10 }).png().toBuffer();
    await sharp(trimmed)
      .resize(96, 96, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(outDir, crop.name));

    if (crop.name === "egyptair-logo.png") {
      await sharp(trimmed)
        .resize(180, 48, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(path.join(outDir, "egyptair-logo-wide.png"));
    }
  }

  console.log("Cropped meta icons →", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
