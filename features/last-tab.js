var browser = document.body.querySelector('#browser');
var list = [];
function listTabs() {
    //getting tabs
    var tabs = browser.querySelectorAll('#tabs>.tab');
    list = [];
    for(var i = 0;i < tabs.length; i++){
        list.push(tabs[i]);
    }

    //Sort tabs to get last and pre-last
    list.sort(function(a,b){
        return recent(b) - recent(a);
    });
}

function recent(tab) {
    var page = document.querySelector('.webpageview webview[tab_id="'+tab.dataset.tabId+'"]');
    if(page) {
        page = page.parentNode.parentNode.parentNode.parentNode;
        return parseInt(page.style.zIndex);
    }
    return 0;
};

var dispatchMouseEvent = function(target, var_args) {
    var e = document.createEvent("MouseEvents");
    e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
};

browser.addEventListener('mousedown', function(e){
    for (var i = 0; i < e.path.length; i++) {
        if (e.path[i].className.indexOf('active') > -1) {
            var active = browser.querySelector('.tab.active');

            listTabs();
            dispatchMouseEvent(list[1], 'mousedown', true, true);
            break;
        }
    }
});
