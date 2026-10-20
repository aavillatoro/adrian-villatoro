// splits assets/night-sky-1080p.png into layers the intro can animate:
// - sky.webp: the backdrop with the big stars, moon and small dots painted out
// - sprite-*.webp: each big star and the moon, cut out with alpha
// - dots-*.webp: the small dots spread across a few full-size layers so each
//   layer can twinkle on its own rhythm
// positions go to src/app/night-sky.json. run: node scripts/split-night-sky.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "assets/night-sky-1080p.png";
const OUT = "public/night";
const DOT_LAYERS = 6;
// clouds start around here; their outlines are bright enough to read as dots
const DOT_MAX_Y = 915;
// never paint out below this: a straight row fill smears the wavy cloud
// outline. a sprite sitting on the clouds just keeps its baked copy under it.
const CLOUD_TOP = 926;

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const at = (x, y) => (y * W + x) * 3;
const lum = (x, y) => {
  const i = at(x, y);
  return 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
};
const clampN = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// 8-connected components of pixels brighter than `threshold`
function components(threshold) {
  const seen = new Uint8Array(W * H);
  const out = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (seen[y * W + x] || lum(x, y) <= threshold) continue;
      const pixels = [];
      const stack = [[x, y]];
      seen[y * W + x] = 1;
      while (stack.length) {
        const [cx, cy] = stack.pop();
        pixels.push([cx, cy]);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny * W + nx]) continue;
            if (lum(nx, ny) <= threshold) continue;
            seen[ny * W + nx] = 1;
            stack.push([nx, ny]);
          }
        }
      }
      let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (const [px, py] of pixels) {
        x0 = Math.min(x0, px); y0 = Math.min(y0, py);
        x1 = Math.max(x1, px); y1 = Math.max(y1, py);
      }
      out.push({ pixels, x0, y0, x1, y1 });
    }
  }
  return out;
}

// average colour of a ring just outside a box, as the local sky
function ringSky(x0, y0, x1, y1, pad) {
  const sum = [0, 0, 0];
  let n = 0;
  for (let y = y0 - pad; y <= y1 + pad; y++) {
    for (let x = x0 - pad; x <= x1 + pad; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const inside = x >= x0 - pad + 2 && x <= x1 + pad - 2 && y >= y0 - pad + 2 && y <= y1 + pad - 2;
      if (inside) continue;
      const i = at(x, y);
      sum[0] += data[i]; sum[1] += data[i + 1]; sum[2] += data[i + 2];
      n++;
    }
  }
  return sum.map((s) => s / n);
}

// the painted-out sky: fill masked pixels along each row between the nearest
// clean pixels either side, which keeps horizontal structure like the cloud
// edges, plus a little noise to match the paper texture
const sky = Buffer.from(data);
const erase = new Uint8Array(W * H);
function paintOut() {
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      if (!erase[y * W + x]) { x++; continue; }
      const start = x;
      while (x < W && erase[y * W + x]) x++;
      const left = start > 0 ? at(start - 1, y) : at(x, y);
      const right = x < W ? at(x, y) : left;
      for (let k = start; k < x; k++) {
        const t = (k - start + 1) / (x - start + 1);
        const noise = (Math.random() - 0.5) * 4;
        const o = at(k, y);
        for (let c = 0; c < 3; c++) sky[o + c] = clampN(Math.round(data[left + c] * (1 - t) + data[right + c] * t + noise), 0, 255);
      }
    }
  }
}

