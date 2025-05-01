/*!
 * POM Magic Created&designed by Leiping and Developed by Lanhongdong,tested by Leiping&lanhongdong
 * leiping3333@163.com lanhongdong@126.com
 * Leiping and Lanhongdong reserve all copy right of POM Magic
 *
 * Date: 2017-01-10 T21:10Z
 */

var pattern = new RegExp("[`~!@#$%^&*()=|{}':;\",\\[\\].<>?～！@#￥%……&*（）——§｛｝【】‘：；”“’。，、？ ]", "gm");

function rectangleSelect(selector, content, x1, y1, x2, y2, iframePaths, elements){
    
    var iframes = jQuery("iframe,frame", content).toArray();

    //查找层次,用于判断是否被覆盖
    var zindexArr = [];
    var zindexErr = new Error();
    jQuery(selector, content).filter(function(){
        var $this = jQuery(this);
        var zindex = $this.css("z-index");
        return zindex != "auto" && zindex != "" && zindex >0;
    }).each(function(){
        var $this = jQuery(this);
        var flag = true;
        try{
            $(this).add(jQuery(this).parents()).each(function(){
                var $this = jQuery(this);
                if($this.css("display") == "none") {
                    throw zindexErr;
                }
                if($this.width() <= 0 && $this.height() <= 0) {
                    throw zindexErr;
                }
            });
        }catch(err){
            flag = false;
        }
        
        if(flag) {
            zindexArr.push($this);
        }
    });
    
    var iframePath = iframePaths;
    
	jQuery(selector + ":visible", content).each(function(){
		var $this = jQuery(this);
		var tagname = $this.get(0).tagName.toLowerCase();
        
		if($this.children().length == 0 || tagname == "select"){
			var offset = $this.offset();
			var x = offset.left;
			var y = offset.top;
			var w = $this.width();
			var h = $this.height();
			
            if(self != top){    //在iframe中
                var scrollTop = $(content).scrollTop();
			    var scrollLeft = $(content).scrollLeft();
            } else {
                var scrollTop = 0;
			    var scrollLeft = 0;
            }
			            
            var zindex = getZindex($this.get(0));
			
			if((tagname == "iframe" || tagname == "frame" ) && $this.css("display") != "none") {
				if(iframePath) iframePath += "/";
				var iframeNameOrId = $this.attr("id") || $this.attr("name") || "" ;
                if(! iframeNameOrId) {
                    var iframeLen = iframes.length;
                    for(var iframeIdx = 0; iframeIdx < iframeLen; iframeIdx++) {
                        if(jQuery(iframes[iframeIdx]).is($this)) {
                            iframeNameOrId = iframeIdx;
                            break;
                        }
                    }
                }
                iframePath += iframeNameOrId;
                try {
                    rectangleSelect(selector, $this.contents(), x1-x, y1-y, x2-x, y2-y, iframePath, elements);
                } catch (e1) {
                    //跨域
                    try {
                        var ifr = $this.get(0);
                        var targetSrc = $this.attr("src");
                        if(targetSrc) {
                            var targetOrigin = getDomain(targetSrc, content);
                            var msg = {
                                'topic': 'cross-origin-getElements',
                                'selector': selector,
                                'left': x1-x,
                                'top': y1-y,
                                'right': x2-x,
                                'down': y2-y,
                                'iframePath': iframePath
                            };
                            ifr.contentWindow.postMessage(msg, targetOrigin);
                        }
                        
                        
                    } catch(e2) {
                        console.log(e2);
                    }
                } finally {
                    iframePath = iframePaths;
                }
				
			} else if(x - scrollLeft >= x1 && y - scrollTop >= y1 && x+w - scrollLeft <= x2 && y+h - scrollTop <=y2){
				
                //是否被覆盖:左上角落于被覆盖区域,且宽度或高度的一半处于被覆盖区域
                var coverFlag = true;	//未覆盖
                for(var i=0; i<zindexArr.length; i++){
                    var z = parseInt(jQuery(zindexArr[i]).css("z-index"));
                    if(!isNaN(z) && zindex >= z) {
                        continue;
                    } else {
                        var zOffset = zindexArr[i].offset();
                        var zX = zOffset.left;
                        var zY = zOffset.top;
                        var zW = zindexArr[i].width();
                        var zH = zindexArr[i].height();
                        if(x >= zX && y>=zY && x+w/2 <= zX+zW && y+h/2<= zY+zH) {   //下层,被覆盖
                            coverFlag = false;
                            break;
                        }
                    }
                }
                if(coverFlag) getElement($this.get(0), iframePath, elements);
			}
		}
	});
    
}

//获取元素的z_Index
function getZindex(el) {
    var e = new Error();
    var max_zIndex = 0;
    jQuery(el).add(jQuery(el).parents()).each(function(){
        var $this = jQuery(this);
        var zindex = $this.css("z-index");
        if(zindex != "auto" && zindex != "" && zindex > 0) {
            var current_zIndex = parseInt($this.css("z-index"));
            if(!isNaN(current_zIndex) && max_zIndex < current_zIndex) max_zIndex = current_zIndex;
        }
    });
    return max_zIndex;
}

