// =============================================================
//  PERF.JS — load heavy things only when they're about to be seen
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  • YouTube players: each one downloads ~1 MB of YouTube's own
//    code. They now start loading only when their section comes
//    near the screen (the autoplay previews still play).
//  • Instagram tiles: their images load when you scroll near them.
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
        whenNear(Array.prototype.slice.call(document.querySelectorAll('[data-bg]')), function (el) {
            el.style.backgroundImage = "url('" + el.getAttribute('data-bg') + "')";
            el.removeAttribute('data-bg');
        });
    }

    if (window.contentLoaded) init();
    document.addEventListener('content-loaded', init);
}());
