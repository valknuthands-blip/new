// =============================================================
//  LOGOS.JS — swipeable, pausable logo strip
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  • The logo rows still glide on their own (row 2 the other way).
//  • Swipe / drag left or right to move them yourself (with momentum).
//  • Touch and hold to freeze a row and look at a logo; it carries
//    on by itself a couple of seconds after you let go.
//  • Hovering with a mouse also pauses it.
//  • Up/down swipes still scroll the page normally.
//  • Stops running when the logos are off-screen (saves battery).
// =============================================================
(function () {
    'use strict';

    var SECONDS_PER_LOOP = 60;   // auto speed: one full loop every 60 s (same as before)
    var RESUME_AFTER = 2500;     // ms to stay paused after you let go
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setupRow(row) {
        if (row.__logoRow) return;
        row.__logoRow = true;
        row.classList.add('logo-js');   // turns off the old CSS animation

        var groups = Array.prototype.slice.call(row.querySelectorAll('.marquee__group'));
        if (!groups.length) return;
        var dir = row.classList.contains('marquee--reverse') ? 1 : -1;  // -1 = moving left
        var x = 0, period = 1, autoSpeed = 0;
        var pausedUntil = 0, hovering = false, holding = false;
        var dragging = false, startX = 0, startY = 0, lastX = 0, lastT = 0, fling = 0;
        var visible = false, raf = null, prevT = 0;

        function measure() {
            var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
            period = groups[0].getBoundingClientRect().width + gap || 1;
            autoSpeed = period / SECONDS_PER_LOOP;   // px per second
        }

        function apply() {
            // keep x within one loop so it repeats seamlessly in both directions
            x = x - period * Math.floor(x / period) - period;
            var t = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
            for (var i = 0; i < groups.length; i++) groups[i].style.transform = t;
        }

        function frame(now) {
            raf = null;
            var dt = Math.min(0.05, (now - (prevT || now)) / 1000);
            prevT = now;
            if (!dragging) {
                if (Math.abs(fling) > 5) {
                    // momentum after a swipe, slowing down
                    x += fling * dt;
                    fling *= Math.pow(0.04, dt);
                } else {
                    fling = 0;
                    var paused = holding || hovering || now < pausedUntil || reduceMotion;
                    if (!paused) x += dir * autoSpeed * dt;
                }
            }
            apply();
            if (visible) raf = requestAnimationFrame(frame);
        }

        function start() { if (!raf) { prevT = 0; raf = requestAnimationFrame(frame); } }

        // ── Touch / mouse ─────────────────────────────────────
        row.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            holding = true; dragging = false; fling = 0;
            startX = lastX = e.clientX; startY = e.clientY; lastT = performance.now();
        });
        row.addEventListener('pointermove', function (e) {
            if (!holding) return;
            var dx = e.clientX - startX, dy = e.clientY - startY;
            if (!dragging && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
                dragging = true;
                row.classList.add('logo-dragging');
                // touch already captures the finger automatically; mouse needs it explicitly
                if (e.pointerType === 'mouse') { try { row.setPointerCapture(e.pointerId); } catch (err) {} }
            }
            if (dragging) {
                var now = performance.now();
                var step = e.clientX - lastX;
                x += step;
                fling = step / Math.max(1, now - lastT) * 1000;   // px per second
                lastX = e.clientX; lastT = now;
                apply();
            }
        });
        function release() {
            if (!holding) return;
            holding = false;
            if (dragging) {
                dragging = false;
                row.classList.remove('logo-dragging');
                if (performance.now() - lastT > 80) fling = 0;   // finger stopped before lifting
            }
            pausedUntil = performance.now() + RESUME_AFTER;
        }
        row.addEventListener('pointerup', release);
        row.addEventListener('pointercancel', release);   // e.g. the page started scrolling
        row.addEventListener('mouseenter', function () { hovering = true; });
        row.addEventListener('mouseleave', function () { hovering = false; release(); });
        // stop the browser from treating a drag as "drag this image"
        row.addEventListener('dragstart', function (e) { e.preventDefault(); });

        // ── Only run while on screen ──────────────────────────
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                visible = entries[0].isIntersecting;
                if (visible) start();
            }, { rootMargin: '100px 0px' }).observe(row);
        } else { visible = true; start(); }

        window.addEventListener('resize', function () { measure(); apply(); });
        measure();
        x = dir > 0 ? -period * 0.35 : 0;   // offset row 2 so the rows don't line up
        apply();
    }

    function init() {
        document.querySelectorAll('.logo-section .marquee').forEach(setupRow);
    }

    if (window.contentLoaded) init();
    document.addEventListener('content-loaded', init);
    // theme switch swaps the CSS — re-measure once it's in
    document.addEventListener('theme-ready', function () {
        setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
    });
}());
