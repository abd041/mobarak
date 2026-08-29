const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../ChatGPT Image Aug 28, 2026, 02_19_17 AM.png");
const outDir = path.join(__dirname, "../public/brand/itinerary-icons");

/** Boxes from pixel-gap scan on 1536×1024 sheet. */
const crops = [
  // Top row — Tag 1–7
  { name: "day-01.png", left: 35, top: 100, width: 177, height: 380 },
  { name: "day-02.png", left: 254, top: 100, width: 162, height: 380 },
  { name: "day-03.png", left: 455, top: 100, width: 186, height: 380 },
  { name: "day-04.png", left: 683, top: 100, width: 155, height: 380 },
  { name: "day-05.png", left: 896, top: 100, width: 152, height: 380 },
  { name: "day-06.png", left: 1119, top: 100, width: 114, height: 380 },
  { name: "day-07.png", left: 1279, top: 100, width: 213, height: 380 },
  // Bottom row — hotel → airplane
  { name: "day-08.png", left: 40, top: 520, width: 200, height: 380 },
  { name: "day-09.png", left: 258, top: 520, width: 192, height: 380 },
  { name: "day-10.png", left: 533, top: 520, width: 209, height: 380 },
  { name: "day-11.png", left: 811, top: 520, width: 189, height: 380 },
  { name: "day-12.png", left: 1055, top: 520, width: 177, height: 380 },
  { name: "day-13.png", left: 1264, top: 520, width: 251, height: 380 },
];

/** Map design Tag number → cropped asset (bottom row order differs in Reiseplan). */
const TAG_TO_FILE = {
  1: "day-01",
  2: "day-02",
  3: "day-03",
  4: "day-04",
  5: "day-05",
  6: "day-06",
  7: "day-07",
  8: "day-13", // airplane
  9: "day-12", // palm
  10: "day-11", // camera
  11: "day-10", // mosque
  12: "day-09", // kaaba
  13: "day-08", // hotel
};

async function trimTransparent(input) {
  return sharp(input).trim({ threshold: 10 }).png().toBuffer();
}

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

    const trimmed = await trimTransparent(raw);
    await sharp(trimmed)
      .resize(144, 144, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(outDir, crop.name));
  }

  fs.writeFileSync(
    path.join(outDir, "tag-map.json"),
    JSON.stringify(TAG_TO_FILE, null, 2),
    "utf8",
  );

  console.log("Cropped", crops.length, "itinerary icons →", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
