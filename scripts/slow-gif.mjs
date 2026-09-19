import { readFile, writeFile } from "node:fs/promises";

const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error("Provide source and destination GIF paths.");
const data = await readFile(source);
if (!/^GIF8[79]a$/.test(data.toString("ascii", 0, 6))) throw new Error("Invalid GIF.");
let cursor = 13;
if (data[10] & 128) cursor += 3 * (2 ** ((data[10] & 7) + 1));
let frames = 0;
let originalDuration = 0;
const skipBlocks = () => {
  while (cursor < data.length) {
    const length = data[cursor++];
    if (length === 0) return;
    cursor += length;
  }
  throw new Error("Truncated GIF.");
};
while (cursor < data.length) {
  const marker = data[cursor++];
  if (marker === 0x3b) break;
  if (marker === 0x21) {
    const type = data[cursor++];
    if (type === 0xf9) {
      if (data[cursor] !== 4) throw new Error("Invalid frame control block.");
      const delay = data.readUInt16LE(cursor + 2);
      if (delay === 0 || delay > 32767) throw new Error("Unsupported frame delay.");
      data.writeUInt16LE(delay * 2, cursor + 2);
      originalDuration += delay * 10;
      frames++;
    }
    skipBlocks();
  } else if (marker === 0x2c) {
    const packed = data[cursor + 8];
    cursor += 9;
    if (packed & 128) cursor += 3 * (2 ** ((packed & 7) + 1));
    cursor++;
    skipBlocks();
  } else {
    throw new Error("Unexpected GIF block.");
  }
}
if (!frames) throw new Error("No frame delays found.");
await writeFile(destination, data);
console.log(JSON.stringify({
  width: data.readUInt16LE(6), height: data.readUInt16LE(8),
  frames, originalDuration, newDuration: originalDuration * 2,
}));
