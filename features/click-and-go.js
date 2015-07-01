// Right click and go
var browser=document.body.querySelector('#browser');
var isItMouse = false;

var hiddenInput = document.createElement("input");
hiddenInput.type = "text";
browser.appendChild(hiddenInput);
hiddenInput.style.width = "0px";
hiddenInput.style.height = "0px";
hiddenInput.style.display = "none";

var dispatchMouseEvent = function(target, var_args) {
    var e = document.createEvent("MouseEvents");
    e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
};


browser.addEventListener('contextmenu',function(e) {
    for (var i = 0; i < e.path.length; i++) {
        if (e.target.className.toString().indexOf('newtab') > -1) {
            isItMouse = true;
            document.execCommand('paste');
            return;
        }
        if (e.target.parentNode.parentNode.className.indexOf('newtab') > -1) {
            isItMouse = true;
            hiddenInput.style.display = "block";
            hiddenInput.focus();
            document.execCommand('paste');
            return;
        }
        if (e.target.getTotalLength() > 0) { // 104 — length of new tab Button SVG
            isItMouse = true;
            hiddenInput.style.display = "block";
            hiddenInput.focus();
            dispatchMouseEvent(document.body.querySelector('.button-tabbar.newtab'), 'contextmenu', true, true);
            //document.execCommand('paste');
            return;
        }
    }
});

document.addEventListener('paste',function(e) {
    if (isItMouse) {
        isItMouse = false;
        var url = e.clipboardData.getData('text/plain');
        hiddenInput.style.display = "none";

        var re = new RegExp('\\r\\n', 'g'); // Delete newline characters
        url = url.replace(re, '');

    //	var searchEngine = 'https://google.com/webhp?hl=ru#hl=ru&q='; // Search engine
    //	var searchEngine = 'http://yandex.ru/search/?text=';
        var searchEngine = 'https://duckduckgo.com/?q=';
        var active = browser.querySelector('.tab.active');
        var webview = document.querySelector('#webview-container webview[tab_id="'+active.dataset.tabId+'"]');
        
        if (url.length > 0) {
            if (checkUrl(url)) {
                webview.executeScript({ code: "window.open('"+url+"','_blank')" });
            } else if (checkUrlWithoutProtocol(url)) {
                webview.executeScript({ code: "window.open('http://"+url+"','_blank')" });
            } else {
                webview.executeScript({ code: "window.open('"+searchEngine+url+"','_blank')" });
            }
        }
        
        console.log(url)}
    }
);

function checkUrl(str) {
  var pattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?/#]\S*)?$/i;
  return pattern.test(str);
}

function checkUrlWithoutProtocol(s) {    
      var regexp = /^(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,3})).?)(?::\d{2,5})?(?:[/?/#]\S*)?$/i;
      return regexp.test(s);    
}
