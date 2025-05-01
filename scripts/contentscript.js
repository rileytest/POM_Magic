
/*!
  * POM Magic Created&designed by Leiping and Developed by Lanhongdong,tested by Leiping&lanhongdong
 * leiping3333@163.com lanhongdong@126.com
 * Leiping and Lanhongdong reserve all copy right of POM Magic
 *
 * Date: 2017-09-19 T21:10Z
 */

const cModeEntire  	= 1;
const cModeVisible 	= 0;
const cModeBrowser 	= 3;

var clientWidth = 0, clientHeight = 0;
var scrollStart = {left : 0, top : 0};
var scrollEnd 	= {left : 0, top : 0};
var cropRect = {left: 0, top: 0, right: 0, bottom: 0};

//*****************my*********
var count = 0;
var elements = [];
var zIndex = [];    //当前页面层次
var idx = 0;    //当前高亮元素在数组中的序号
var highlightResult = null;     //当前高亮元素
var highlightOldStyle = "";     //保存元素已有的style属性
var highlightContent = null;    //保存高亮元素上下文
var highlightDomain = "";       //保存当前高亮元素的域名
var highlightIframe;            //如果跨域，保存当前高亮元素当前域的iframe

var topIframes = [];
function getTopFrames() {
    if(topIframes.length == 0) {
        topIframes = getTopDomainFrames(document, topIframes);
    }
    return topIframes;
}

function getTopDomainFrames(doc, frames) {
    jQuery("iframe, frame", doc).each(function() {
        frames.push(this);
        let $this = jQuery(this),
            tagname = $this.get(0).tagName.toLowerCase();
        if(tagname == "iframe" || tagname == "frame") {
            try {
                getTopDomainFrames($this.contents(), frames);
            } catch (e) {}
        }
    });
    return frames;
}

function getIframePathByNode(element) {
    let iframePath = "",
        flag = true,
        currentElement = element,
        currentWindow = window.self;
    
    while(flag) {
        let iframeNameOrId = getIframeByNode(currentElement, currentWindow);
        if(iframePath) {
            iframePath = iframeNameOrId + "/" + iframePath;
        } else {
            iframePath = iframeNameOrId;
        }
        if(currentWindow == window.top) {
            flag = false;
        } else {
            currentWindow = currentWindow.parent;
        }
    }
    return iframePath;
}

function getIframeByNode(element, theWindow) {
    $this = jQuery(element);
    let iframeNameOrId = $this.attr("id") || $this.attr("name") || "";
    
    if(! iframeNameOrId) {
        let frames = jQuery("iframe, frame", theWindow.document).toArray(),
            framesLen = frames.length;
        for(let framesIdx = 0; framesIdx < framesLen; framesIdx++) {
            if(frames[framesIdx].getAttribute("src") == element.getAttribute("src")) {
                iframeNameOrId = framesIdx;
            }
        }
    }
    return iframeNameOrId;
}

function updateIframe() {
    let topIframeIndex = 0,
        elementsIdx = 0,
        elementsLen = elements.length,
        currentIframeId = "";
    
    getTopFrames();
    
    for(elementsIdx = 0; elementsIdx < elementsLen; elementsIdx++) {
        currentIframeId = elements[elementsIdx].frameId.toString();
        if(currentIframeId && currentIframeId.indexOf("<") > -1) {
            let urlInIframePath = currentIframeId.substring(currentIframeId.search("<"), currentIframeId.search(">") + 1),
                topIframesLen = topIframes.length;
            for(topIframeIndex = 0; topIframeIndex < topIframesLen; topIframeIndex++) {
                let iframeSrc = topIframes[topIframeIndex].getAttribute("src"),
                    targetSrc = currentIframeId.substring(1, currentIframeId.length - 1);
                if(iframeSrc && targetSrc.indexOf(iframeSrc) > -1) {
                    let iframePath = getIframePathByNode(topIframes[topIframeIndex]);
                    currentIframeId = currentIframeId.replace(urlInIframePath, iframePath);
                    elements[elementsIdx].frameId = currentIframeId;
                    break;
                }
            }
        }
    }
}

function getDomain(url, contentDoc) {
    if(!url) return '';
    let protocol = '',
        hostname = '',
        domain = '';
    if(url.indexOf('//') > -1) {
        protocol = url.split('/')[0];
        if(!protocol) {
            protocol = contentDoc.location.protocol;
        }
        hostname = url.split('/')[2];
        if(protocol && hostname) {
            domain = protocol + '//' + hostname;
        }
    }
    if(!domain) {
        protocol = contentDoc.location.protocol;
        hostname = contentDoc.domain;
        domain = protocol + '//' + hostname;
    }
    return domain;
}

