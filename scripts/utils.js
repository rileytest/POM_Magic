/*!
  * POM Magic Created&designed by Leiping and Developed by Lanhongdong,tested by Leiping&lanhongdong
 * leiping3333@163.com lanhongdong@126.com
 * Leiping and Lanhongdong reserve all copy right of POM Magic
 * Includes xpath.js
 * https://getfirebug.com/

 *
 * Date: 2017-01-12 T21:10Z
 */


function MyElement(){
	mapValue		    : undefined;	//
	actionName			: undefined;	//array,some action for the element has,undefined
	prior				: undefined;	//优先级
    id					: undefined;	//HTMLֵ
	name				: undefined;	//HTMLֵ
	value				: undefined;	//HTMLֵ
    title				: undefined;	//HTMLֵ
	xpathStr			: undefined;	//xpath
	relativeXpathStr	: undefined;	//xpath
    xpaths              = [];           //xpaths
	cssStr				: undefined;	//css
    cssArr              = [];           //css array
	tag					: undefined;	//element tag,eg:input
	type				: undefined;	//element type,eg:button
    className			: undefined;	//element class
    frameId				: undefined;	//
	htmlStr				: undefined;	//HTML
	objName				: undefined		//
}

//web元素类型
webElement = {
    Button: "Button", 
    Label: "Label", 
    TextField:"TextField", 
    Link: "Link",
    CheckBox: "CheckBox",
    RadioButton: "RadioButton",
    Image: "Image",
    DatePicker: "DatePicker",
    SelectList: "SelectList",
    Form: "Form",
    Table: "Table",
    Container: "Container"
};

var defaultObjecttypeValue = "JalorList,JalorTable,JalorTree";
var currentObjecttypeValue = undefined;
var objecttype_behavior_value = "";
var initWebElement = {};
$.extend(initWebElement, webElement);

function updateOptions(updateValue) {

    let tempObj = {};
    
    if(!updateValue) return;
    
    let values = updateValue.split(",");
    webElement = {};
    $.extend(webElement, initWebElement);
    for(let i = 0; i<values.length; i++) {
        value = values[i];
        if(value) {
            tempObj[value] = value;
            webElement = Object.assign(webElement, tempObj);
        }
    }
    chrome.storage.sync.set({'objecttype': updateValue}, function() {});

}
function updateOptions() {
    chrome.storage.sync.get(["objecttype"], function(items) {
        
        let tempObj = {},
            objecttypeValue = items.objecttype;

        if(objecttypeValue == '') return;
        if(objecttypeValue == undefined) {
            objecttypeValue = defaultObjecttypeValue;
        }

        let values = objecttypeValue.split(",");
        webElement = {};
        $.extend(webElement, initWebElement);
        for(let i = 0; i<values.length; i++) {
            value = values[i];
            if(value) {
                tempObj[value] = value;
                webElement = Object.assign(webElement, tempObj);
            }
        }
        chrome.storage.sync.set({'objecttype': objecttypeValue}, function() {});
    });
    
    chrome.storage.sync.get(["objecttype_behavior"], function(items) {
        objecttype_behavior_value = items.objecttype_behavior;
    });
}
updateOptions();


//元素属性优先级:执行时查找顺序
var PriorArray = new Array("id", "name", "css", "xpath");

webelementkeys = Object.keys(webElement);
var ActionTypeArr = new Array(webelementkeys.length);
for(let i=0; i<webelementkeys.length; i++ ) {
    ActionTypeArr[i] = webelementkeys[i];
}

//过滤元素,抓取时过滤,不包含在抓取结果中
var filterElement = new Array();
filterElement.push("<div eno=\"resize\" class=\"g-resize disabled\"></div>");
filterElement.push("<div></div>");
var filterEleLength = filterElement.length;


// ************************************************************************************************
// download file

function downloadFile(el, fileName, content){
	var aLink = document.querySelector(el);
	var blob = new Blob([content]);
	aLink.download = fileName;
	aLink.href = URL.createObjectURL(blob);
}

// ************************************************************************************************
// javascript execute XPath


