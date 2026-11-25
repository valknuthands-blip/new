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
//  If .webp copies exist (made by optimize-images.js) the site
//  uses them: phones get the small copy, big screens the full one,
//  and a tiny blurred preview shows instantly while they load.
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
    if (/-(800|480)$/.test(base)) continue;          // size copies, not separate images
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

// size copies + blurred previews made by optimize-images.js
let previews = {};
try { previews = JSON.parse(fs.readFileSync(path.join(IMG_DIR, '_previews.json'), 'utf8')); } catch (e) {}
const baseOf = f => f.slice(0, -path.extname(f).length);
const has = name => fs.existsSync(path.join(IMG_DIR, name));

// <img> with small/medium/full copies, real size (no jumping) and an instant blurred preview
function img(f, sizes) {
    const b = baseOf(f);
    let a = `src="${src(f)}"`;
    if (f.endsWith('.webp') && has(b + '-480.webp') && has(b + '-800.webp')) {
        a += ` srcset="${src(b + '-480.webp')} 480w, ${src(b + '-800.webp')} 800w, ${src(f)} 1200w" sizes="${sizes}"`;
    }
    const wh = previews[b + ':size'];
    if (wh) a += ` width="${wh[0]}" height="${wh[1]}"`;
    if (previews[b]) a += ` style="background:url(${previews[b]}) center/cover no-repeat"`;
    return `<img ${a} alt="" loading="lazy" decoding="async">`;
}

// Instagram tiles are backgrounds: perf.js picks the right copy for the tile's size
function bgTile(f) {
    const b = baseOf(f);
    let a = `data-bg="${src(f)}"`;
    if (f.endsWith('.webp') && has(b + '-480.webp') && has(b + '-800.webp')) {
        a += ` data-bg-480="${src(b + '-480.webp')}" data-bg-800="${src(b + '-800.webp')}"`;
    }
    if (previews[b]) a += ` style="background-image:url(${previews[b]})"`;
    return `<div class="instagram-img-w" ${a}></div>`;
}

// Marketing (lib/g7e4.html)
writeGallery('g7e4.html',
    marketing.map(f => `<div class="portfolio-card">${img(f, '(max-width: 767px) 55vw, (max-width: 1200px) 45vw, 560px')}</div>`),
    '        ');

// Instagram (lib/d3c6.html)
writeGallery('d3c6.html',
    instagram.map(f => `<div class="instagram-img-c">${bgTile(f)}</div>`),   // perf.js loads it when near
    '        ');

// Photography 3D cube (lib/e5a8.html)
writeGallery('e5a8.html',
    photography.map((f, i) => `<span style="--i: ${i + 1}">${img(f, '(max-width: 767px) 50vw, 300px')}</span>`),
    '        ');
