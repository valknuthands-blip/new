// =============================================================
//  CONTACT.JS — Contact form helpers
//  (c) 2026 Vivash Singh - All Rights Reserved
//
//  This code used to sit inside lib/i8d5.html, but scripts inside
//  HTML that is loaded with innerHTML never run — so it never
//  worked. It lives here now and runs once the sections load.
// =============================================================
(function () {
    'use strict';

    // Show the extra photography fields when "Photography" is picked
    document.addEventListener('change', function (e) {
        var radio = e.target;
        if (!radio.matches || !radio.matches('.project-type-chip input[type="radio"]')) return;
        var isPhoto = radio.value === 'Photography';
        var photoFields = document.getElementById('photographyFields');
        var visionLabel = document.getElementById('visionLabel');
        if (photoFields) photoFields.style.display = isPhoto ? 'block' : 'none';
        if (visionLabel) {
            visionLabel.textContent = isPhoto ? 'Additional Details / Custom Brief' : 'Project Vision / Brief';
        }
    });

    // When the pricing drawer opens on a phone, scroll it into view
    document.addEventListener('click', function (e) {
        var toggle = e.target.closest && e.target.closest('#pricingToggle');
        if (!toggle) return;
        setTimeout(function () {
            if (toggle.classList.contains('open')) {
                toggle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    });
}());