//清除高亮样式
function clear_css(oldStyle){
    if(highlightDomain) {
        var msg = {
            'topic': 'cross-origin-highLight-clear',
        };
        highlightIframe.contentWindow.postMessage(msg, highlightDomain);
        highlightDomain = '';
        highlightIframe = '';
    } else {
        var el = $(highlightResult, highlightContent)[0];
        if(! ( el && el.hasAttribute("style"))) return;
        el.style.cssText = oldStyle;
    }
    
}

function getAltExtents()
{
	var doc = window.document;
	var root = doc.documentElement;
	var canvas_width = root.clientWidth ? root.clientWidth : window.innerWidth;
	var canvas_height = -1;

	if (canvas_height < 0)
		canvas_height = window.innerHeight - getSBHeight(window);

	var 
		clientHeight    = canvas_height,
		clientWidth     = canvas_width;

	if (doc.body)
	{
		var altWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.scrollWidth : doc.body.scrollWidth;
		var clnWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : doc.body.clientWidth;

		var altHeight = doc.documentElement.scrollHeight;
		var clnHeight = doc.documentElement.clientHeight;

		var frameWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : doc.body.clientWidth;
		var frameHeight = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight : doc.body.clientHeight;

		if (altWidth < frameWidth)
		{
			altWidth = frameWidth;
			clnWidth = frameWidth;
		}

		if (altHeight < frameHeight)
		{
			altHeight = frameHeight;
			clnHeight = frameHeight;
		}

		if (canvas_width < altWidth)
		{
			clientWidth = clnWidth;
			canvas_width = altWidth;
		}

		if (canvas_height < altHeight)
		{
			clientHeight = clnHeight;
			canvas_height = altHeight;
		}
	}

	return {
		Width: canvas_width,
		Height: canvas_height
	}
}

