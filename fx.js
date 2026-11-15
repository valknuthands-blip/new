// =============================================================
//  FX.JS — Editorial layout + scroll distortion
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  What this does (works in BOTH dark and light theme):
//   1. Re-lays out Marketing, Animation and Web Dev into a
//      staggered "editorial" layout (image on one side,
//      label / title / caption on the other).
//   2. Images ripple and bend like liquid while you scroll
//      (and around the mouse on desktop) — WebGL.
//   3. Videos stretch slightly with scroll speed.
//   4. Items slide in and titles light up letter by letter.
//
//  Everything stops drawing when you're not scrolling, so it
//  costs nothing while the page is still.
// =============================================================

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────
    //  EDIT ME — labels, titles and captions.
    //  Marketing images are matched by FILE NAME (e.g. "12" = 12.png/12.webp)
    //  and videos by their YouTube ID, so adding new images never
    //  shifts the captions around. New images without an entry here
    //  still appear automatically (titled from their file name).
    // ─────────────────────────────────────────────────────────
    var CONFIG = {
        sections: {
            marketing: { grid: '.portfolio-grid', label: 'Marketing Collateral', showFirst: 12 },
            animation: { grid: '.animation-grid', label: 'Animation',            showFirst: 0 },
            dev:       { grid: '.dev-stack',      label: 'Website Development',  showFirst: 0 }
        },

        captions: {
            // ── Marketing (key = image file name) ──
            '1':  ['Social Campaign',  'Bula Impact — Photoshoots',        'Service ad for professional photoshoot packages.'],
            '2':  ['Social Campaign',  'Elevate Your Digital Presence',    'Web design, branding, SEO and marketing promo for Bula Impact.'],
            '3':  ['Social Campaign',  'Need Expert Designers?',           'Design-services ad for Bula Impact.'],
            '4':  ['Automotive',       'Mitsubishi L200',                  '“Master of all terrain” print ad for Nivis Motors.'],
            '5':  ['Heavy Machinery',  'LiuGong 908E Excavator',           '“Fit for purpose” equipment ad for Nivis Motors.'],
            '6':  ['Automotive',       'All-New Pajero Sport',             'Feature-led launch ad for Nivis Motors.'],
            '7':  ['Sports',           '#ReadySetSevens',                  'Rugby sevens poster built from composited action shots.'],
            '8':  ['Food & Beverage',  'Meadow Fresh Milk Drinks',         'Strawberry and Choco Choc price-point poster.'],
            '9':  ['Sports',           'Coca-Cola Games 2026',             'National Championship souvenir programme cover.'],
            '10': ['Sponsorship',      'Women in Rugby',                   'Royal Tea × Ranadi Cup banner.'],
            '11': ['Sponsorship',      'Packed with Goodness',             'Rewa Life milk × Fiji Rugby banner.'],
            '12': ['Sponsorship',      'Supporting Women in Rugby',        'Royal Tea Ranadi Cup product banner.'],
            '13': ['Sports',           'Match Day: Fiji vs Scotland',      'Fiji Water × Flying Fijians fixture banner.'],
            '14': ['Food & Beverage',  'Skipper Tuna',                     '“Delicious tuna flakes for you” range banner.'],
            '15': ['Food & Beverage',  '#SmartChoice',                     'Sunquick “everyone loves” banner.'],
            '16': ['Beverage',         'Tribe',                            'Bottle range key visual.'],
            '17': ['Beverage',         'Ask for a 10',                     'Bounty Strong rum & cola banner.'],
            '18': ['Product Launch',   'Unleash the Beast',                'Monster Energy Fiji launch poster.'],
            '19': ['Retail',           'MacBook Air — Midnight',           'Spec-and-price ad for iCentre.'],
            '20': ['Retail',           'Apple Pencil, 1st & 2nd Gen',      'Side-by-side comparison ad for iCentre.'],
            '21': ['Event',            'Vonu Golf — Programme',            'Two-day event programme, Denarau Golf & Racquet Club.'],
            '22': ['Beverage',         'Tropical Escape in Every Sip',     'FruBu juice lifestyle ad.'],
            '23': ['Beverage',         'Sharing Your Golden Moments',      'Fiji Gold beer poster.'],
            '24': ['Packaging Launch', 'Vonu — New Look',                  'Pure Lager and Ultra Low Carb new-look announcement.'],
            '25': ['Food & Beverage',  'Better with Rewa Butter',          'Product hero visual.'],
            '26': ['Hospitality',      'Grab a Chilled One Here',          'Fiji Gold mug & jug price promo for Momos Tavern.'],
            '27': ['Retail Signage',   'Grab a Cold One — Fiji Bitter',    'In-store chiller signage.'],
            '28': ['Retail Signage',   'Grab a Cold One — Fiji Gold',      'In-store chiller signage, can edition.'],
            '29': ['Retail Signage',   'Grab a Cold One — Fiji Gold',      'In-store chiller banner, bottle edition.'],
            '30': ['Automotive',       'Mitsubishi Eclipse Cross',         'Long-format feature flyer for Nivis Motors.'],
            '31': ['Awards',           'Gold Medal Winner',                'Ratu Signature Blend — IWSC 2024 announcement.'],
            '32': ['Beverage',         'Taste the Spirit of Fiji',         'Bounty Overproof dark rum poster.'],
            '33': ['Beverage',         'Fiji’s Favourite Rum & Cola',      'Bounty ready-to-drink poster.'],
            '34': ['Beverage',         'The Taste of Home in Every Sip',   'FruBu Mango & Orange key visual.'],
            '35': ['Beverage',         'Make Every Break Refreshing',      'Minute Maid 1L price poster.'],
            '36': ['Rebrand',          'Powerade — New Look',              '“Same great taste” trade presentation.'],
            '37': ['Event',            'Vonu Pro-Am Golf Invitation',      'Invitation celebrating 27 years of Vonu.'],

            // ── Animation (key = YouTube ID) ──
            'wqCc4geO5DI': ['3D Product Animation', 'Lager Can — Spot 01',   'Vertical cut for social.'],
            'MWThSXPTc_c': ['3D Product Animation', 'Lager Can — Spot 02',   'Vertical cut for social.'],
            'zv0xI634rqs': ['Personal Project',     'Motion Experiment',     'A personal fun project.'],
            'hZNuPDXFEpc': ['TV / Digital Ad',      'Fiji Bitter — 35s Spot', 'Full-length brand commercial.'],
            'kzaSZNhqbhA': ['Product Concept',      'CJP New Product Mock',  'Animated mock-up for new product development.'],
            'ul-0FkNP1ws': ['Social Animation',     'Bounty 10 — 8s Social', 'Short loop for social feeds.'],
            'GjzEislSLNo': ['LED Screen Ad',        'Rewa Powder Milk',      'Animation for large outdoor LED screens.'],
            '2V0g2MkoTVw': ['LED Screen Ad',        'Skipper Tuna',          'Animation for large outdoor LED screens.'],

            // ── Website Development (key = YouTube ID) — rename these! ──
            'nqnIC97hcJg': ['Web Development', 'Website Build 01', 'Custom-coded site walkthrough.'],
            'JyUP5vBN1hk': ['Web Development', 'Website Build 02', 'Custom-coded site walkthrough.'],
            'eHui1R48kTo': ['Web Development', 'Website Build 03', 'Custom-coded site walkthrough.'],
            'c4hrjQiM080': ['Web Development', 'Website Build 04', 'Custom-coded site walkthrough.']
        },

        distortion: 1.0,     // 0 = off, 1 = normal, 2 = strong
        ripple: true         // liquid ripple under the mouse (desktop)
    };

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer  = window.matchMedia('(pointer: fine)').matches;
    var isMobile     = !finePointer || window.innerWidth < 768;

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    // =========================================================
    //  1. EDITORIAL LAYOUT
    // =========================================================
    function buildLayout() {
        Object.keys(CONFIG.sections).forEach(function (key) {
            var cfg  = CONFIG.sections[key];
            var grid = document.querySelector(cfg.grid);
            if (!grid || grid.classList.contains('fx-editorial')) return;

            grid.classList.add('fx-editorial');
            var items = Array.prototype.slice.call(grid.children).filter(function (el) {
                return el.nodeType === 1;
            });

            items.forEach(function (card, i) {
                // Wrap everything currently in the card as the "media"
                var media = document.createElement('div');
                media.className = 'fx-media';
                while (card.firstChild) media.appendChild(card.firstChild);

                var info = lookupCaption(media, cfg, i);
                var meta = document.createElement('div');
                meta.className = 'fx-meta';
                meta.innerHTML =
                    '<span class="fx-label">' + info[0] + '</span>' +
                    '<span class="fx-title">' + splitLetters(info[1]) + '</span>' +
                    (info[2] ? '<span class="fx-caption">' + info[2] + '</span>' : '') +
                    '<span class="fx-count">' + pad(i + 1) + ' / ' + pad(items.length) + '</span>';

                card.appendChild(media);
                card.appendChild(meta);

                // Remember each image's shape so tall posters never fill the whole screen
                var img = media.querySelector('img');
                if (img) {
                    var setRatio = function () {
                        if (img.naturalWidth) media.style.setProperty('--ar', (img.naturalWidth / img.naturalHeight).toFixed(4));
                    };
                    if (img.complete) setRatio(); else img.addEventListener('load', setRatio, { once: true });
                }
                card.classList.add('fx-item', 'fx-pos-' + (i % 4));
                if (media.querySelector('.yt-short')) card.classList.add('fx-portrait');
                if (media.querySelector('iframe'))   card.classList.add('fx-video');

                if (cfg.showFirst && i >= cfg.showFirst) card.classList.add('fx-hidden');
            });

            // "Show all" button for long sections
            if (cfg.showFirst && items.length > cfg.showFirst) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'fx-more';
                btn.innerHTML = 'Show all ' + items.length + ' <span>↓</span>';
                btn.addEventListener('click', function () {
                    grid.querySelectorAll('.fx-hidden').forEach(function (el) {
                        el.classList.remove('fx-hidden');
                        revealObserver && revealObserver.observe(el);
                    });
                    btn.remove();
                    refreshPlanes();
                });
                grid.parentNode.insertBefore(btn, grid.nextSibling);
            }
        });
    }

    // Find the caption for a card: by image file name, or YouTube ID
    function lookupCaption(media, cfg, i) {
        var key = null;
        var img = media.querySelector('img');
        var frame = media.querySelector('iframe');
        if (img) {
            var file = decodeURIComponent((img.getAttribute('src') || '').split('/').pop());
            key = file.replace(/\.[a-z0-9]+$/i, '');
        } else if (frame) {
            var m = (frame.getAttribute('src') || '').match(/embed\/([A-Za-z0-9_-]+)/);
            key = m && m[1];
        }
        var c = key && CONFIG.captions[key];
        if (c) return c;
        // New image with no caption yet: use the section name + a title from the file name
        var title = key && !/^\d+$/.test(key)
            ? key.replace(/[-_]+/g, ' ').replace(/\b\w/g, function (ch) { return ch.toUpperCase(); })
            : 'No. ' + pad(i + 1);
        return [cfg.label, title, ''];
    }

    function splitLetters(text) {
        return String(text).split('').map(function (ch, i) {
            return '<span class="fx-ch" style="--d:' + (i * 35) + 'ms">' +
                   (ch === ' ' ? '&nbsp;' : ch) + '</span>';
        }).join('');
    }

    // =========================================================
    //  2. REVEAL ON ENTER (slide in + letter-by-letter title)
    // =========================================================
    var revealObserver = null;
    function setupReveal() {
        var items = document.querySelectorAll('.fx-item');
        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('fx-in'); });
            return;
        }
        revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('fx-in');
                    revealObserver.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -12% 0px' });
        items.forEach(function (el) {
            if (!el.classList.contains('fx-hidden')) revealObserver.observe(el);
        });
    }

    // =========================================================
    //  3. SCROLL SPEED (shared by every effect)
    // =========================================================
    var lastY = window.scrollY, velocity = 0, running = false, lastScrollTime = 0;

    function onScroll() {
        lastScrollTime = performance.now();
        if (!running) { running = true; requestAnimationFrame(tick); }
    }

    function tick(now) {
        var y = window.scrollY;
        var raw = y - lastY;
        lastY = y;
        // ease towards the raw speed so the effect builds and settles smoothly
        velocity += (raw - velocity) * 0.12;
        var v = Math.max(-60, Math.min(60, velocity));

        updateVideos(v);
        var hovering = renderPlanes(v, now);

        // keep going until things have settled
        if (Math.abs(velocity) > 0.05 || hovering || now - lastScrollTime < 120) {
            requestAnimationFrame(tick);
        } else {
            velocity = 0;
            updateVideos(0);
            renderPlanes(0, now, true);
            running = false;
        }
    }

    function kick() {
        if (!running) { running = true; requestAnimationFrame(tick); }
    }

    // ── Videos (YouTube can't be drawn in WebGL) → bend the frame with CSS ──
    // The frame leans with the scroll, stretches, and its top & bottom
    // edges curve (elliptical corners) so it reads like the bending images.
    var videoEls = [];
    function updateVideos(v) {
        var k = CONFIG.distortion;
        for (var i = 0; i < videoEls.length; i++) {
            var el = videoEls[i];
            if (!v) { el.style.transform = ''; el.style.borderRadius = ''; continue; }
            var a = Math.min(1, Math.abs(v) / 40);
            el.style.transform =
                'perspective(900px) rotateX(' + (-v * 0.18 * k).toFixed(2) + 'deg) ' +
                'skewY(' + (v * 0.035 * k).toFixed(2) + 'deg) ' +
                'scale(' + (1 - a * 0.04 * k).toFixed(4) + ',' + (1 + a * 0.06 * k).toFixed(4) + ')';
            el.style.borderRadius = '50% / ' + (a * 9 * k).toFixed(2) + '%';
        }
    }

    // =========================================================
    //  4. WEBGL BENDING IMAGES (like the reference)
    //  The whole image — frame included — bends like a sheet of
    //  paper being pulled while you scroll: the edges curve, the
    //  picture waves and splits colour. On desktop it also ripples
    //  around the mouse. One shared WebGL context draws each visible
    //  image into a canvas slightly bigger than the image (so the
    //  curved edges have room); at rest the normal <img> is shown.
    // =========================================================
    var gl = null, glCanvas = null, program = null, uni = {}, planes = [];
    var MAX_DPR = isMobile ? 1.5 : 2;
    var SEG = 24;                 // mesh detail (24×24 squares)
    var PAD_X = 0.08, PAD_Y = 0.22;  // extra room around the image for the bend

    var VERT = [
        // same precision as the fragment shader, so shared uniforms (uVel) link
        'precision mediump float;',
        'attribute vec2 aUv;',
        'uniform vec2  uInner;',   // image size as a fraction of the canvas
        'uniform float uVel;',     // scroll speed (-1..1)
        'varying vec2 vUv;',
        'const float PI = 3.14159265;',
        'void main(){',
        '  vUv = aUv;',
        '  vec2 p = aUv;',
        // the middle of the sheet lags behind the scroll → top & bottom edges curve
        '  p.y += sin(aUv.x * PI) * uVel * 0.16;',
        // and it pinches slightly at the sides, like real paper
        '  p.x = 0.5 + (p.x - 0.5) * (1.0 - abs(uVel) * 0.05 * sin(aUv.y * PI));',
        '  vec2 clip = vec2((p.x * 2.0 - 1.0) * uInner.x, -(p.y * 2.0 - 1.0) * uInner.y);',
        '  gl_Position = vec4(clip, 0.0, 1.0);',
        '}'
    ].join('\n');

    var FRAG = [
        'precision mediump float;',
        'uniform sampler2D uTex;',
        'uniform float uVel;',
        'uniform float uTime;',
        'uniform vec2  uMouse;',
        'uniform float uHover;',
        'uniform float uAspect;',
        'varying vec2 vUv;',
        'void main(){',
        '  vec2 uv = vUv;',
        // liquid wave travelling through the picture
        '  uv.x += sin(uv.y * 8.0 + uTime * 2.2) * uVel * 0.014;',
        // hover ripple rings around the mouse
        '  vec2 d = (uv - uMouse) * vec2(uAspect, 1.0);',
        '  float dist = length(d);',
        '  float ring = sin(dist * 38.0 - uTime * 5.0) * exp(-dist * 7.0);',
        '  uv += normalize(d + 1e-5) * ring * 0.012 * uHover;',
        '  uv = clamp(uv, 0.001, 0.999);',
        // colour split that follows the scroll direction
        '  float s = uVel * 0.008 + ring * 0.004 * uHover;',
        '  vec4 c;',
        '  c.r = texture2D(uTex, clamp(uv + vec2(0.0, s), 0.001, 0.999)).r;',
        '  c.g = texture2D(uTex, uv).g;',
        '  c.b = texture2D(uTex, clamp(uv - vec2(0.0, s), 0.001, 0.999)).b;',
        '  c.a = 1.0;',
        '  gl_FragColor = c;',
        '}'
    ].join('\n');

    var indexCount = 0;
    function initGL() {
        if (reduceMotion || !CONFIG.distortion) return false;
        glCanvas = document.createElement('canvas');
        var opts = { alpha: true, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true };
        gl = glCanvas.getContext('webgl', opts) || glCanvas.getContext('experimental-webgl', opts);
        if (!gl) return false;

        function sh(type, src) {
            var s = gl.createShader(type);
            gl.shaderSource(s, src); gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
            return s;
        }
        try {
            program = gl.createProgram();
            gl.attachShader(program, sh(gl.VERTEX_SHADER, VERT));
            gl.attachShader(program, sh(gl.FRAGMENT_SHADER, FRAG));
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
            gl.useProgram(program);
        } catch (e) { console.warn('fx: WebGL effect disabled —', e.message); gl = null; return false; }

        // A grid of points (so the sheet can bend smoothly)
        var verts = [], idx = [];
        for (var y = 0; y <= SEG; y++) for (var x = 0; x <= SEG; x++) verts.push(x / SEG, y / SEG);
        for (var y2 = 0; y2 < SEG; y2++) for (var x2 = 0; x2 < SEG; x2++) {
            var a = y2 * (SEG + 1) + x2, b = a + 1, c = a + SEG + 1, d = c + 1;
            idx.push(a, b, c, b, d, c);
        }
        indexCount = idx.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
        var loc = gl.getAttribLocation(program, 'aUv');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        ['uTex', 'uVel', 'uTime', 'uMouse', 'uHover', 'uAspect', 'uInner'].forEach(function (n) {
            uni[n] = gl.getUniformLocation(program, n);
        });
        gl.clearColor(0, 0, 0, 0);
        return true;
    }

    // A "plane" = one <img> + its overlay canvas
    function makePlane(img) {
        var media = img.closest('.fx-media');
        var cv = document.createElement('canvas');
        cv.className = 'fx-canvas';
        media.appendChild(cv);
        var p = {
            img: img, media: media, canvas: cv, ctx: cv.getContext('2d'),
            tex: null, visible: false, shown: false, w: 0, h: 0,
            mouse: [0.5, 0.5], hover: 0, hoverTarget: 0
        };
        if (finePointer && CONFIG.ripple) {
            media.addEventListener('mousemove', function (e) {
                var r = img.getBoundingClientRect();
                p.mouse[0] = (e.clientX - r.left) / r.width;
                p.mouse[1] = (e.clientY - r.top) / r.height;
                p.hoverTarget = 1; kick();
            });
            media.addEventListener('mouseleave', function () { p.hoverTarget = 0; kick(); });
        }
        return p;
    }

    var planeObserver = null;
    function setupPlanes() {
        if (!initGL()) return;
        document.querySelectorAll('.fx-editorial .fx-media img').forEach(function (img) {
            planes.push(makePlane(img));
        });
        // only bother with images near the screen
        planeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                var p = planes.find(function (q) { return q.media === e.target; });
                if (!p) return;
                p.visible = e.isIntersecting;
                if (!p.visible) freeTexture(p);
            });
        }, { rootMargin: '25% 0px' });
        planes.forEach(function (p) { planeObserver.observe(p.media); });
    }

    function refreshPlanes() {
        if (!planeObserver) return;
        planes.forEach(function (p) { planeObserver.unobserve(p.media); planeObserver.observe(p.media); });
    }

    function ensureTexture(p) {
        if (p.tex) return true;
        var img = p.img;
        if (!img.complete || !img.naturalWidth) return false;
        p.tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, p.tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        try {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        } catch (e) { gl.deleteTexture(p.tex); p.tex = null; return false; }
        return true;
    }

    function freeTexture(p) {
        if (p.tex) { gl.deleteTexture(p.tex); p.tex = null; }
        hidePlane(p);
    }

    function hidePlane(p) {
        if (p.shown) {
            p.canvas.style.opacity = '0';
            p.img.style.visibility = '';
            p.shown = false;
        }
    }

    // returns true while any image is still being hovered/animated
    function renderPlanes(v, now, settle) {
        if (!gl) return false;
        var busy = false;
        var vel = Math.max(-1, Math.min(1, v / 40)) * CONFIG.distortion;
        var t = now / 1000;
        var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

        for (var i = 0; i < planes.length; i++) {
            var p = planes[i];
            p.hover += (p.hoverTarget - p.hover) * 0.08;
            if (Math.abs(p.hover - p.hoverTarget) > 0.01 || p.hoverTarget) busy = true;

            var active = !settle && (Math.abs(vel) > 0.004 || p.hover > 0.01);
            if (!p.visible || !active) { hidePlane(p); continue; }
            if (!ensureTexture(p)) continue;

            var iw = p.img.clientWidth, ih = p.img.clientHeight;
            if (!iw || !ih) continue;
            // canvas = image + padding all round, so the bent edges fit
            var px = Math.round(iw * PAD_X), py = Math.round(ih * PAD_Y);
            var cw = iw + px * 2, ch = ih + py * 2;
            if (p.w !== cw || p.h !== ch) {
                p.w = cw; p.h = ch;
                p.canvas.style.left = (p.img.offsetLeft - px) + 'px';
                p.canvas.style.top = (p.img.offsetTop - py) + 'px';
                p.canvas.style.width = cw + 'px';
                p.canvas.style.height = ch + 'px';
                p.canvas.width = Math.round(cw * dpr);
                p.canvas.height = Math.round(ch * dpr);
            }
            var W = p.canvas.width, H = p.canvas.height;
            if (glCanvas.width !== W || glCanvas.height !== H) { glCanvas.width = W; glCanvas.height = H; }

            gl.viewport(0, 0, W, H);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.bindTexture(gl.TEXTURE_2D, p.tex);
            gl.uniform1i(uni.uTex, 0);
            gl.uniform1f(uni.uVel, vel);
            gl.uniform1f(uni.uTime, t);
            gl.uniform2f(uni.uMouse, p.mouse[0], p.mouse[1]);
            gl.uniform1f(uni.uHover, p.hover);
            gl.uniform1f(uni.uAspect, iw / ih);
            gl.uniform2f(uni.uInner, iw / cw, ih / ch);
            gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);

            p.ctx.clearRect(0, 0, W, H);
            p.ctx.drawImage(glCanvas, 0, 0);
            if (!p.shown) {
                p.canvas.style.opacity = '1';
                p.img.style.visibility = 'hidden';   // the bent copy replaces it
                p.shown = true;
            }
        }
        return busy;
    }

    // =========================================================
    //  BOOT
    // =========================================================
    var booted = false;
    function boot() {
        if (booted) return;
        if (!document.querySelector('.portfolio-grid, .animation-grid, .dev-stack')) return;
        booted = true;
        buildLayout();
        setupReveal();
        videoEls = Array.prototype.slice.call(document.querySelectorAll('.fx-video .yt-wrap, .fx-video .dev-video-wrapper'));
        if (!reduceMotion) {
            setupPlanes();
            window.addEventListener('scroll', onScroll, { passive: true });
        }
        document.documentElement.classList.add('fx-ready');
    }

    if (window.contentLoaded) boot();
    document.addEventListener('content-loaded', boot);
}());
