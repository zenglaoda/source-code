var rawAsap = (function() {
    var BrowserMutationObserver = MutationObserver;
    // 最大容积
    var capacity = 1024;
    // 当前处理的任务的索引
    var index = 0;
    // 任务队列
    var queue = [];
    // 是否刷新中
    var flushing = false;
    // 刷新操作

    function flush() {
        if (!queue.length) {
            flushing = true;
        }
    }


    function makeRequestCallFromTimer(callback) {
        return function requestCall() {
            setTimeout(callback, 0);
        }
    }

    function makeRequestCallFromMutationObserver(callback) {
        var toggle = 1;
        var node = document.createTextNode('');
        var observer = new MutationObserver(callback);
        observer.observe(node, { characterData: true });
        return function requestCall() {
            toggle = -toggle;
            node.data = toggle;
        }
    }

    return function(task) {

    };
})();