function highlightHandler(hElement, hType) 
{
	clear_css(highlightOldStyle);

    highlightContent = document;
    var xpathStr = hElement.xpathStr,
        cssStr = hElement.cssStr,
        relativeXpathStr = hElement.relativeXpathStr,
        xpaths = hElement.xpaths ? hElement.xpaths[0].xpath : [],
        cssx = hElement.cssArr ? hElement.cssArr[0].css : [];
    
    try {
        elementFrameId = hElement.frameId.toString();
        if(elementFrameId){
            var iframes = elementFrameId.split("/");
            var iframeContent = document;   //20180423
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
                            
                            highlightDomain = targetOrigin;
                            highlightIframe = iframeEl;

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
            highlightContent = $this.get(0).contentDocument;
        }
        
        if(hType == 'other') {
        	if(xpathStr){
                highlightResult = $.xpath(xpathStr, highlightContent);
            }else if (cssStr) {
                highlightResult = $(cssStr, highlightContent);
            }else if(relativeXpathStr){
                highlightResult = $.xpath(relativeXpathStr, highlightContent);
            }else if(cssx){
                var finalCss = cssx;
                if(finalCss.substring(0, 4) == 'css=') {
                    finalCss = finalCss.substr(4);
                }
                highlightResult = $(finalCss, highlightContent);
            }else if(xpaths){
                var finalXpath = xpaths;
                if(finalXpath.substring(0, 8) == 'xpath=//') {
                    finalXpath = finalXpath.substr(6);
                }
                highlightResult = $.xpath(finalXpath, highlightContent);
            }else {
                highlightResult = null;
            }
        } else if(hType == 'cssx') {
        	var finalCss = cssx;
            if(finalCss.substring(0, 4) == 'css=') {
                finalCss = finalCss.substr(4);
            }
            highlightResult = $(finalCss, highlightContent);
        } else if(hType == 'xpaths') {
        	var finalXpath = xpaths;
            if(finalXpath.substring(0, 8) == 'xpath=//') {
                finalXpath = finalXpath.substr(6);
            }
            highlightResult = $.xpath(finalXpath, highlightContent);
        }
    } catch (e) {
        highlightResult = null;
        console.log(e);
    }

    var highlightResultLen = jQuery(highlightResult).length;
    if(highlightResultLen <= 0) return highlightResultLen;
    highlightOldStyle = "";
    highlightOldStyle = jQuery(highlightResult).attr("style") || "";
    var highlightStyle ="background: #B7C9FA !important; outline: dashed 3px red !important;";
    jQuery(highlightResult)[0].style.cssText = highlightOldStyle + highlightStyle;
    return highlightResultLen;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

	var msg = request;
	switch (msg.topic)
	{
		case "initSelected": 
			mode = msg.mode;

            divElement = undefined;
			doc = window.document;
			body = divElement || doc.body;
			savedScrollTop = body.scrollTop;
			savedScrollLeft = body.scrollLeft;
			docWidth = body.scrollWidth;
			docHeight = body.scrollHeight;

			if (!divElement)
			{
				docWidth = Math.max(doc.documentElement.scrollWidth, body.scrollWidth);
				docHeight = Math.max(doc.documentElement.scrollHeight, body.scrollHeight);

				if (docWidth <= 0 || docHeight <= 0) 
				{
					var e = getAltExtents();
					docWidth = e.Width;
					docHeight = e.Height;
				}
				
				if (docWidth <= 0) docWidth = 1024;
				if (docHeight <= 0) docHeight = 768;
			}
			
			if (mode == cModeEntire)
			{
				body.scrollTop = 0;
				body.scrollLeft = 0;
			}
			
			if (divElement)
			{
				clientWidth = divElement.clientWidth;
				clientHeight = divElement.clientHeight;
			}
			else
			{
				clientWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : body.clientWidth;
				clientHeight = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight : body.clientHeight;
			}
			
			if (window.innerHeight <= clientHeight) 
				docWidth = clientWidth;
			
            chrome.extension.sendMessage({topic: "initSelectedDone"});
		break;
			
		case "selectArea":
            
            var scrollTop = $("body").scrollTop();
            var scrollLeft = $("body").scrollLeft();
            
			FireShotSelection.makeSelection(function (data) 
			{
                
				if (data.left == data.right || data.top == data.bottom)
                    chrome.extension.sendMessage({topic: "areaSelectionCanceled"});
				else
				{
					body.scrollLeft = data.left;
					body.scrollTop 	= data.top;
					
					scrollStart.left = body.scrollLeft;
					scrollStart.top  = body.scrollTop;
					
					cropRect.left 	= data.left;
					cropRect.top	= data.top;
					cropRect.right	= data.right;
					cropRect.bottom	= data.bottom;
                    
                    $("body").scrollTop(scrollTop).scrollLeft(scrollLeft);
                    
                    let offset = 10;
                    let maxRight = $(window).width() + $(document).scrollLeft();
                    let maxBottom = $(window).height() + $(document).scrollTop();
                    if(cropRect.left - offset < 0) cropRect.left = 0;
                    if(cropRect.top - offset < 0) cropRect.top = 0;
                    if(cropRect.right + offset > maxRight) cropRect.right = maxRight;
                    if(cropRect.bottom + offset > maxBottom) cropRect.bottom = maxBottom;
                    
//                  var t0 = performance.now();
					rectangleSelect("*", document, cropRect.left, cropRect.top, cropRect.right, cropRect.bottom, "", elements);
//					var t1 = performance.now();
//					console.log("Time:" + Math.round((t1 - t0)));
                    
                    var request = {
                        'topic': 'areaSelected',
                        'elements': elements
                      };
                    chrome.extension.sendMessage(request);
				}
				
				
			});
		break;
            
        case "updateElements":
            clear_css(highlightOldStyle);
            
            //更新后再刷新Panel
            elements = msg.elements;
            updateIframe();
            
          //更新后再验证定位是否唯一，如果不唯一，再弹出选择框提醒用户更改
            var resultLen = 1,
            	idx = msg.idx;
            if(msg.type == 'xpaths') {
            	var len = elements.length;
            	if(len == 0 || len <= idx) return;
            	
//            	var hElement = {frameId: "undefined", xpaths: []};
//            	hElement.frameId = elements[idx].frameId;
//            	hElement.xpaths = elements[idx].xpaths;
            	var hElement = {frameId: elements[idx].frameId, xpaths: elements[idx].xpaths};
            	resultLen = highlightHandler(hElement, msg.type);
            } else if(msg.type == 'cssx') {
            	var len = elements.length;
	        	if(len == 0 || len <= idx) return;
	        	
	        	var hElement = new MyElement();
            	hElement.frameId = elements[idx].frameId;
            	hElement.cssArr = elements[idx].cssArr;
            	resultLen = highlightHandler(hElement, msg.type);
            }
//            if(resultLen != 1) {
//            	alert("Not equal 1.");
//            }        
            var request = {
                'topic': 'areaSelected',
                'size': resultLen,
                'idx': idx,
                'type': msg.type,
                'elements': elements
              };
            chrome.extension.sendMessage(request);
        break;
            
        case "highLight":
        	
        	idx = msg.idx;
        	var len = elements.length;
        	if(len == 0 || len <= idx) return;
        	
        	var hElement = elements[idx];
        	highlightHandler(hElement, msg.type);
        	

        break;
            
        case "clearHighLight":
            clear_css(highlightOldStyle);
            
        break;
            
        case "debug":
            console.log(msg.detail);
            
        break;
            

	}
  });