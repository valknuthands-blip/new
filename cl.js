// cl.js — Content Loader
// Fetches every section HTML from lib/ AT THE SAME TIME (they used to
// load one after another), then puts them on the page in order.
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

    // start every download right now, in parallel
    const downloads = sections.map(s =>
        fetch(s.file)
            .then(r => { if (!r.ok) throw new Error('Failed to load ' + s.file); return r.text(); })
            .catch(e => { console.error(e); return ''; })
    );

    function insertAll(htmls) {
        sections.forEach((s, i) => {
            const el = document.getElementById(s.id);
            if (el && htmls[i]) el.innerHTML = htmls[i];
        });
        window.contentLoaded = true;
        document.dispatchEvent(new Event('content-loaded'));
    }

    Promise.all(downloads).then(htmls => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => insertAll(htmls));
        } else {
            insertAll(htmls);
        }
    });

})();
