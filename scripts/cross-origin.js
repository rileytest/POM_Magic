/*!
  * POM Magic Created&designed by Leiping and Developed by Lanhongdong,tested by Leiping&lanhongdong
 * leiping3333@163.com lanhongdong@126.com
 * Leiping and Lanhongdong reserve all copy right of POM Magic
 *
 * Date: 2017-09-19 T21:10Z
 */

var crossElements = [];
var currentHighlightResult;

window.addEventListener('message', function(event) {
    if(event.data.topic == 'cross-origin-getElements') {
        let targetOrigin = event.origin,
            selector = event.data.selector,
            x1 = event.data.left,
            y1 = event.data.top,
            x2 = event.data.right,
            y2 = event.data.down,
            iframePaths = event.data.iframePath,
            resultElements = [],
            resultJson = '';
        
        rectangleSelect(selector, document, x1, y1, x2, y2, iframePaths, crossElements);
        
        resultJson = JSON.stringify(crossElements);
        var request = {
            'topic': 'cross-origin-result',
            'elements': resultJson
        };
        chrome.extension.sendMessage(request);
        crossElements = [];
    }
    
    if(event.data.topic == 'cross-origin-highLight') {
        let xpathStr = event.data.xpathStr,
            cssStr = event.data.cssStr,
            relativeXpathStr = event.data.relativeXpathStr,
            iframePath = event.data.iframePath;
        
        crossHighLight(document, iframePath, xpathStr, cssStr, relativeXpathStr);
    }
    
    if(event.data.topic == 'cross-origin-highLight-clear') {
        let highlightResult = currentHighlightResult,
            el = $(highlightResult, document)[0];
        if(! ( el && el.hasAttribute("style"))) return;
        el.style.cssText = highlightOldStyle;
    }
}, false);

function crossHighLight(contentDocument, elementFrameId, xpathStr, cssStr, relativeXpathStr) {
    try {
        hihglightContent = contentDocument;
        elementFrameId = elementFrameId.toString();
        if(elementFrameId){
            var iframes = elementFrameId.split("/");
            var iframeContent = hihglightContent;
            for(var iframeIdx = 0; iframeIdx < iframes.length; iframeIdx++) {
                var iframeName = iframes[iframeIdx];
                if(!iframeName) continue;
                var iframeEl;
                if(parseFloat(iframeName).toString() == "NaN") {
                    //iframe name or id
                    iframeEl = iframeContent.getElementById(iframeName) || iframeContent.getElementsByName(iframeName)[0];
                } else {
                    // iframe index
                    iframeEl = $("iframe,frame", iframeContent).get(iframeName);
                }
                try {
                    iframeContent = $(iframeEl, iframeContent).contents().get(0);
                } catch (e1) {
                    try {
                        var targetSrc = jQuery(iframeEl).attr("src");
                        if(targetSrc) {
                            var targetOrigin = getDomain(targetSrc, iframeContent);
                            
                            var crossIframePath = "";
                            for(var crossIframeIdx = iframeIdx + 1; crossIframeIdx < iframes.length; crossIframeIdx++) {
                                crossIframePath += iframes[crossIframeIdx];
                            }

                            var msg = {
                                'topic': 'cross-origin-highLight',
                                'xpathStr': xpathStr,
                                'cssStr': cssStr,
                                'relativeXpathStr': relativeXpathStr,
                                'iframePath': crossIframePath
                            };
                            iframeEl.contentWindow.postMessage(msg, targetOrigin);
                        }
                    } catch(e2) {
                        console.log(e2);
                    }
                }
            }
            var $this = $(iframeEl, iframeContent);
            hihglightContent = $this.get(0).contentDocument;
        }
        if(xpathStr){
            highlightResult = $.xpath(xpathStr, hihglightContent);
        }else if (cssStr) {
            highlightResult = $(cssStr, hihglightContent);
        }else if(relativeXpathStr){
            highlightResult = $.xpath(relativeXpathStr, hihglightContent);
        }else if(elements[idx].cssArr.length > 1){
            var finalCss = elements[idx].cssArr[1].css;
            if(finalCss.substring(0, 4) == 'css=') {
                finalCss = finalCss.substr(4);
            }
            highlightResult = $(finalCss, highlightContent);
        }else if(elements[idx].xpaths.length > 1){
            var finalXpath = elements[idx].xpaths[1].xpath;
            if(finalXpath.substring(0, 8) == 'xpath=//') {
                finalXpath = finalXpath.substr(6);
            }
            highlightResult = $.xpath(finalXpath, highlightContent);
        }else {
            highlightResult = null;
        }
    } catch (e) {
        highlightResult = null;
        console.log(e);
    }

    if(jQuery(highlightResult).length <= 0) return;
    highlightOldStyle = "";
    highlightOldStyle = jQuery(highlightResult).attr("style") || "";
    var highlightStyle ="background: #B7C9FA !important; outline: dashed 3px red !important;";
    jQuery(highlightResult)[0].style.cssText = highlightOldStyle + highlightStyle;
    
    currentHighlightResult = highlightResult;
}