Element.prototype.selectNodes = function(sXPath) {
	var oEvaluator = new XPathEvaluator();
	var oResult = oEvaluator.evaluate(sXPath, this, null,
			XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	var aNodes = new Array();
	if (oResult != null) {
		var oElement = oResult.iterateNext();
		while (oElement) {
			aNodes.push(oElement);
			oElement = oResult.iterateNext();
		}
	}
	return aNodes;
};

Element.prototype.selectSingleNode = function(sXPath) {
	var oEvaluator = new XPathEvaluator();
	var oResult = oEvaluator.evaluate(sXPath, this, null,
			XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	if (oResult != null) {
		return oResult.singleNodeValue;
	} else {
		return null;
	}
};


// ************************************************************************************************
// Highlight

function highlightNode(node) {
    node.className += 'highlightEl';
}

function highlightNodes(nodes) {
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].className += 'highlightEl';
    }
}

function clearHighlights() {
    var nodes = document.getElementsByClassName('highlightEl');
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].className = nodes[i].className.replace('highlightEl', '');
    }
}


// ************************************************************************************************
// 验证xml格式的正确性

function validateXML(xmlContent)
{
    //errorCode 0是xml正确，1是xml错误，2是无法验证
    var xmlDoc,errorMessage,errorCode = 0;
    // code for IE
    if (window.ActiveXObject)
    {
        xmlDoc  = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(xmlContent);

        if(xmlDoc.parseError.errorCode!=0)
        {
            errorMessage="错误code: " + xmlDoc.parseError.errorCode + "\n";
            errorMessage=errorMessage+"错误原因: " + xmlDoc.parseError.reason;
            errorMessage=errorMessage+"错误位置: " + xmlDoc.parseError.line;
            errorCode = 1;
        }
        else
        {
            errorMessage = "格式正确";
        }
    }
    // code for Mozilla, Firefox, Opera, chrome, safari,etc.
    else if (document.implementation.createDocument)
    {
        var parser=new DOMParser();
        xmlDoc = parser.parseFromString(xmlContent,"text/xml");
        var error = xmlDoc.getElementsByTagName("parsererror");
        if (error.length > 0)
        {
               if(xmlDoc.documentElement.nodeName=="parsererror"){
                errorCode = 1;
                errorMessage = xmlDoc.documentElement.childNodes[0].nodeValue;
            } else {
                errorCode = 1;
                errorMessage = xmlDoc.getElementsByTagName("parsererror")[0].innerHTML;
            }
        }
        else
        {
            errorMessage = "格式正确";
        }
    }
    else
    {
        errorCode = 2;
        errorMessage = "浏览器不支持验证，无法验证xml正确性";
    }
    return {
        "msg":errorMessage, 
        "error_code":errorCode
    };
}

function splitActionType(key){
    var arr = [];
    var len = ActionTypeArr.length;
    var index = -1;
    for(var i=0; i<len; i++){
        if( -1 != (index = key.indexOf(ActionTypeArr[i])) ) break;
    }
    if(index != -1){
        arr.push(key.substring(0, index));
        arr.push(key.substring(index, key.length));
    }else {
        arr.push(key);
        arr.push("");
    }
    return arr;
}


