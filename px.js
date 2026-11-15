// px.js — Image & Content Protection
// Locks all images against drag, right-click, and direct navigation.
(function () {
    'use strict';

    // Stamp copyright meta in DOM
    function stampCopyright() {
        if (!document.querySelector('meta[name="copyright"]')) {
            const m = document.createElement('meta');
            m.name    = 'copyright';
            m.content = '© 2026 Vivash Singh. All Rights Reserved.';
            document.head.appendChild(m);
        }
    }
    stampCopyright();

    // Lock all images
    function lockImages() {
        document.querySelectorAll('img').forEach(function (img) {
            img.setAttribute('draggable', 'false');
            img.style.userSelect      = 'none';
            img.style.webkitUserDrag  = 'none';
            img.style.pointerEvents   = 'none';

            const wrap = img.parentElement;
            if (wrap && !wrap.getAttribute('data-protected')) {
                // Skip .image-container spans (3D cube faces) — adding overlay breaks the transform
                const isCubeFace = wrap.tagName === 'SPAN' && wrap.closest && wrap.closest('.image-container');
                if (!isCubeFace) {
                    wrap.style.position = wrap.style.position || 'relative';
                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position:absolute;inset:0;z-index:10;pointer-events:all;user-select:none;-webkit-user-select:none;';
                    overlay.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; });
                    overlay.addEventListener('dragstart',   (e) => { e.preventDefault(); return false; });
                }
                wrap.setAttribute('data-protected', '1');
            }
        });
    }

    // Block copy / cut / selectstart
    document.addEventListener('copy',        (e) => { e.preventDefault(); return false; });
    document.addEventListener('cut',         (e) => { e.preventDefault(); return false; });
    document.addEventListener('selectstart', (e) => { e.preventDefault(); return false; });

    // Intercept PrintScreen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            e.preventDefault();
            setTimeout(() => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText('').catch(() => {});
                }
            }, 300);
        }
    });

    // Block image clicks from navigating to full-screen
    document.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') { e.preventDefault(); e.stopPropagation(); return false; }
        const a = e.target.closest('a');
        if (a && a.querySelector('img')) { e.preventDefault(); e.stopPropagation(); return false; }
    }, { capture: true });

    document.addEventListener('contextmenu', function (e) {
        if (e.target.tagName === 'IMG') { e.preventDefault(); return false; }
    }, { capture: true });

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', lockImages);
    } else {
        lockImages();
    }

    // Re-run on dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => { if (m.addedNodes.length) lockImages(); });
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

}());
