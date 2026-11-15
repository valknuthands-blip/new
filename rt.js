// rt.js — Site Shield
// Blocks right-click, keyboard shortcuts, and detects DevTools.
(function () {
    'use strict';

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Wipe the page (DevTools detected)
    function wipe() {
        try {
            document.documentElement.style.opacity = '0';
            document.body.innerHTML = '';
            window.location.replace('about:blank');
        } catch (e) {}
    }

    // Block right-click
    document.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; });

    // Block select-all
    document.addEventListener('selectstart', (e) => { e.preventDefault(); return false; });

    // Block drag
    document.addEventListener('dragstart', (e) => { e.preventDefault(); });

    // Block keyboard shortcuts (Ctrl/Cmd + U, S, A, C, P, Shift+I/J/C)
    document.addEventListener('keydown', (e) => {
        const ctrl = e.ctrlKey || e.metaKey;
        if (ctrl && ['u','s','a','c','p'].includes(e.key.toLowerCase())) {
            e.preventDefault(); return false;
        }
        if (ctrl && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase())) {
            e.preventDefault(); return false;
        }
        if (e.key === 'F12') { e.preventDefault(); return false; }
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            e.preventDefault();
            setTimeout(() => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText('').catch(() => {});
                }
            }, 300);
        }
    });

    if (!isMobile) {
        // DevTools detection via window size ratio
        // When DevTools docked: outer stays large, inner shrinks significantly.
        // Small window: both outer and inner shrink together.
        // Only wipe when outer >= 800px but inner drops below 65% — DevTools signature.
        setInterval(function () {
            const ow = window.outerWidth;
            const oh = window.outerHeight;
            const iw = window.innerWidth;
            const ih = window.innerHeight;
            if (ow >= 800 && (iw / ow) < 0.65) { wipe(); return; }
            if (oh >= 600 && (ih / oh) < 0.65) { wipe(); }
        }, 500);

        // Re-check on theme-ready
        document.addEventListener('theme-ready', () => {
            setTimeout(() => {
                const ow = window.outerWidth;
                const iw = window.innerWidth;
                if (ow >= 800 && (iw / ow) < 0.65) wipe();
            }, 3000);
        });
    }

}());