function parseObjToElement(currentElement, elementKey, yamlElements) {

    var elementObj = currentElement;
    var mapActionTypeArr = splitActionType(elementKey);
    
    if( mapActionTypeArr[1] == "Container" ) {
        
        if(elementObj.hasOwnProperty("containerElements") && typeof(elementObj.containerElements) == "object") {
            let startContainer = GetPomLib.getNewMyElementContainer(mapActionTypeArr[0], mapActionTypeArr[1], PriorArray[0]);
            yamlElements.push(startContainer);
            
            let containerElementKeys = Object.getOwnPropertyNames(elementObj.containerElements);
            let containerElementNum = containerElementKeys.length;
            for(let keyIdx = 0; keyIdx < containerElementNum; keyIdx++) {
                let containerRoot = containerElementKeys[keyIdx];
                var containerElementKey = containerElementKeys[keyIdx];
                var containerElementObj = elementObj.containerElements[containerElementKey];

                let resultArr = parseObjToElement(containerElementObj, containerElementKey, yamlElements);
                yamlElements.concat(resultArr);
            }
            
            let endContainer = GetPomLib.getNewMyElementContainer(mapActionTypeArr[0], mapActionTypeArr[1], PriorArray[0]);
            yamlElements.push(endContainer);
            
        } else {
            alert("Error container element **" + elementKey + "** : tag containerElements is required.");
        }
    } else if(elementObj.hasOwnProperty("locators") && typeof(elementObj.locators) == "object") {
        var propertyLanguage = Object.getOwnPropertyNames(elementObj.locators);
        var propertyLanguageLen = propertyLanguage.length;
        if(propertyLanguageLen > 0){
            for(var j=0; j<propertyLanguageLen; j++){
                var yamlEl = GetPomLib.getNewMyElementObj();
                yamlEl.mapValue = mapActionTypeArr[0];
                yamlEl.actionName = mapActionTypeArr[1];

                var language = propertyLanguage[j];
                var locator = elementObj.locators[language];
                var locatorArr = locator.split("|");
                var locatorArrLen = locatorArr.length;

                //规定:第一个xpath为SimpleXpath,第二个xpath为xpathStr,其他为OtherPaths中
                var relativeXpathFlag = true;
//                var absoluteXpathFlag = true;//取消绝对xpath
                var xpathArr = [];
                var cssArr = [];

                for(var k=0; k<locatorArrLen; k++){

                    var index = locatorArr[k].indexOf("=");
                    var locatorKey = locatorArr[k].substring(0, index).trim();
                    var locatorValue = locatorArr[k].substring(index+1, locatorArr[k].length).trim();

                    if(0 == k) yamlEl.prior = locatorKey;
                    switch(locatorKey){
                        case "id":
                            yamlEl.id = locatorValue;
                            break;
                        case "name":
                            yamlEl.name = locatorValue;
                            break;
                        case "css":
//                            yamlEl.cssStr = locatorValue;
                            var cssObj = {
                                css: locatorValue,
                                score: 0
                            };
                            cssArr.push(cssObj);//第一个值用来保存选择值
                            cssArr.push(cssObj);
                            break;
                        case "xpath":
                            if(relativeXpathFlag){
                                relativeXpathFlag = false;
                                yamlEl.relativeXpathStr = locatorValue;
                                break;
                            } 
//                            else if(absoluteXpathFlag) {
//                                absoluteXpathFlag = false;
//                                yamlEl.xpathStr = locatorValue;
//                                break;
//                            } 
                            else {
                                var xpathObj = {
                                    xpath: locatorValue,
                                    score: 0
                                };
                                xpathArr.push(xpathObj);//第一个值用来保存选择值
                                xpathArr.push(xpathObj);
                            }
                            break;
                        default:
                            console.log("***POMMagic:Invalid locator key -> " + locatorKey);
                    }
                }
                if(! yamlEl.prior) yamlEl.prior = PriorArray[0];

                yamlEl.xpaths = xpathArr;
                yamlEl.cssArr = cssArr;
                yamlEl.htmlStr = "";

                yamlEl.value = "";
                yamlEl.title = "";
                yamlEl.tag = "";
                yamlEl.type = "";
                yamlEl.className = "";

//                            yamlEl.frameId = "";
                if(elementObj.hasOwnProperty("iframe") && typeof(elementObj.iframe) == "object"){
                    var iframeLanguages = Object.getOwnPropertyNames(elementObj.iframe);
                    var iframeLanguagesLen = iframeLanguages.length;
                    if(iframeLanguagesLen > 0){
                        for(var iframeLanguagesIdx=0; iframeLanguagesIdx<iframeLanguagesLen; iframeLanguagesIdx++){
                            var iframeLanguage = iframeLanguages[iframeLanguagesIdx];
                            if(iframeLanguage == language) {
                                yamlEl.frameId = elementObj.iframe[iframeLanguage];
                            }
                        }
                    }
                }

                yamlElements.push(yamlEl);
            }
        } else {
            var yamlEl = GetPomLib.getNewMyElementObj();
            yamlEl.mapValue = mapActionTypeArr[0];
            yamlEl.actionName = mapActionTypeArr[1];
            yamlEl.prior = PriorArray[0];

            yamlEl.id = "";
            yamlEl.name = "";
            yamlEl.relativeXpathStr = "";
            yamlEl.xpathStr = "";
            yamlEl.xpaths = [];
            yamlEl.cssStr = "";
            yamlEl.value = "";
            yamlEl.title = "";
            yamlEl.tag = "";
            yamlEl.type = "";
            yamlEl.className = "";
            yamlEl.frameId = "";
            yamlEl.htmlStr = "";

            yamlElements.push(yamlEl);
        }
    } else {
        alert("Error element **" + elementKey + "** : illegal element.");
    }
    
    return yamlElements;
}

