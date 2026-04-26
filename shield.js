// (c) 2026 Vivash Singh - All Rights Reserved
(function () {
    "use strict";

    function wipe() {
        try {
            document.documentElement.style.opacity = "0";
            document.body.innerHTML = "";
            window.location.replace("about:blank");
        } catch (e) {}
    }

    // 1. Right-click disabled
    document.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; });

    // 2. Text selection disabled
    document.addEventListener("selectstart", function (e) { e.preventDefault(); return false; });

    // 3. Image drag disabled
    document.addEventListener("dragstart", function (e) { e.preventDefault(); return false; });

    // 4. Keyboard shortcuts blocked
    document.addEventListener("keydown", function (e) {
        var k = e.keyCode || e.which;
        if (k === 123) { e.preventDefault(); return false; } // F12
        if (e.ctrlKey && e.shiftKey && [73,74,67,75].indexOf(k) > -1) { e.preventDefault(); return false; }
        if (e.ctrlKey && (k === 85 || k === 83)) { e.preventDefault(); return false; }
        if (e.metaKey && e.altKey && k === 73) { e.preventDefault(); return false; }
    });

    // 5. DevTools window size detection — runs after page fully loaded
    window.addEventListener("load", function () {
        var panelOpen = false;
        setInterval(function () {
            var wDiff = window.outerWidth - window.innerWidth;
            var hDiff = window.outerHeight - window.innerHeight;
            if (wDiff > 200 || hDiff > 200) {
                if (!panelOpen) { panelOpen = true; wipe(); }
            } else { panelOpen = false; }
        }, 1000);

        // 6. Console image trap — runs 6s after load
        setTimeout(function () {
            var fired = false;
            var img = new Image();
            Object.defineProperty(img, "id", {
                get: function () { if (!fired) { fired = true; wipe(); } }
            });
            console.log(img);
        }, 6000);

        // 7. Script count monitor
        var base = document.scripts.length;
        setInterval(function () {
            if (document.scripts.length > base + 5) { wipe(); }
        }, 3000);
    });

})();
