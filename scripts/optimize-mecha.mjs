// One-off: crush the 242MB Sketchfab mech into a web-ready GLB.
// - dedup + prune (57 textures often has duplicates / unused data)
// - resize every texture to <=1024, re-encode WebP (fault-tolerant sharp,
//   forced sRGB — Sketchfab ships some odd colour-spaces that break the CLI)
// - Draco-compress geometry
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { dedup, prune, draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';

const IN = 'public/models/mecha.glb';
const OUT = 'public/models/mecha-opt.glb';
const MAX = 512;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.encoder': await draco3d.createEncoderModule(),
    'draco3d.decoder': await draco3d.createDecoderModule(),
  });

console.log('reading', IN, '…');
const doc = await io.read(IN);

console.log('dedup + prune …');
await doc.transform(dedup(), prune());

const textures = doc.getRoot().listTextures();
console.log(`recompressing ${textures.length} textures → WebP @ ${MAX}px …`);
let ok = 0, skipped = 0;
for (const tex of textures) {
  const img = tex.getImage();
  if (!img) { skipped++; continue; }
  try {
    const out = await sharp(Buffer.from(img), { failOn: 'none', unlimited: true })
      .toColourspace('srgb')
      .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
    tex.setImage(new Uint8Array(out));
    tex.setMimeType('image/webp');
    ok++;
  } catch (e) {
    console.warn('  skipped texture', tex.getName() || '(unnamed)', '-', e.message);
    skipped++;
  }
}
console.log(`  textures: ${ok} recompressed, ${skipped} skipped`);

console.log('Draco-compressing geometry …');
await doc.transform(draco());

console.log('writing', OUT, '…');
await io.write(OUT, doc);

const { statSync } = await import('node:fs');
const mb = (statSync(OUT).size / 1024 / 1024).toFixed(2);
console.log(`DONE → ${OUT} = ${mb} MB (was 242.68 MB)`);
