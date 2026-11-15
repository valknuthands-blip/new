// =============================================================
//  GENERATE-MARKETING.JS — auto-builds the image galleries
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  Runs automatically on GitHub every time you push (see
//  .github/workflows/deploy.yml). You can also run it yourself:
//      node generate-marketing.js
//
//  HOW TO ADD NEW WORK — just upload images to assets/images/:
//    • Marketing   → any name, e.g. 38.png, 39.jpg, coca-cola.png
//    • Instagram   → ig + number, e.g. ig9.png
//    • Photography → p + number, e.g. p5.png
//  Files named dp.*, favicon.* or starting with _ are ignored.
//  Images are sorted by number (1, 2, 10 — not 1, 10, 2).
//  If a .webp version exists (made by optimize-images.js) the
//  site uses it automatically because it's much smaller.
// =============================================================

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const IMG_DIR = path.join(ROOT, 'assets', 'images');
const SOURCE_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const MARKER = '<!-- AUTO-GENERATED -->';

// ── Collect images ────────────────────────────────────────────
const files = fs.readdirSync(IMG_DIR).filter(f => !f.startsWith('.') && !f.startsWith('_'));

// group by base name so "5.png" + "5.webp" count as one image
const byBase = {};
for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!SOURCE_EXT.includes(ext)) continue;
    const base = f.slice(0, -ext.length);
    (byBase[base] = byBase[base] || []).push(f);
}

// prefer .webp, otherwise the original
function pick(base) {
    const list = byBase[base];
    return list.find(f => f.toLowerCase().endsWith('.webp')) || list[0];
}

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
const bases = Object.keys(byBase).sort(natural);

const isInstagram   = b => /^ig\d+$/i.test(b);
const isPhotography = b => /^p\d+$/i.test(b);
const isReserved    = b => /^(dp|favicon)$/i.test(b);

const marketing   = bases.filter(b => !isInstagram(b) && !isPhotography(b) && !isReserved(b)).map(pick);
const instagram   = bases.filter(isInstagram).map(pick);
const photography = bases.filter(isPhotography).map(pick);

// ── Write a gallery into its section file ─────────────────────
// Keeps everything in the file, only replaces the lines between
// "<!-- AUTO-GENERATED -->" and the closing tag of that container.
function writeGallery(file, items, indent) {
    const full = path.join(ROOT, 'lib', file);
    const html = fs.readFileSync(full, 'utf8');
    const start = html.indexOf(MARKER);
    if (start === -1) { console.warn(`! ${file}: no ${MARKER} marker, skipped`); return; }
    const afterMarker = start + MARKER.length;
    // the container closes at the first "</div>" that is at the container's own indent level
    const closeRe = new RegExp('\\n' + indent.slice(4) + '</div>');
    const m = closeRe.exec(html.slice(afterMarker));
    if (!m) { console.warn(`! ${file}: couldn't find end of gallery, skipped`); return; }
    const end = afterMarker + m.index;
    const body = items.map(line => '\n' + indent + line).join('');
    const out = html.slice(0, afterMarker) + body + html.slice(end);
    if (out !== html) {
        fs.writeFileSync(full, out);
        console.log(`✓ ${file}: ${items.length} images`);
    } else {
        console.log(`= ${file}: no change (${items.length} images)`);
    }
}

const src = f => 'assets/images/' + encodeURI(f);

// Marketing (lib/g7e4.html)
writeGallery('g7e4.html',
    marketing.map(f => `<div class="portfolio-card"><img src="${src(f)}" alt="" loading="lazy" decoding="async"></div>`),
    '        ');

// Instagram (lib/d3c6.html)
writeGallery('d3c6.html',
    instagram.map(f => `<div class="instagram-img-c"><div class="instagram-img-w" style="background-image: url('${src(f)}')"></div></div>`),
    '        ');

// Photography 3D cube (lib/e5a8.html)
writeGallery('e5a8.html',
    photography.map((f, i) => `<span style="--i: ${i + 1}"><img src="${src(f)}" alt="" loading="lazy" decoding="async"></span>`),
    '        ');