// big stars and the moon
const big = components(100).filter((c) => c.pixels.length > 300 && c.x1 - c.x0 < 300);
const sprites = [];
for (const [n, c] of big.entries()) {
  const pad = 4;
  const x0 = Math.max(0, c.x0 - pad), y0 = Math.max(0, c.y0 - pad);
  const x1 = Math.min(W - 1, c.x1 + pad), y1 = Math.min(H - 1, c.y1 + pad);
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const s = ringSky(c.x0, c.y0, c.x1, c.y1, 14);
  const sLum = 0.3 * s[0] + 0.59 * s[1] + 0.11 * s[2];
  // only pixels near the object itself, so stray dots inside the box don't
  // ride along with the sprite
  const near = new Uint8Array(w * h);
  for (const [px, py] of c.pixels) {
    for (let dy = -pad; dy <= pad; dy++) {
      for (let dx = -pad; dx <= pad; dx++) {
        const lx = px + dx - x0, ly = py + dy - y0;
        if (lx >= 0 && ly >= 0 && lx < w && ly < h) near[ly * w + lx] = 1;
      }
    }
  }
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = at(x, y);
      // alpha ramps up from the sky to the object's edge, then colour is
      // un-blended from the sky so edges don't carry a navy fringe
      const a = near[(y - y0) * w + (x - x0)] ? clampN((lum(x, y) - sLum - 12) / 70, 0, 1) : 0;
      const o = ((y - y0) * w + (x - x0)) * 4;
      for (let k = 0; k < 3; k++) rgba[o + k] = a > 0 ? clampN(Math.round((data[i + k] - (1 - a) * s[k]) / a), 0, 255) : 0;
      rgba[o + 3] = Math.round(a * 255);
      // erase the object plus its baked shadow, which falls down and right
      if (a > 0.02) {
        for (let dy = -3; dy <= 14; dy++) {
          for (let dx = -3; dx <= 12; dx++) {
            const ex = x + dx, ey = y + dy;
            if (ex >= 0 && ey >= 0 && ex < W && ey < CLOUD_TOP) erase[ey * W + ex] = 1;
          }
        }
      }
    }
  }
  const isMoon = w > 120;
  const name = isMoon ? "moon" : `star-${n}`;
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/${name}.webp`);
  sprites.push({ name, x: x0, y: y0, w, h });
}

// small dots, dealt round-robin into layers
const dotLayers = Array.from({ length: DOT_LAYERS }, () => Buffer.alloc(W * H * 4));
const small = components(60).filter((c) => c.pixels.length <= 60 && c.y1 < DOT_MAX_Y);
const touchesSprite = (c) => c.pixels.some(([x, y]) => erase[y * W + x]);
const dots = small.filter((c) => !touchesSprite(c));
// a dot half inside a sprite's cut-out is dropped, not layered. its other half
// is erased too, or the row fill would stretch it into a streak.
for (const c of small.filter(touchesSprite)) {
  for (let y = c.y0 - 1; y <= c.y1 + 1; y++) {
    for (let x = c.x0 - 1; x <= c.x1 + 1; x++) {
      if (x >= 0 && y >= 0 && x < W && y < H) erase[y * W + x] = 1;
    }
  }
}
for (const [n, c] of dots.entries()) {
  const s = ringSky(c.x0, c.y0, c.x1, c.y1, 3);
  const sLum = 0.3 * s[0] + 0.59 * s[1] + 0.11 * s[2];
  const layer = dotLayers[n % DOT_LAYERS];
  for (let y = c.y0 - 1; y <= c.y1 + 1; y++) {
    for (let x = c.x0 - 1; x <= c.x1 + 1; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const a = clampN((lum(x, y) - sLum - 4) / 60, 0, 1);
      if (a <= 0) continue;
      const i = at(x, y);
      const o = (y * W + x) * 4;
      for (let k = 0; k < 3; k++) layer[o + k] = clampN(Math.round((data[i + k] - (1 - a) * s[k]) / a), 0, 255);
      layer[o + 3] = Math.round(a * 255);
      erase[y * W + x] = 1;
    }
  }
}
for (const [n, layer] of dotLayers.entries()) {
  await sharp(layer, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/dots-${n}.webp`);
}

paintOut();
await sharp(sky, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 88 }).toFile(`${OUT}/sky.webp`);

writeFileSync("src/app/night-sky.json", JSON.stringify({ width: W, height: H, dotLayers: DOT_LAYERS, sprites }, null, 2) + "\n");
console.log(`${sprites.length} sprites, ${dots.length} dots`);
console.log(sprites.map((s) => `${s.name} ${s.x},${s.y} ${s.w}x${s.h}`).join("\n"));
