#!/usr/bin/env node
// One-shot script to convert all existing PNG/JPG/JPEG/BMP/GIF images in
// /uploads to webp. Run once on the server after deploying the webp-on-upload
// changes:
//
//   cd /root/sakugapiece
//   node migrate-to-webp.js
//
// What it does:
//   1. Scans uploads/ for image files we want to convert
//   2. Converts each to .webp with sharp (quality 82)
//   3. Updates references in clips.json, animator_banners.json, episode_banners.json
//   4. Moves originals to uploads/_pre_webp_backup/ (NOT deleted -- you can rm -rf
//      that folder after a week if everything still works)
//   5. Prints a summary at the end
//
// Safe to re-run: skips files already converted (.webp). Idempotent.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = __dirname;
const UPLOADS = path.join(ROOT, 'uploads');
const BACKUP = path.join(UPLOADS, '_pre_webp_backup');
const CLIPS_FILE = path.join(ROOT, 'clips.json');
const ANIM_BANNERS_FILE = path.join(ROOT, 'animator_banners.json');
const EP_BANNERS_FILE = path.join(ROOT, 'episode_banners.json');

if (!fs.existsSync(BACKUP)) fs.mkdirSync(BACKUP, { recursive: true });

const CONVERT_EXTS = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];

function loadJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); }
  catch { return fallback; }
}
function saveJson(p, obj) {
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, p);
}

async function main() {
  const allFiles = fs.readdirSync(UPLOADS).filter(f => {
    const ext = path.extname(f).toLowerCase();
    if (!CONVERT_EXTS.includes(ext)) return false;
    return fs.statSync(path.join(UPLOADS, f)).isFile();
  });

  console.log(`Found ${allFiles.length} image files to consider.`);
  if (!allFiles.length) {
    console.log('Nothing to do.');
    return;
  }

  const renames = new Map();
  let converted = 0, skipped = 0, failed = 0;
  let bytesBefore = 0, bytesAfter = 0;

  for (const f of allFiles) {
    const oldPath = path.join(UPLOADS, f);
    const newName = f.replace(/\.[^.]+$/, '') + '.webp';
    const newPath = path.join(UPLOADS, newName);

    if (fs.existsSync(newPath)) {
      console.log(`[skip] ${f} -- ${newName} already exists`);
      renames.set(f, newName);
      try { fs.renameSync(oldPath, path.join(BACKUP, f)); } catch {}
      skipped++;
      continue;
    }

    try {
      const sizeBefore = fs.statSync(oldPath).size;
      await sharp(oldPath).rotate().webp({ quality: 82 }).toFile(newPath);
      const sizeAfter = fs.statSync(newPath).size;
      bytesBefore += sizeBefore;
      bytesAfter += sizeAfter;
      fs.renameSync(oldPath, path.join(BACKUP, f));
      renames.set(f, newName);
      converted++;
      const ratio = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0);
      console.log(`[ok] ${f} -> ${newName}  (${(sizeBefore/1024).toFixed(0)} KB -> ${(sizeAfter/1024).toFixed(0)} KB, -${ratio}%)`);
    } catch (e) {
      console.error(`[fail] ${f}: ${e.message}`);
      try { if (fs.existsSync(newPath)) fs.unlinkSync(newPath); } catch {}
      failed++;
    }
  }

  const rewrite = (url) => {
    if (typeof url !== 'string') return url;
    const m = url.match(/^\/uploads\/(.+)$/);
    if (!m) return url;
    const old = m[1];
    const next = renames.get(old);
    return next ? '/uploads/' + next : url;
  };

  const clips = loadJson(CLIPS_FILE, []);
  let clipsChanged = 0;
  for (const clip of clips) {
    let touched = false;
    if (clip.thumbnailUrl) {
      const r = rewrite(clip.thumbnailUrl);
      if (r !== clip.thumbnailUrl) { clip.thumbnailUrl = r; touched = true; }
    }
    if (Array.isArray(clip.images)) {
      for (const img of clip.images) {
        if (img.url) {
          const r = rewrite(img.url);
          if (r !== img.url) { img.url = r; touched = true; }
        }
        if (img.filename) {
          const r = renames.get(img.filename);
          if (r) { img.filename = r; touched = true; }
        }
      }
    }
    if (touched) clipsChanged++;
  }
  if (clipsChanged) {
    saveJson(CLIPS_FILE, clips);
    console.log(`Updated ${clipsChanged} clips in clips.json`);
  }

  const animBanners = loadJson(ANIM_BANNERS_FILE, {});
  let animChanged = 0;
  for (const k of Object.keys(animBanners)) {
    const r = rewrite(animBanners[k]);
    if (r !== animBanners[k]) { animBanners[k] = r; animChanged++; }
  }
  if (animChanged) {
    saveJson(ANIM_BANNERS_FILE, animBanners);
    console.log(`Updated ${animChanged} entries in animator_banners.json`);
  }

  const epBanners = loadJson(EP_BANNERS_FILE, {});
  let epChanged = 0;
  for (const k of Object.keys(epBanners)) {
    const r = rewrite(epBanners[k]);
    if (r !== epBanners[k]) { epBanners[k] = r; epChanged++; }
  }
  if (epChanged) {
    saveJson(EP_BANNERS_FILE, epBanners);
    console.log(`Updated ${epChanged} entries in episode_banners.json`);
  }

  console.log('\n========== SUMMARY ==========');
  console.log(`Converted:  ${converted}`);
  console.log(`Skipped:    ${skipped} (already converted)`);
  console.log(`Failed:     ${failed}`);
  if (bytesBefore > 0) {
    const mbBefore = (bytesBefore / 1024 / 1024).toFixed(1);
    const mbAfter  = (bytesAfter / 1024 / 1024).toFixed(1);
    const saved = ((1 - bytesAfter / bytesBefore) * 100).toFixed(0);
    console.log(`Size:       ${mbBefore} MB -> ${mbAfter} MB (${saved}% smaller)`);
  }
  console.log(`Originals:  moved to uploads/_pre_webp_backup/ (delete after verifying)`);
  console.log('\nDone. Restart pm2: pm2 restart sakugapiece');
}

main().catch(e => { console.error(e); process.exit(1); });
