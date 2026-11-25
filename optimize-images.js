// =============================================================
//  OPTIMIZE-IMAGES.JS — makes fast, right-sized copies of your images
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  Runs automatically on GitHub when you push (and you can run it
//  yourself:  node optimize-images.js). For every image you put in
//  assets/images/ it makes:
//     name.webp      1200px wide  – laptops / big screens / the viewer
//     name-800.webp   800px wide  – most phones
//     name-480.webp   480px wide  – small phones, slow connections
//  plus a tiny blurred preview (stored in assets/images/_previews.json)
//  that shows instantly while the real image downloads.
//  Your original PNG/JPG files are never changed or deleted.
//
//  Needs the "sharp" package:  npm install sharp
// =============================================================

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR = path.join(__dirname, 'assets', 'images');
const PREVIEWS = path.join(IMG_DIR, '_previews.json');
const SIZES = [
    { suffix: '',     width: 1200, quality: 78 },
    { suffix: '-800', width: 800,  quality: 74 },
    { suffix: '-480', width: 480,  quality: 70 }
];
const SKIP = /^(favicon)$/i;                 // keep the favicon as it is
const VARIANT = /-(800|480)$/;               // our own copies — never treated as new images

// On GitHub every file is freshly checked out (all with new dates), so there
// only missing copies are made. On your own computer a replaced original is redone.
const newer = (a, b) => !process.env.CI && fs.statSync(a).mtimeMs > fs.statSync(b).mtimeMs;

(async () => {
    const files = fs.readdirSync(IMG_DIR).filter(f => !f.startsWith('.') && !f.startsWith('_'));

    // one entry per image: prefer the PNG/JPG original, otherwise an uploaded .webp
    const sources = {};
    for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
        const base = f.slice(0, -ext.length);
        if (SKIP.test(base) || VARIANT.test(base)) continue;
        if (ext === '.webp' && sources[base]) continue;       // already have the original
        sources[base] = f;
    }

    let previews = {};
    try { previews = JSON.parse(fs.readFileSync(PREVIEWS, 'utf8')); } catch (e) {}

    let made = 0;
    for (const base of Object.keys(sources).sort()) {
        const srcPath = path.join(IMG_DIR, sources[base]);
        const srcIsWebp = sources[base].toLowerCase().endsWith('.webp');
        let changed = false;

        for (const s of SIZES) {
            const out = path.join(IMG_DIR, base + s.suffix + '.webp');
            if (srcIsWebp && s.suffix === '') continue;        // the upload IS the full-size copy
            if (fs.existsSync(out) && !newer(srcPath, out)) continue;
            await sharp(srcPath).rotate()
                .resize({ width: s.width, withoutEnlargement: true })
                .webp({ quality: s.quality, effort: 6 })
                .toFile(out);
            console.log(`✓ ${base}${s.suffix}.webp  (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
            made++; changed = true;
        }

        if (!previews[base] || changed) {
            const buf = await sharp(srcPath).rotate().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
            previews[base] = 'data:image/webp;base64,' + buf.toString('base64');
        }
        // real size, so the page can keep space for the image before it arrives
        const meta = await sharp(srcPath).metadata();
        let W = meta.width, H = meta.height;
        if (meta.orientation >= 5) { W = meta.height; H = meta.width; }   // photo stored sideways
        const w = Math.min(W, 1200);
        previews[base + ':size'] = [w, Math.round(H * w / W)];
    }

    fs.writeFileSync(PREVIEWS, JSON.stringify(previews, null, 0));
    console.log(made ? `Made ${made} image file(s).` : 'All images already optimized.');
})();
