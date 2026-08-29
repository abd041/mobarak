const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../ChatGPT Image Aug 28, 2026, 02_30_20 AM.png");
const outDir = path.join(__dirname, "../public/brand/inclusion-icons");

/** Pixel-gap regions on 2172×724 sheet (9 icons). */
const crops = [
  { name: "visa.png", left: 29, top: 80, width: 155, height: 560 },
  { name: "flight.png", left: 239, top: 80, width: 203, height: 560 },
  { name: "baggage.png", left: 486, top: 80, width: 178, height: 560 },
  { name: "guide.png", left: 719, top: 80, width: 187, height: 560 },
  { name: "religious.png", left: 964, top: 80, width: 192, height: 560 },
  { name: "transfer.png", left: 1212, top: 80, width: 201, height: 560 },
  { name: "hotel.png", left: 1472, top: 80, width: 199, height: 560 },
  { name: "breakfast.png", left: 1730, top: 80, width: 172, height: 560 },
  { name: "excursions.png", left: 1959, top: 80, width: 198, height: 560 },
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
      .resize(80, 80, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(outDir, crop.name));
  }

  console.log("Cropped", crops.length, "inclusion icons →", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
