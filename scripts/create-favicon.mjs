import sharp from "sharp";
import { writeFile } from "node:fs/promises";

// Extract the original GIF's first frame; retain its artwork and transparency.
const frame = await sharp("public/hero-yoshi.gif", { page: 0, pages: 1 })
  .png()
  .toBuffer();
const sizes = [16, 32, 48, 64];
const images = await Promise.all(sizes.map((size) =>
  sharp(frame).resize(size, size, { fit: "contain" }).png().toBuffer()
));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((png, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(png.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...images]));
await writeFile("src/app/icon.png", frame);
console.log("Created Yoshi favicon at 16, 32, 48 and 64px, plus a PNG icon.");
