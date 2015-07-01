// Click on active tab to scroll top
var browser=document.body.querySelector('#browser');
browser.addEventListener('click', function(e){
    for (var i = 0; i < e.path.length; i++) {
        if (e.path[i].className.indexOf('active') > -1) {
            var active = browser.querySelector('.tab.active');
            var webview = document.querySelector('#webview-container webview[tab_id="'+active.dataset.tabId+'"]');
            webview.executeScript({ code: "document.body.scrollTop=0" });
            return;
        }
    }
});
