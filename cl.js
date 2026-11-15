// cl.js — Content Loader
// Fetches each section HTML from lib/ and injects into the page.
(function () {

    const sections = [
        { id: 'home-section',        file: 'lib/b1e3.html' },
        { id: 'about-section',       file: 'lib/a4d7.html' },
        { id: 'logos-section',       file: 'lib/c2f1.html' },
        { id: 'photography-section', file: 'lib/e5a8.html' },
        { id: 'instagram-section',   file: 'lib/d3c6.html' },
        { id: 'animation-section',   file: 'lib/f9b2.html' },
        { id: 'marketing-section',   file: 'lib/g7e4.html' },
        { id: 'dev-section',         file: 'lib/h6f0.html' },
        { id: 'contact-section',     file: 'lib/i8d5.html' },
        { id: 'footer-section',      file: 'lib/j1a9.html' }
    ];

    async function loadAll() {
        for (const section of sections) {
            try {
                const response = await fetch(section.file);
                if (!response.ok) throw new Error('Failed to load ' + section.file);
                const html = await response.text();
                document.getElementById(section.id).innerHTML = html;
            } catch (e) {
                console.error(e);
            }
        }
        window.contentLoaded = true;
        document.dispatchEvent(new Event('content-loaded'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAll);
    } else {
        loadAll();
    }

})();
