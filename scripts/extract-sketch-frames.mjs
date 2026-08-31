// One-off: unpack the pencil-sketch scroll sequence out of the 6MB
// `4am-scroll-fixed.html` (140 base64 WebP frames inlined in a JS array)
// into real files the browser can stream and cache.
//
//   public/scroll-frames/hd/0000.webp … 0139.webp   1280x720, original bytes
//   public/scroll-frames/sd/0000.webp … 0069.webp   960w, every 2nd frame
//
// Inlining 6MB of base64 into the bundle would block JS parse and defeat
// caching; separate files let SketchScrollHero load them progressively.
//
// The frames also get colour-graded here rather than at runtime. The source
// art is neutral grey pencil on cool white, which clashed with the site's
// warm cream/terracotta palette. A 3-stop duotone LUT remaps it onto the
// brand ramp: paper -> --color-bg, graphite -> a warm near-black, with the
// midtones leaning terracotta. Baking it in costs nothing per frame at
// runtime and keeps every frame identically graded (a per-frame auto-levels
// pass would strobe as the sequence played).
// Re-run with:  node scripts/extract-sketch-frames.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC   = '4am-scroll-fixed.html';
const OUT   = 'public/scroll-frames';
const HD_W  = 1600;  // The hero is full-bleed, so on a 1920 screen at dpr 2
                     // the drawing covers ~3840 device px. Upscaling a 1280
                     // source that far is visibly soft; 1600 costs ~11% more
                     // bytes and brings it close to 1:1 on common displays.
const SD_W  = 960;   // half-ish width for phones
const SD_Q  = 72;

/* ── Portrait set ─────────────────────────────────────────────────── */
// Phones get a genuinely PORTRAIT reframe rather than the landscape frame
// letterboxed into a band. The crop is content-aware: each frame's
// ink-weighted horizontal centroid is found and smoothed across neighbours,
// so the window follows the action instead of sitting dead centre.
//
// Note the cost, which is a property of the aspect ratios and not the code:
// a 0.5-aspect window over a 16:9 frame keeps ~28% of its width, so artwork
// and lettering outside that window is not shown on phones.
const PT_ASPECT = 0.5;      // 1:2 — covers phones and portrait tablets
const PT_W = 640;
const PT_H = Math.round(PT_W / PT_ASPECT);
const PT_Q = 72;
const PT_STEP = 2;          // same cadence as `sd`
const PT_SMOOTH = 6;        // +/- frames averaged, so the crop cannot jitter
const HD_Q  = 78;    // The frames get upscaled ~2.25x on a retina screen, so
                     // any re-encode softness compounds. q76 was the single
                     // biggest source of the blur — well above resolution.

// Edge-only unsharp mask. m1 is the FLAT-area gain and m2 the jagged-area
// gain, so m1:0 crisps the pencil lines without amplifying the paper grain
// (amplified grain is pure cost — it doubled the encoded size for no
// visible gain).
const SHARPEN = { sigma: 0.8, m1: 0, m2: 2.2 };
const SD_STEP = 2;   // phones play every 2nd frame

/* ── Colour grade ─────────────────────────────────────────────────── */
// Measured across all 140 frames: the paper sits at grey level 230 and the
// ink floor reaches 0, so 230 is what maps to the paper colour.
const PAPER_LEVEL = 230;
const GRADE = {
  shadow: '#241c17',   // graphite — a warm near-black beside --color-text
  mid:    '#8a7461',   // hatching picks up a terracotta lean
  high:   '#f5ead8',   // --color-bg, so the art sits on the page seamlessly
};

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** 256-entry RGB lookup: grey level -> graded colour. */
const buildLUT = ({ shadow, mid, high }) => {
  const s = hex(shadow), m = hex(mid), h = hex(high);
  const lut = Buffer.alloc(256 * 3);
  for (let v = 0; v < 256; v++) {
    const t = Math.min(1, v / PAPER_LEVEL);
    for (let c = 0; c < 3; c++) {
      const val = t < 0.5
        ? s[c] + (m[c] - s[c]) * (t / 0.5)
        : m[c] + (h[c] - m[c]) * ((t - 0.5) / 0.5);
      lut[v * 3 + c] = Math.max(0, Math.min(255, Math.round(val)));
    }
  }
  return lut;
};

const LUT = buildLUT(GRADE);

