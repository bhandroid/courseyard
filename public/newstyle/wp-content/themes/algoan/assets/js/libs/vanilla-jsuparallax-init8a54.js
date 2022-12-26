
jQuery(document).ready(function($) {
    new vanillaJsuParallax({
        items: document.querySelectorAll('.has-vanilla-jsuparallax'),
        minViewportWidth: 768
    });
    new vanillaJsuParallax({
        items: document.querySelectorAll('.has-vanilla-jsuparallax-resp')
    });
});
