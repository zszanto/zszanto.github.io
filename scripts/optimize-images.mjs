// Optimize images under public/images/ for the web.
//
// Usage:
//   npm run optimize-images              # sweep all of public/images/
//   npm run optimize-images -- <files…>  # only the given files
//
// What it does per image:
//   - auto-applies EXIF orientation into the pixels (photos stay upright)
//   - resizes to fit inside MAX_DIM x MAX_DIM (never enlarges)
//   - re-encodes as JPEG (quality QUALITY, mozjpeg) / PNG for .png files
//   - strips all metadata (EXIF device info, timestamps, GPS coordinates)
//
// Idempotent: files already small enough (both dimensions and bytes) are
// skipped, so running it repeatedly is safe. Run it after adding any new
// photo, before committing. Uses sharp, which ships with Next.js.

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const IMAGES_DIR = 'public/images'
const MAX_DIM = 1600 // fits the /road lightbox (~90vw) comfortably
const QUALITY = 80
const SKIP_BYTES = 300 * 1024 // small files below this are left untouched

// The hero avatar renders at 256px (512px on retina) — no need for 1600.
const PER_FILE_MAX = { 'avatar.jpg': 512 }

const exts = new Set(['.jpg', '.jpeg', '.png'])

async function listImages(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await listImages(full)))
    else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(full)
  }
  return out
}

async function optimize(file) {
  const before = (await stat(file)).size
  const input = await readFile(file)
  const meta = await sharp(input).metadata()
  const maxDim = PER_FILE_MAX[path.basename(file)] ?? MAX_DIM

  const withinDims = meta.width <= maxDim && meta.height <= maxDim
  if (withinDims && before <= SKIP_BYTES) {
    console.log(`skip  ${file} (${meta.width}x${meta.height}, ${kb(before)})`)
    return
  }

  const isPng = path.extname(file).toLowerCase() === '.png'
  let pipeline = sharp(input)
    .rotate() // bake EXIF orientation in before metadata is stripped
    .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
  pipeline = isPng
    ? pipeline.png({ compressionLevel: 9, palette: true })
    : pipeline.jpeg({ quality: QUALITY, mozjpeg: true })

  const output = await pipeline.toBuffer()
  if (output.length >= before) {
    console.log(`keep  ${file} (already smaller than re-encode)`)
    return
  }

  await writeFile(file, output)
  const after = (await stat(file)).size
  console.log(`slim  ${file}: ${kb(before)} -> ${kb(after)}`)
}

const kb = (n) => `${Math.round(n / 1024)}KB`

const targets = process.argv.slice(2)
const files = targets.length > 0 ? targets : await listImages(IMAGES_DIR)
for (const file of files) await optimize(file)
