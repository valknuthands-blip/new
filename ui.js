// =============================================================
//  UI.JS — loading screen, mobile bottom nav, theme toggle sync,
//  back-to-top, scroll hint and the animated nav brand.
//  (moved out of index.html so the security policy can block
//   any script that isn't one of the site's own files)
//  (c) 2026 Vivash Singh - All Rights Reserved
// =============================================================
// ── LOADING SCREEN ──────────────────────────────────────────────
// Stays up until the page is really ready to look at:
//   1. all sections are on the page        (content-loaded)
//   2. the theme's styles and scripts ran  (theme-ready)
//   3. fonts are loaded, every image on the first screen is fully
//      decoded, and the background animation has drawn its first frame
// It never waits forever: at most ~7 s, and the CSS safety net in
// index.html shows the page after 9 s even if a script fails.
(function () {
    var screen = document.getElementById('loading-screen');
    var bar = document.getElementById('loading-bar');
    var pct = 0, revealed = false, waiting = false, content = false, theme = false;
    var started = Date.now();

    function progress(p) { pct = Math.max(pct, Math.min(100, p)); if (bar) bar.style.width = pct + '%'; }
    progress(8);
    [[400, 20], [900, 38], [1500, 55], [2000, 72], [2500, 85]].forEach(function (s) { setTimeout(function () { progress(s[1]); }, s[0]); });

    function timeout(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function frames(n) { return new Promise(function (r) { (function f() { if (n-- <= 0) r(); else requestAnimationFrame(f); })(); }); }

    function visualsReady() {
        var jobs = [];
        if (document.fonts && document.fonts.ready) jobs.push(document.fonts.ready);
        // every image that will be visible on the first screen
        Array.prototype.forEach.call(document.images, function (img) {
            var r = img.getBoundingClientRect();
            if (r.width && r.bottom > 0 && r.top < window.innerHeight) {
                img.loading = 'eager';
                jobs.push(img.decode ? img.decode().catch(function () {}) :
                    new Promise(function (res) { if (img.complete) res(); else { img.onload = img.onerror = res; } }));
            }
        });
        jobs.push(frames(3));   // let the background animation draw
        return Promise.race([Promise.all(jobs), timeout(3500)]);
    }

    function reveal() {
        if (revealed) return;
        revealed = true;
        progress(100);
        var wait = Math.max(0, 450 - (Date.now() - started));
        setTimeout(function () {
            document.body.classList.add('loaded');
            setTimeout(function () {
                if (!screen) return;
                screen.classList.add('hide');
                setTimeout(function () { screen.style.display = 'none'; }, 900);
            }, 200);
        }, wait);
    }

    function check() {
        if (waiting || !content || !theme) return;
        waiting = true;
        progress(94);
        visualsReady().then(reveal, reveal);
    }

    document.addEventListener('content-loaded', function () { content = true; progress(90); check(); });
    document.addEventListener('theme-ready', function () { theme = true; check(); });
    setTimeout(function () { content = true; theme = true; check(); }, 6000);
    setTimeout(reveal, 8000);
}());

!function(){if(window.innerWidth>767)return;const e=document.getElementById("mobile-more-btn"),t=document.getElementById("mobile-more-menu"),o=document.querySelectorAll(".mobile-nav-item[data-section]"),n=[{key:"contact",id:"contact"},{key:"gallery",id:"marketing"},{key:"work",id:"animation"},{key:"about",id:"about"},{key:"home",id:"home"}];function s(e){o.forEach(t=>{t.classList.toggle("active",t.dataset.section===e)})}function i(){const e=window.scrollY+window.innerHeight/3;for(const t of n){const o=document.getElementById(t.id);if(o&&o.offsetTop<=e)return void s(t.key)}s("home")}window.addEventListener("scroll",i,{passive:!0}),document.addEventListener("content-loaded",()=>{setTimeout(i,100)}),e&&t&&(e.addEventListener("click",o=>{o.stopPropagation();const n=t.classList.contains("show");t.classList.toggle("show",!n),e.setAttribute("aria-expanded",(!n).toString()),e.classList.toggle("active",!n)}),document.addEventListener("click",()=>{t.classList.remove("show"),e.setAttribute("aria-expanded","false"),e.classList.remove("active")}),t.querySelectorAll(".mobile-more-item").forEach(o=>{o.addEventListener("click",()=>{t.classList.remove("show"),e.setAttribute("aria-expanded","false"),e.classList.remove("active")})}))}(),function(){const e=document.getElementById("mobile-theme-toggle"),t=document.getElementById("theme-toggle"),o=document.getElementById("mobile-bottom-nav"),n=document.getElementById("mobile-more-menu");function s(t){e&&("light"===t?(e.classList.add("light-toggle"),e.classList.remove("dark-toggle"),o&&(o.classList.add("light-nav"),o.classList.remove("dark-nav")),n&&(n.classList.add("light-more"),n.classList.remove("dark-more"))):(e.classList.add("dark-toggle"),e.classList.remove("light-toggle"),o&&(o.classList.add("dark-nav"),o.classList.remove("light-nav")),n&&(n.classList.add("dark-more"),n.classList.remove("light-more"))))}s((function(){try{return localStorage.getItem("vivash-theme")}catch(x){return null}})()||"dark"),e&&t&&e.addEventListener("click",()=>{t.click(),setTimeout(()=>s((function(){try{return localStorage.getItem("vivash-theme")}catch(x){return null}})()||"dark"),60)}),t&&t.addEventListener("click",()=>{setTimeout(()=>s((function(){try{return localStorage.getItem("vivash-theme")}catch(x){return null}})()||"dark"),60)})}(),function(){const e=document.getElementById("back-to-top");!e||window.innerWidth>767||(e.style.display="flex",window.addEventListener("scroll",()=>{window.scrollY>600?(e.style.opacity="1",e.style.pointerEvents="auto"):(e.style.opacity="0",e.style.pointerEvents="none")},{passive:!0}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}(),function(){const e=document.getElementById("mobile-scroll-arrow");!e||window.innerWidth>768||(setTimeout(()=>e.classList.add("visible"),2500),e.addEventListener("click",()=>{const t=document.getElementById("about")||document.getElementById("about-section")||document.querySelector(".portfolio-section, section");t&&t.scrollIntoView({behavior:"smooth"}),e.classList.remove("visible")}),window.addEventListener("scroll",()=>{window.scrollY>100&&e.classList.remove("visible")},{passive:!0,once:!0}))}(),function(){const e=["ingh","tudio"];let t=0;const o=document.querySelector(".nav-brand-suffix-wrap");if(!o)return;function n(e){return o.innerHTML="",e.split("").map(e=>{const t=document.createElement("span");return t.className="nav-brand-char",t.textContent=e,o.appendChild(t),t})}n(e[0]).forEach((e,t)=>{setTimeout(()=>{e.classList.add("char-active")},60*t)}),setInterval(()=>{const s=(t+1)%e.length;!function(e,t){Math.max(e.length,t.length);o.querySelectorAll(".nav-brand-char").forEach((e,t)=>{setTimeout(()=>{e.classList.add("char-out")},0+60*t)});const s=0+60*e.length+200;setTimeout(()=>{const e=n(t);e.forEach(e=>e.classList.add("char-in")),e.forEach((e,t)=>{setTimeout(()=>{e.classList.remove("char-in"),e.classList.add("char-active")},60*t)})},s)}(e[t],e[s]),t=s},3e3)}(),[".scroll-down",".hero-arrow",".down-arrow",".scroll-btn",".scroll-button","#scroll-down","#hero-arrow","#down-arrow"].forEach(e=>{const t=document.querySelector(e);t&&t.remove()});
