// rt.js — Site Shield
// Blocks right-click and common copy/save keyboard shortcuts.
(function () {
    'use strict';

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

    // (The old "DevTools detection" was removed: it judged by window size,
    //  so anyone with a narrow or split-screen browser window got a blank
    //  page. It also couldn't stop anyone — the site's files are public.)

}());
