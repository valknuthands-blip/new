// =============================================================
//  OPTIMIZE-IMAGES.JS — makes small .webp copies of your images
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  Runs automatically on GitHub when you push. For every image in
//  assets/images/ that doesn't have a .webp copy yet, it creates
//  one (max 1200px wide, high quality). Your original PNG/JPG files
//  are never changed or deleted. The site then loads the .webp,
//  which is usually 5–10× smaller, so pages load much faster.
//
//  Needs the "sharp" package:  npm install sharp
// =============================================================

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR = path.join(__dirname, 'assets', 'images');
const MAX_WIDTH = 1200;   // big enough for sharp display at the sizes the site shows
const SKIP = /^(favicon)\./i;   // keep the favicon as PNG

(async () => {
    const files = fs.readdirSync(IMG_DIR);
    let made = 0;
    for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        if (!['.png', '.jpg', '.jpeg'].includes(ext) || SKIP.test(f) || f.startsWith('.')) continue;
        const base = f.slice(0, -ext.length);
        const out = path.join(IMG_DIR, base + '.webp');
        const srcPath = path.join(IMG_DIR, f);
        // (re)make the webp if it's missing or the original is newer
        if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(srcPath).mtimeMs) continue;
        await sharp(srcPath)
            .rotate()
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: 78, effort: 6 })
            .toFile(out);
        const before = fs.statSync(srcPath).size, after = fs.statSync(out).size;
        console.log(`✓ ${f} → ${base}.webp  (${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB)`);
        made++;
    }
    console.log(made ? `Optimized ${made} image(s).` : 'All images already optimized.');
})();
