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


    document.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; });

   
    document.addEventListener("selectstart", function (e) { e.preventDefault(); return false; });


    document.addEventListener("dragstart", function (e) { e.preventDefault(); return false; });


    document.addEventListener("keydown", function (e) {
        var k = e.keyCode || e.which;
        if (k === 123) { e.preventDefault(); return false; } 
        if (e.ctrlKey && e.shiftKey && [73,74,67,75].indexOf(k) > -1) { e.preventDefault(); return false; }
        if (e.ctrlKey && (k === 85 || k === 83)) { e.preventDefault(); return false; }
        if (e.metaKey && e.altKey && k === 73) { e.preventDefault(); return false; }
    });
    window.addEventListener("load", function () {
        var panelOpen = false;
        setInterval(function () {
            var wDiff = window.outerWidth - window.innerWidth;
            var hDiff = window.outerHeight - window.innerHeight;
            if (wDiff > 200 || hDiff > 200) {
                if (!panelOpen) { panelOpen = true; wipe(); }
            } else { panelOpen = false; }
        }, 1000);


        setTimeout(function () {
            var fired = false;
            var img = new Image();
            Object.defineProperty(img, "id", {
                get: function () { if (!fired) { fired = true; wipe(); } }
            });
            console.log(img);
        }, 6000);

        var base = document.scripts.length;
        setInterval(function () {
            if (document.scripts.length > base + 5) { wipe(); }
        }, 3000);
    });

})();
