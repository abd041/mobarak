const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../ChatGPT Image Aug 28, 2026, 04_26_01 AM.png");
const out = path.join(__dirname, "../public/brand/offer-hero-kaaba.png");

/** Hero background — ChatGPT Aug 28 04:26 (reference background asset). */
async function main() {
  if (!fs.existsSync(src)) {
    console.error("Missing hero source:", src);
    process.exit(1);
  }

  await sharp(src)
    .resize(2400, 900, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 6 })
    .toFile(out);

  console.log("Updated hero →", out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
