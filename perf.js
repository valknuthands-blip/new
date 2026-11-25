// =============================================================
//  PERF.JS — load heavy things only when they're about to be seen
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  • YouTube players: each one downloads ~1 MB of YouTube's own
//    code. They now start loading only when their section comes
//    near the screen (the autoplay previews still play).
//  • Instagram tiles: their images load a screen or two before you
//    reach them, in the size that fits the screen.
// =============================================================
(function () {
    'use strict';

    function whenNear(elements, onNear, margin) {
        if (!elements.length) return;
        if (!('IntersectionObserver' in window)) { elements.forEach(onNear); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { io.unobserve(e.target); onNear(e.target); }
            });
        }, { rootMargin: margin || '400px 0px' });
        elements.forEach(function (el) { io.observe(el); });
    }

    function init() {
        // YouTube iframes written as <iframe data-src="…">
        whenNear(Array.prototype.slice.call(document.querySelectorAll('iframe[data-src]')), function (f) {
            f.src = f.getAttribute('data-src');
            f.removeAttribute('data-src');
        }, '500px 0px');

        // Instagram tiles written as <div class="instagram-img-w" data-bg="…">
        // Each tile picks the smallest copy that is still sharp on this screen;
        // the blurred preview already in its style shows until it arrives.
        whenNear(Array.prototype.slice.call(document.querySelectorAll('[data-bg]')), function (el) {
            var full = el.getAttribute('data-bg');
            var need = (el.offsetWidth || 400) * Math.min(window.devicePixelRatio || 1, 2);
            var url = full;
            if (need <= 480 && el.getAttribute('data-bg-480')) url = el.getAttribute('data-bg-480');
            else if (need <= 800 && el.getAttribute('data-bg-800')) url = el.getAttribute('data-bg-800');
            el.setAttribute('data-full', full);            // the viewer always opens the full-size copy
            var pic = new Image();
            pic.onload = pic.onerror = function () { el.style.backgroundImage = "url('" + url + "')"; };
            pic.src = url;
            el.removeAttribute('data-bg');
        }, '1200px 0px');
    }

    if (window.contentLoaded) init();
    document.addEventListener('content-loaded', init);
}());
