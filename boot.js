// =============================================================
//  BOOT.JS — runs first, before the page is drawn
//  (c) 2026 Vivash Singh - All Rights Reserved
// =============================================================

// Pick dark/light background immediately so there's no white flash
!function(){var e=null;try{e=localStorage.getItem("vivash-theme")}catch(x){}var t="dark"===e||!e&&window.matchMedia("(prefers-color-scheme:dark)").matches;document.documentElement.style.background=t?"#0a0a0a":"#f5f5f0",document.documentElement.style.colorScheme=t?"dark":"light"}();

// Show the page once the HTML is ready
document.addEventListener("DOMContentLoaded",function(){document.body.style.visibility="visible"});

// ── Speed: start the big downloads immediately ───────────────
// The theme's CSS/JS and the section files used to wait for each
// other. Asking for them here, in the first moment of loading,
// means they're already downloaded by the time they're needed.
(function () {
    var saved = null;
    try { saved = localStorage.getItem('vivash-theme'); } catch (e) {}
    var dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var theme = dark ? 'dist/d2f8a1' : 'dist/f4c9b3';
    function preload(href, as, cors) {
        var l = document.createElement('link');
        l.rel = 'preload'; l.href = href; l.as = as;
        if (cors) l.crossOrigin = 'anonymous';
        document.head.appendChild(l);
    }
    preload(theme + '.css', 'style');
    preload(theme + '.js', 'script');
    ['b1e3', 'a4d7', 'c2f1', 'e5a8', 'd3c6', 'f9b2', 'g7e4', 'h6f0', 'i8d5', 'j1a9'].forEach(function (f) {
        preload('lib/' + f + '.html', 'fetch', true);
    });

    // Google Fonts without holding up the first paint
    var fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&family=Space+Mono:wght@400;700&display=swap';
    document.head.appendChild(fonts);
}());
