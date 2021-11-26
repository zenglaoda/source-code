(window.lib = window.lib || {}).utils = (function() {
    function loadStyle(cssText) {
        const style = document.createElement('style');
        style.innerHTML = cssText;
        document.head.appendChild(style);
    }
    return {
        loadStyle
    };
})();