// 解析xml,生成HTML
function paserFileToHtml(reader, file, filetype, encoding, elementsFromXML){
    reader.onload = function(){
//        alert(this.result);
//        oenfilediv.innerHTML = "<hr>" + this.result;
        
        if("xml" == filetype){
            //验证xml文件格式是否正确
            var valiResult = validateXML(this.result);
//            alert(valiResult.msg);

            var xmlData = $(this.result);
//            var simpleXpath = xmlData.get(2).children[0].children[4].innerText;
//            alert(simpleXpath);
//            var elementhtml = xmlData.get(2).children[0].children[0].innerText;
//            alert(elementhtml);
//            oenfilediv.innerHTML += "<hr>" + elementhtml;

            var xmlEles = xmlData.get(2);
            var xmlelesLen = xmlEles.children.length;
            for(var n=0; n<xmlelesLen; n++){

//            //遍历所有节点
//            var xmlEle = xmlEles.children[n];
//            oenfilediv.innerHTML += "<hr>";
//            for(var i=0; i<xmlEle.children.length; i++){
//                oenfilediv.innerHTML += "[" + xmlEle.children[i].nodeName + "] = " + xmlEle.children[i].innerHTML + "<br/>";
//            }

                var elXML = GetPomLib.getNewMyElementObj();
                elXML.mapValue = xmlEles.children[n].children[0].innerHTML;
                elXML.actionName = xmlEles.children[n].children[1].innerHTML;
                elXML.prior = xmlEles.children[n].children[2].innerHTML;
                elXML.id = xmlEles.children[n].children[3].innerHTML;
                elXML.name = xmlEles.children[n].children[4].innerHTML;
                elXML.relativeXpathStr = xmlEles.children[n].children[5].innerHTML;
                elXML.xpathStr = xmlEles.children[n].children[6].innerHTML;


//                elXML.xpaths = xmlEles.children[n].children[9].innerHTML;
                var xmlXpathsArray = new Array();
                xmlXpathsArray.push({xpath: xmlEles.children[n].children[7].innerHTML, score: 0});
                elXML.xpaths = xmlXpathsArray;

                elXML.cssStr = xmlEles.children[n].children[8].innerHTML;
                elXML.value = xmlEles.children[n].children[9].innerHTML;
                elXML.title = xmlEles.children[n].children[10].innerHTML;
                elXML.tag = xmlEles.children[n].children[11].innerHTML;
                elXML.type = xmlEles.children[n].children[12].innerHTML;
                elXML.className = xmlEles.children[n].children[13].innerHTML;
                elXML.frameId = xmlEles.children[n].children[14].innerHTML;
                elXML.htmlStr = xmlEles.children[n].children[15].innerHTML;

                elementsFromXML.push(elXML);
                
                addElementsToTable(elementsFromXML);
            }
        }else if("yaml" == filetype) {
            let obj = jsyaml.load(this.result);
//            console.log(obj);
//            console.log(obj.elements.PasswordTextField.locator.US);
            
            let ownPropertys = Object.getOwnPropertyNames(obj.elements);
            let ownPropertysLen = ownPropertys.length;
            if(ownPropertysLen <= 0) return;
            
            let yamlElements = [];
            for(let i=0; i<ownPropertysLen; i++){
                let elementKey = ownPropertys[i];
                
                let resultElements = parseObjToElement(obj.elements[elementKey], elementKey, yamlElements);
                yamlElements.concat(resultElements);
                
            }
            
            addElementsToTable(yamlElements);
        }

 
    };
    reader.readAsText(file, encoding);
}