//根据元素获取相关的信息
function getElement(el, frameId, elements){
    
    var node = el;
    
    var myElement = new MyElement();	

    //根据黑名单过滤元素
    var nodehtml = node.outerHTML.toLowerCase();
    for(var fIdx = 0; fIdx < filterEleLength; fIdx++){
        if( filterElement[fIdx] == nodehtml ) return;
    }

    if(node.hasAttribute("id")) {
        myElement.id = node.getAttribute("id");
        if(! XpathLanLib.getResultsNumberAndTime(el.ownerDocument, '//*[@id="' + myElement.id + '"]')) {
            myElement.id = "";
        }
    }
    if(node.hasAttribute("name")) {
        myElement.name = node.getAttribute("name");
        if(! XpathLanLib.getResultsNumberAndTime(el.ownerDocument, '//*[@name="' + myElement.name + '"]')) {
            myElement.name = "";
        }
    }
    if(node.hasAttribute("type")) myElement.type = node.getAttribute("type");
    if(node.hasAttribute("class")) myElement.className = node.getAttribute("class");
    if(node.hasAttribute("title")) myElement.title = node.getAttribute("title");

    myElement.tag = node.nodeName;
    myElement.htmlStr = node.outerHTML;
//    myElement.xpathStr = GetPomLib.getElementXPath(node);
    myElement.xpathStr = "";    //取消绝对xpath，不再保留其值
    myElement.relativeXpathStr = GetPomLib.getElementRelativeXPath(node);
    myElement.cssStr = GetPomLib.cssPath(node);
    myElement.frameId = frameId;
    
    if(myElement.xpathStr) {
        if(! XpathLanLib.getResultsNumberAndTime(el.ownerDocument, myElement.xpathStr)) {
            myElement.xpathStr = "";
        }
    }
    if(myElement.relativeXpathStr) {
        if(! XpathLanLib.getResultsNumberAndTime(el.ownerDocument, myElement.relativeXpathStr)) {
            myElement.relativeXpathStr = "";
        }
    }
    if(myElement.cssStr) {
        var result = $(myElement.cssStr, el.ownerDocument);
        if(1 !== result.length) {
            myElement.cssStr = "";
        }
    }
    
    var cssArray = new Array();
    //第一个值用来保存选择值
    cssArray.push({css: "", score: 0});
    var cssArrResult = XpathLanLib.getCssArray(node);
    for(var k=0; k<cssArrResult.length; k++) {
        cssArray.push(cssArrResult[k]);
    }
    if(myElement.cssStr) {
        cssArray.push({css: myElement.cssStr, score: 0});
    }
    myElement.cssArr = cssArray;

    //xpaths:多个xpath
    var xpathResult = Xpath0rLib.getRelativeXpath(node);
    var xpathResultLen = xpathResult.length;
    var xpathArray = new Array();
    //第一个值用来保存选择值
    xpathArray.push({xpath: "", score: 0});
    let xpathLanResult = XpathLanLib.getXpaths(node);
    for(let j=0; j<xpathLanResult.length; j++) {
        xpathArray.push(xpathLanResult[j]);
    }
    for(var i=0; i<xpathResultLen; i++){
        xpathArray.push(xpathResult[i]);
    }
    myElement.xpaths = xpathArray;


    //value值取值规则:
    //一,特殊:
    //1)如果是Link,取href属性;
    //2)如果是Select,取可选项值,JSON形式表示;
    //二,常规:按优先级依次取非空属性value,textContent(或innerHTML?),title; 
    if(node.hasAttribute("href")) {
        myElement.value = node.getAttribute("href");
    }else if( myElement.tag == "SELECT") {
        //原生下拉项取值如下,框架封装后值可能不属于当前元素的子元素(应当作为动态值处理)
        var selectArray = new Array();
        $(node).children("OPTION").each(function(){
            selectArray.push(jQuery(this).text());
        });
        myElement.value = JSON.stringify(selectArray);
    }else if(node.hasAttribute("value")) {
        myElement.value = node.getAttribute("value");
    }else if(node.textContent){
        myElement.value = node.textContent;
    }


    /*
    **mapValue
    **1.link元素特殊处理
    **2.需要映射的元素(根据输入获取映射值):select;checkbox,radio,input(type=text);
    **3.其他无需映射的元素(默认取自身的值):imag,link,button,input(type="button,reset,submit")
    */
    //if:input type=text, than get first value
    var sXPath = '';
    if(node.hasAttribute("href")){//
        myElement.mapValue = node.textContent;
    }else if(myElement.tag == "SELECT" || (myElement.tag =="INPUT" && (myElement.type == "text" || myElement.type == "radio" || myElement.type == "checkbox"))){
        try{
            if(myElement.id){
                sXPath = "//*[@id='" + myElement.id + "']/ancestor-or-self::*[name()='li']/descendant::*[text() and count(*)=0]";
                var relativeNode = node.selectSingleNode(sXPath);
                if(relativeNode !=undefined || relativeNode != null) myElement.mapValue = relativeNode.textContent;
            }else if(myElement.name){	// by name
                sXPath = "//*[@name='" + myElement.name + "']/ancestor-or-self::*[name()='li']/descendant::*[text() and count(*)=0]";
                var relativeNode = node.selectSingleNode(sXPath);
                if(relativeNode !=undefined || relativeNode != null) myElement.mapValue = relativeNode.textContent;
            }else{	//others,such as:button/lable/link(not include table!!)
                myElement.mapValue = myElement.value ? myElement.value : node.textContent;
            }
        }catch(e){
            myElement.mapValue = "";
        }
    }else{
        myElement.mapValue = myElement.value ? myElement.value : node.textContent;
        if(!myElement.mapValue && node.title) myElement.mapValue = node.title;

        //映射值不是nodeType=3的情况
//            if(!myElement.mapValue) myElement.mapValue = jQuery(node, document.getElementById(myElement.frameId).contentDocument || document).get(0).previousSibling.textContent;
    }
    var tempMapValue = (myElement.mapValue ? myElement.mapValue.trim() : myElement.mapValue);
    if(tempMapValue != null && tempMapValue != "" && tempMapValue != undefined)
        myElement.mapValue = tempMapValue.substring(0,1).toLowerCase() + tempMapValue.substring(1).replace(pattern, "");

    //actionName
    myElement.actionName = getElementObjectType(node);
    
    elements.push(myElement);
}

