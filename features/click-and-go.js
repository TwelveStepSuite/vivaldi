// Right click on plus-button to paste and go
var browser=document.body.querySelector('#browser');
var isItMouse = false; // Exclude responses from keyboard

//Tweak for paste in this input-field
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

browser.addEventListener('contextmenu', function(e) {
    //Area near square
    if (e.target.className.toString().indexOf('newtab') > -1) {
        isItMouse = true;
        document.execCommand('paste');
        return;
    }
    //Plus-symbol
    if (e.target.parentNode.parentNode.className.indexOf('newtab') > -1) {
        initPaste();
        return;
    }
    //Square
    if (e.target.getTotalLength() > 0) { // 104 — length of new tab Button SVG
        initPaste();
        return;
    }
});

function initPaste() {
    isItMouse = true;
    hiddenInput.style.display = "block";
    hiddenInput.focus();
    document.execCommand('paste');
}

document.addEventListener('paste',function(e) {
    if (isItMouse) {
        isItMouse = false;
        var url = e.clipboardData.getData('text/plain');
        hiddenInput.style.display = "none"; //hide input-field for pasting

        var re = new RegExp('\\r\\n', 'g'); // Delete newline characters
        url = url.replace(re, '');
        // Search engines
    //	var searchEngine = 'https://google.com/webhp?hl=ru#hl=ru&q='; 
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
//Is it url?
var patternUrl = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?/#]\S*)?$/i;
var patternUrlWithout = /^(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,3})).?)(?::\d{2,5})?(?:[/?/#]\S*)?$/i;
function checkUrl(str) {
    return patternUrl.test(str);
}
//Is it url without protocol?
function checkUrlWithoutProtocol(str) {    
    return patternUrlWithout.test(str);    
}
