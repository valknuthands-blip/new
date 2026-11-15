// =============================================================
//  BOOT.JS — runs first, before the page is drawn
//  (c) 2026 Vivash Singh - All Rights Reserved
// =============================================================

// Don't let other sites show this page inside a frame (clickjacking).
// GitHub Pages can't send the header for this, so it's done here.
if (window.top !== window.self) {
    try { window.top.location = window.self.location.href; }
    catch (e) { document.documentElement.style.display = 'none'; }
}

// Pick dark/light background immediately so there's no white flash
!function(){var e=localStorage.getItem("vivash-theme"),t="dark"===e||!e&&window.matchMedia("(prefers-color-scheme:dark)").matches;document.documentElement.style.background=t?"#0a0a0a":"#f5f5f0",document.documentElement.style.colorScheme=t?"dark":"light"}();

// Show the page once the HTML is ready
document.addEventListener("DOMContentLoaded",function(){document.body.style.visibility="visible"});