function getElementObjectType(element) {
    let result = '';
    result = mapObjectTypeCustomise(element);
    if( null == result) {
        result = mapObjectTypeDefault(element);
    }
    return result;
}

function mapObjectTypeCustomise(element) {
    let objecttype_name,
        objecttype_tag,
        objecttype_type,
        objecttype_class,
        objecttype_attributename,
        objecttype_attributevalue,
        objecttype_result = '';
    
    if(!objecttype_behavior_value || objecttype_behavior_value.length == 0) return null;
    
    objecttype_arr = JSON.parse(objecttype_behavior_value);
    objecttype_arr_len = objecttype_arr.length;
    for(let idx = 0; idx < objecttype_arr_len; idx++) {
        objecttype_name = objecttype_arr[idx]['objecttype'];
        objecttype_tag = objecttype_arr[idx]['tag'];
        objecttype_type = objecttype_arr[idx]['type'];
        objecttype_class = objecttype_arr[idx]['class'];
        objecttype_attributename = objecttype_arr[idx]['attributename'];
        objecttype_attributevalue = objecttype_arr[idx]['attributevalue'];
        
        objecttype_result = compareAttributes(element, objecttype_name, objecttype_tag, objecttype_type, objecttype_class, objecttype_attributename, objecttype_attributevalue);
        
        if(null != objecttype_result) break;
    }
    return objecttype_result;
}

function mapObjectTypeDefault(element) {
    let typevalue = '',
        tagname = element.tagName.toLowerCase(),
        result = '';
    
    if(element.hasAttribute('type')) typevalue = element.getAttribute('type').toLowerCase();
    
    switch(tagname)
    {
        case 'input':
            switch(typevalue)
            {
                case 'checkbox':
                    result = webElement.CheckBox;
                    break;
                case 'file':
                case 'password':
                case 'text':
                    result = webElement.TextField;
                    break;
                case 'radio':
                    result = webElement.RadioButton;
                    break;
                default:
                    result = webElement.Button;
            }
            break;
        case 'button':
            result = webElement.Button;
            break;
        case 'img':
        case 'image':
            if(element.hasAttribute('src')) {
                result = webElement.Image;
            } else {
                result = webElement.Button;
            }
            break;
        case 'link':
            result = webElement.Link;
            break;
        case 'a':
            if(element.hasAttribute('href')) {
                result = webElement.Link;
            } else {
                result = webElement.Button;
            }
            break;
        case 'select':
        case 'option':
            result = webElement.SelectList;
            break;
        case 'table':
            result = webElement.Table;
            break;
        case 'form':
            result = webElement.Form;
            break;
        case 'textarea':
            result = webElement.TextField;
            break;
        case 'label':
        case 'b':
        case 'span':
        case 'font':
        case 'p':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'h7':
        case 'h8':
            result = webElement.Label;
            break;
        default:
            result = webElement.Button;
    }
    return result;
}

function compareAttributes(element, objecttypeName, objecttypeTag, objecttypeType, objecttypeClass, objecttypeAttributesName, objecttypeAttributesValue) {
    if (element.tagName.toLowerCase() != objecttypeTag) {
        return null;
    }
    if (objecttypeType && !(element.hasAttribute('type') && element.getAttribute('type').toLowerCase() == objecttypeType)) {
        return null;
    }
    if (objecttypeClass && !(element.hasAttribute('class') && element.getAttribute('class').toLowerCase().indexOf(objecttypeClass) > -1)) {
        return null;
    }
    if (objecttypeAttributesName && !(element.hasAttribute(objecttypeAttributesName) && element.getAttribute(objecttypeAttributesName).toLowerCase().indexOf(objecttypeAttributesValue) > -1)) {
        return null;
    }
    return objecttypeName;
}