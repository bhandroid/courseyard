jQuery(document).ready(function($) {
    document.querySelectorAll("[data-vawjs-anim]").forEach(function(el) {
        new vanillaAnimateWords(el, {
            delay: 0.1,
            triggerReady: function(el) {}
        });
    });
    document.querySelectorAll(".will-scrollanim [data-vawjs-anim]").forEach(function(el) {
        var $targetEvent = el;
        if (el.parentNode.getAttribute('data-hasscrollanim')) {
            $targetEvent = el.parentNode;
        }
        $targetEvent.addEventListener('activescrollanim', function() {
            el.setAttribute('data-vawjs-ready', '1');
        });
    });
});
