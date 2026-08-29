const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../public/brand");
const refCrop =
  "C:/Users/HP/.cursor/projects/d-mobarak/assets/c__Users_HP_AppData_Roaming_Cursor_User_workspaceStorage_1ac929647578e3758f26a91980cab204_images_image-1ea28516-f8d9-4348-86e0-356d43e4acf4.png";
const fullRef = path.join(__dirname, "../design-refs/homepage-final.jpg");

async function main() {
  fs.mkdirSync(path.join(outDir, "icons"), { recursive: true });

  // Hero photo from full approved reference (daytime Makkah, no cards)
  await sharp(fullRef)
    .extract({ left: 0, top: 58, width: 1024, height: 268 })
    .resize(1920, 504, { fit: "cover", position: "right" })
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "hero-reference.jpg"));

  // Hero-only crop from user reference crop (backup / tighter match)
  await sharp(refCrop)
    .extract({ left: 0, top: 0, width: 927, height: 268 })
    .resize(1920, 556, { fit: "cover", position: "right" })
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "hero-reference-crop.jpg"));

  // Service icons from reference card row
  const iconCrops = [
    { name: "service-umrah-group.png", left: 28, top: 286, width: 52, height: 52 },
    { name: "service-individual.png", left: 258, top: 286, width: 52, height: 52 },
    { name: "service-hajj.png", left: 488, top: 286, width: 52, height: 52 },
    { name: "service-visa.png", left: 718, top: 286, width: 52, height: 52 },
  ];

  for (const crop of iconCrops) {
    await sharp(refCrop)
      .extract(crop)
      .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, "icons", crop.name));
  }

  console.log("extracted hero + icons");
}

main().catch(console.error);
