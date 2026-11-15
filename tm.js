// tm.js — Theme Manager
// Handles dark/light theme switching, loading the correct CSS and JS.
(function () {

    const STORAGE_KEY = 'vivash-theme';
    const toggleBtn   = document.getElementById('theme-toggle');
    const sunIcon     = toggleBtn ? toggleBtn.querySelector('.theme-icon-sun')  : null;
    const moonIcon    = toggleBtn ? toggleBtn.querySelector('.theme-icon-moon') : null;

    const themes = {
        dark:  { css: 'dist/d2f8a1.css', js: 'dist/d2f8a1.js' },
        light: { css: 'dist/f4c9b3.css', js: 'dist/f4c9b3.js' }
    };

    const saved        = localStorage.getItem(STORAGE_KEY);
    const prefersDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let   currentTheme = saved || (prefersDark ? 'dark' : 'light');

    let currentLink   = null;
    let currentScript = null;
    let overlay       = null;

    // ── Overlay helpers ──────────────────────────────────────────────
    function hideOverlay() {
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }
    }

    // ── Load a theme ─────────────────────────────────────────────────
    function applyTheme(name, animate) {
        const config = themes[name];
        if (!config) return;

        // Set background immediately to avoid flash
        const bg = name === 'dark' ? '#0a0a0a' : '#f5f5f0';
        document.documentElement.style.background = bg;
        if (document.body) document.body.style.background = bg;

        if (animate) {
            const cb = () => loadThemeFiles(name, config, true);
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;opacity:0;transition:opacity 0.15s ease;pointer-events:none;will-change:opacity;';
                document.body.appendChild(overlay);
            }
            overlay.style.background = currentTheme === 'dark' ? '#0a0a0a' : '#f5f5f0';
            overlay.style.pointerEvents = 'all';
            overlay.getBoundingClientRect(); // force reflow
            overlay.style.opacity = '1';
            setTimeout(cb, 120);
        } else {
            loadThemeFiles(name, config, false);
        }
    }

    function loadThemeFiles(name, config, wasAnimated) {
        // Destroy previous theme
        if (currentScript && window.__currentTheme && window.__currentTheme.destroy) {
            try { window.__currentTheme.destroy(); } catch (e) {}
        }
        if (currentLink)   currentLink.remove();
        if (currentScript) currentScript.remove();
        window.__currentTheme = null;

        // Load CSS
        const link = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = config.css;
        document.head.appendChild(link);
        currentLink = link;

        const loadScript = () => {
            const script = document.createElement('script');
            script.src = config.js;
            script.onload = () => {
                if (window.__currentTheme && window.__currentTheme.init) {
                    try { window.__currentTheme.init(); } catch (e) {}
                }
                document.dispatchEvent(new Event('theme-ready'));
                if (wasAnimated) {
                    requestAnimationFrame(() => requestAnimationFrame(hideOverlay));
                }
                // Prefetch the other theme's CSS
                const otherCss = themes[name === 'dark' ? 'light' : 'dark'].css;
                if (!document.querySelector(`link[rel="prefetch"][href="${otherCss}"]`)) {
                    const pre = document.createElement('link');
                    pre.rel = 'prefetch';
                    pre.as  = 'style';
                    pre.href = otherCss;
                    document.head.appendChild(pre);
                }
            };
            script.onerror = () => {
                document.dispatchEvent(new Event('theme-ready'));
                if (wasAnimated) hideOverlay();
            };
            document.body.appendChild(script);
            currentScript = script;
        };

        // Wait for CSS before injecting script
        if (link.sheet) {
            loadScript();
        } else {
            link.addEventListener('load',  loadScript);
            link.addEventListener('error', () => {
                document.dispatchEvent(new Event('theme-ready'));
                if (wasAnimated) hideOverlay();
            });
        }

        // Update icon + toggle class
        if (sunIcon && moonIcon) {
            if (name === 'dark') {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            }
        }

        localStorage.setItem(STORAGE_KEY, name);
        currentTheme = name;
    }

    // ── Toggle button ────────────────────────────────────────────────
    let userHasToggled = !!saved;
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            userHasToggled = true;
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
        });
    }

    // ── System preference change ─────────────────────────────────────
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!userHasToggled) applyTheme(e.matches ? 'dark' : 'light', true);
    });

    // ── Boot: wait for content then load theme ───────────────────────
    if (window.contentLoaded) {
        applyTheme(currentTheme, false);
    } else {
        document.addEventListener('content-loaded', () => applyTheme(currentTheme, false));
    }

}());
