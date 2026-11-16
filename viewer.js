// =============================================================
//  VIEWER.JS — open any piece full screen
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  Works for Marketing, Photography and Instagram.
//  • Phone: double-tap an image to open it (a single tap, a scroll
//    or a swipe is left alone, so nothing opens by accident).
//  • Desktop: click an image.
//  • "Back" button, the phone's back gesture/button, Esc, or tapping
//    the dark area closes it — you stay where you were on the site.
//  • Swipe left/right (or arrow keys / the arrow buttons) to browse
//    within that gallery.
// =============================================================
(function () {
    'use strict';

    function text(el, sel) {
        var n = el.querySelector(sel);
        return n ? n.textContent.replace(/\s+/g, ' ').trim() : '';
    }
    function bgUrl(el) {
        if (!el) return '';
        var d = el.getAttribute('data-bg');
        if (d) return d;
        var m = (el.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/);
        return m ? m[1] : '';
    }

    // ── the three galleries ──────────────────────────────────
    var GROUPS = [
        {
            name: 'marketing',
            container: '.portfolio-grid',
            item: '.fx-item',
            info: function (el) {
                var img = el.querySelector('.fx-media img');
                return { src: img ? (img.currentSrc || img.src) : '', label: text(el, '.fx-label'), title: text(el, '.fx-title'), caption: text(el, '.fx-caption') };
            }
        },
        {
            name: 'photography',
            container: '.photography-section .image-container',
            item: 'span',
            info: function (el, i) {
                var img = el.querySelector('img');
                return { src: img ? (img.currentSrc || img.src) : '', label: 'Photography', title: 'Photograph ' + (i + 1), caption: '' };
            }
        },
        {
            name: 'instagram',
            container: '.instagram-gallery',
            item: '.instagram-img-c',
            info: function (el, i) {
                return { src: bgUrl(el.querySelector('.instagram-img-w')), label: 'Instagram', title: '@vivash.s', caption: 'Post ' + (i + 1) };
            }
        }
    ];

    // ── the viewer itself ────────────────────────────────────
    var viewer, imgEl, labelEl, titleEl, capEl, countEl;
    var group = null, items = [], index = 0, open = false, lastFocus = null;
    var CHEV_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var CHEV_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function build() {
        viewer = document.createElement('div');
        viewer.className = 'pv';
        viewer.setAttribute('role', 'dialog');
        viewer.setAttribute('aria-modal', 'true');
        viewer.setAttribute('aria-label', 'Image viewer');
        viewer.hidden = true;
        viewer.innerHTML =
            '<div class="pv__bar">' +
                '<button type="button" class="pv__back" aria-label="Back to the site">' + CHEV_L + '<span>Back</span></button>' +
                '<span class="pv__count" aria-live="polite"></span>' +
            '</div>' +
            '<figure class="pv__fig">' +
                '<img class="pv__img" alt="" decoding="async">' +
                '<figcaption class="pv__cap"><span class="pv__label"></span><strong class="pv__title"></strong><span class="pv__text"></span></figcaption>' +
            '</figure>' +
            '<button type="button" class="pv__nav pv__prev" aria-label="Previous">' + CHEV_L + '</button>' +
            '<button type="button" class="pv__nav pv__next" aria-label="Next">' + CHEV_R + '</button>';
        document.body.appendChild(viewer);

        imgEl = viewer.querySelector('.pv__img');
        labelEl = viewer.querySelector('.pv__label');
        titleEl = viewer.querySelector('.pv__title');
        capEl = viewer.querySelector('.pv__text');
        countEl = viewer.querySelector('.pv__count');

        viewer.querySelector('.pv__back').addEventListener('click', requestClose);
        viewer.querySelector('.pv__prev').addEventListener('click', function () { show(index - 1); });
        viewer.querySelector('.pv__next').addEventListener('click', function () { show(index + 1); });
        viewer.addEventListener('click', function (e) {
            if (e.target === viewer || e.target.classList.contains('pv__fig')) requestClose();
        });

        var sx = null, sy = 0;
        viewer.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
        viewer.addEventListener('touchend', function (e) {
            if (sx === null) return;
            var t = e.changedTouches[0], dx = (t.clientX || sx) - sx, dy = (t.clientY || sy) - sy;
            sx = null;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
        });

        document.addEventListener('keydown', function (e) {
            if (!open) return;
            if (e.key === 'Escape') requestClose();
            else if (e.key === 'ArrowRight') show(index + 1);
            else if (e.key === 'ArrowLeft') show(index - 1);
        });

        // the phone's back button / gesture closes the viewer instead of leaving the site
        window.addEventListener('popstate', function () { if (open) close(); });
    }

    function show(i) {
        if (!items.length) return;
        index = (i + items.length) % items.length;
        var d = group.info(items[index], index);
        imgEl.src = d.src;
        imgEl.alt = d.title;
        labelEl.textContent = d.label;
        titleEl.textContent = d.title;
        capEl.textContent = d.caption;
        capEl.hidden = !d.caption;
        countEl.textContent = (index + 1) + ' / ' + items.length;
        var multi = items.length > 1;
        viewer.querySelector('.pv__prev').hidden = !multi;
        viewer.querySelector('.pv__next').hidden = !multi;
        // warm up the neighbours so swiping feels instant
        [index + 1, index - 1].forEach(function (n) {
            var j = (n + items.length) % items.length, src = group.info(items[j], j).src;
            if (src) { var p = new Image(); p.src = src; }
        });
    }

    function openAt(g, el) {
        if (!viewer) build();
        group = g;
        items = Array.prototype.slice.call(document.querySelectorAll(g.container + ' > ' + g.item));
        if (!items.length) items = Array.prototype.slice.call(document.querySelectorAll(g.container + ' ' + g.item));
        lastFocus = document.activeElement;
        show(Math.max(0, items.indexOf(el)));
        viewer.hidden = false;
        requestAnimationFrame(function () { viewer.classList.add('pv--in'); });
        document.documentElement.classList.add('pv-open');
        open = true;
        history.pushState({ pv: true }, '');
        viewer.querySelector('.pv__back').focus({ preventScroll: true });
    }

    function requestClose() {
        if (history.state && history.state.pv) history.back();   // keeps the phone's back button in step
        else close();
    }

    function close() {
        open = false;
        viewer.classList.remove('pv--in');
        document.documentElement.classList.remove('pv-open');
        setTimeout(function () { if (!open) { viewer.hidden = true; imgEl.removeAttribute('src'); } }, 250);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    // ── how a piece gets opened ──────────────────────────────
    var coarse = window.matchMedia('(pointer: coarse)').matches;

    function setupGroup(g) {
        var box = document.querySelector(g.container);
        if (!box || box.__pv) return;
        box.__pv = true;
        var find = function (target) {
            var el = target.closest && target.closest(g.item);
            return el && box.contains(el) ? el : null;
        };

        // Instagram: replace the theme's own tap-to-expand with this viewer
        if (g.name === 'instagram') {
            box.addEventListener('click', function (e) {
                if (find(e.target)) { e.stopPropagation(); e.preventDefault(); }
                if (!coarse) { var el = find(e.target); if (el) openAt(g, el); }
            }, true);
        }

        if (coarse) {
            // double-tap: two taps on the same image within 350 ms, finger barely moving.
            // "capture" so it works even though the themes stop touches on some cards.
            var last = { t: 0, el: null, x: 0, y: 0 }, start = null, cur = null;
            box.addEventListener('touchstart', function (e) {
                start = { x: e.touches[0].clientX, y: e.touches[0].clientY, multi: e.touches.length > 1 };
                cur = { x: start.x, y: start.y };
            }, { passive: true, capture: true });
            box.addEventListener('touchmove', function (e) {
                if (e.touches[0]) cur = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                if (e.touches.length > 1 && start) start.multi = true;
            }, { passive: true, capture: true });
            box.addEventListener('touchend', function (e) {
                var el = find(e.target);
                if (!el || !start || start.multi) return;
                if (Math.hypot(cur.x - start.x, cur.y - start.y) > 12) { last.t = 0; return; }   // a scroll or swipe
                var now = Date.now();
                if (last.el === el && now - last.t < 350 && Math.hypot(cur.x - last.x, cur.y - last.y) < 40) {
                    if (e.cancelable) e.preventDefault();
                    last.t = 0;
                    openAt(g, el);
                } else {
                    last = { t: now, el: el, x: cur.x, y: cur.y };
                }
            }, { capture: true });
        } else if (g.name !== 'instagram') {
            // desktop click (ignore the end of a drag)
            var downX = 0, downY = 0;
            box.addEventListener('mousedown', function (e) { downX = e.clientX; downY = e.clientY; }, true);
            box.addEventListener('click', function (e) {
                if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
                var el = find(e.target);
                if (el) openAt(g, el);
            });
        }

        // keyboard: Enter on a focused piece
        box.querySelectorAll(g.item).forEach(function (el) {
            if (el.parentElement !== box && g.name !== 'marketing') return;
            el.tabIndex = 0;
            el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); openAt(g, el); } });
        });
    }

    function boot() { setTimeout(function () { GROUPS.forEach(setupGroup); }, 0); }   // after fx.js builds the layout
    if (window.contentLoaded) boot();
    document.addEventListener('content-loaded', boot);
}());