/** Greyscale the frame, then push every pixel through the duotone ramp. */
const gradeFrame = async (buf) => {
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < data.length; i++) {
    const v = data[i] * 3;
    out[i * 3] = LUT[v]; out[i * 3 + 1] = LUT[v + 1]; out[i * 3 + 2] = LUT[v + 2];
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } });
};

const html = fs.readFileSync(SRC, 'utf8');
const frames = html
  .split(/\r?\n/)
  .filter((l) => l.startsWith('"UklGR'))
  .map((l) => l.replace(/^"/, '').replace(/",?$/, ''));

if (!frames.length) throw new Error(`no base64 WebP frames found in ${SRC}`);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'hd'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'sd'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'pt'), { recursive: true });

/** Ink-weighted horizontal centre of a frame, 0..1. */
const inkCentre = async (buf) => {
  const { data, info } = await sharp(buf).greyscale().resize({ width: 160 }).raw()
    .toBuffer({ resolveWithObject: true });
  const col = new Float64Array(info.width);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) col[x] += Math.max(0, 200 - data[y * info.width + x]);
  }
  let sum = 0, acc = 0;
  for (let x = 0; x < info.width; x++) { sum += col[x]; acc += col[x] * x; }
  return sum > 0 ? acc / sum / info.width : 0.5;
};

// Pass one: where the drawing actually is, frame by frame, then smoothed.
const rawBufs = frames.map((f) => Buffer.from(f, 'base64'));
const centres = [];
for (const buf of rawBufs) centres.push(await inkCentre(buf));
const smooth = centres.map((_, i) => {
  let a = 0, n = 0;
  for (let k = Math.max(0, i - PT_SMOOTH); k <= Math.min(centres.length - 1, i + PT_SMOOTH); k++) { a += centres[k]; n++; }
  return a / n;
});

const pad = (n) => String(n).padStart(4, '0');
let hdBytes = 0, sdBytes = 0, sdCount = 0;
let ptBytes = 0, ptCount = 0;

for (let i = 0; i < frames.length; i++) {
  const raw = Buffer.from(frames[i], 'base64');
  const graded = await gradeFrame(raw);

  const hd = await graded.clone().resize({ width: HD_W, kernel: 'lanczos3' })
    .sharpen(SHARPEN).webp({ quality: HD_Q, effort: 6 }).toBuffer();
  fs.writeFileSync(path.join(OUT, 'hd', `${pad(i)}.webp`), hd);
  hdBytes += hd.length;

  if (i % PT_STEP === 0) {
    const meta = await graded.clone().metadata();
    const cropW = Math.round(meta.height * PT_ASPECT);
    let left = Math.round(smooth[i] * meta.width - cropW / 2);
    left = Math.max(0, Math.min(meta.width - cropW, left));
    const pt = await graded.clone()
      .extract({ left, top: 0, width: cropW, height: meta.height })
      .resize({ width: PT_W, height: PT_H, kernel: 'lanczos3' })
      .sharpen(SHARPEN)
      .webp({ quality: PT_Q, effort: 6 }).toBuffer();
    fs.writeFileSync(path.join(OUT, 'pt', `${pad(ptCount)}.webp`), pt);
    ptBytes += pt.length;
    ptCount++;
  }

  if (i % SD_STEP === 0) {
    const sd = await graded.clone().resize({ width: SD_W, kernel: 'lanczos3' })
      .sharpen(SHARPEN).webp({ quality: SD_Q, effort: 6 }).toBuffer();
    fs.writeFileSync(path.join(OUT, 'sd', `${pad(sdCount)}.webp`), sd);
    sdBytes += sd.length;
    sdCount++;
  }
}

const meta = {
  hd: frames.length, sd: sdCount, pt: ptCount,
  sdStep: SD_STEP, ptStep: PT_STEP,
  hdWidth: HD_W, sdWidth: SD_W, ptWidth: PT_W, ptHeight: PT_H,
  grade: GRADE,
};
fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

const mb = (b) => (b / 1048576).toFixed(2) + 'MB';
console.log(`hd: ${frames.length} frames, ${mb(hdBytes)}`);
console.log(`sd: ${sdCount} frames, ${mb(sdBytes)}`);
console.log(`pt: ${ptCount} frames, ${mb(ptBytes)}  (${PT_W}x${PT_H} content-aware portrait crop)`);
console.log(`wrote ${OUT}/`);
