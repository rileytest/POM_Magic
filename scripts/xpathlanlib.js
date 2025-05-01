/*!
  * POM Magic Created&designed by Leiping and Developed by Lanhongdong,tested by Leiping&lanhongdong
 * leiping3333@163.com lanhongdong@126.com
 * Leiping and Lanhongdong reserve all copy right of POM Magic
 *
 * Date: 2017-09-19 T21:10Z
 */




var XpathLanLib = XpathLanLib || {};

XpathLanLib = (function() {
    
    function XpathLanLib(debug) {
        this.debug = debug || false;
    }
    
    XpathLanLib.prototype = {
        
        getLog: function(message) {
            if(this.debug === true) {
                if(typeof(kango) !== "undefined") {
                    kango.console.log("*** XpathLanLib : " + message);
                } else if(typeof(console) !== "undefined") {
                    console.log("*** XpathLanLib : " + message);
                }
            }
        },
        
        getAttributesOther: function(element) {
            let i = 0,
                attributesExceptions = ["id", "name", "style", "aria-label", "selected", "tabindex", "aria-hidden", "aria-level"],
                attributes = element.attributes,
                attributesLen = attributes.length,
                attributesName = [],
                attributeName = "",
                attributeValue = "";
            
            for(i = 0; i < attributesLen; i = i + 1) {
                attributeName = attributes[i].nodeName;
                attributeValue = attributes[i].value;
                
                this.getLog("XpathLanLib[getAttributesOther] : attr: " + attributeName);
                
                if(typeof(attributeName) !== "undefined" && typeof(attributeValue) !== "undefined" && attributesExceptions.indexOf(attributeName) === -1 && attributeValue !== "") {
                    attributesName.push({"name": attributeName, "value": attributeValue});
                }
            }
            
            return attributesName;
        },
        
        getAttributeValue: function (element, exceptAttrName) {
            try {
                let attrs = element.attributes,
                    filter = new Array();
                
                filter.push(exceptAttrName);
                for(let i = 0; i < attrs.length; i++) {
                    if(filter.indexOf(attrs[i].name) != -1 && attrs[i].value !== null && attrs[i].value !=="" && attrs[i].value !== undefined) {
                        return attrs[i].value;
                    }
                }
            } catch (e) {
                this.getLog("Error : XpathLanLib[getAttributeValue] : " + e);
            }
            
            return 0;
        },
        
        hasTextValue: function(e) {
            try {
                let text = e.innerText;
                text = $.trim(text);
                if(text !== null && text !== "" && text !== undefined)
                    return true;
                else
                    return false;
            } catch (e) {
                this.getLog("Error : XpathLanLib[hasTextValue] : " + e);
                return false;
            }
        },
        
        getAttributeXpathById: function(element) {
            let resultValue = "";
            if(this.getAttributeValue(element, "id") !== 0) {
                resultValue = "[@id='" + element.id + "']";
            }
            return resultValue;
        },
        
        getAttributeXpathByName: function(element) {
            let resultValue = "";
            if(this.getAttributeValue(element, "name") !== 0) {
                resultValue = "[@name='" + element.name + "']";
            }
            return resultValue;
        },
        
        //节点必须不可编辑才可用text(),不可编辑：非input标签
        getAttributeXpathByClassAndText: function(element) {
            let resultValue = "";
            try {
                let classValue = this.getAttributeValue(element, "class");
                if(classValue !== 0 && this.hasTextValue(element)) {
                    let contentText = $.trim(element.innerText);
                    let subText = contentText.substring(0, 50);
                    let tagName = element.tagName.toLowerCase();
                    if(tagName !== "input")
                        resultValue = "[@class='" + classValue + "' and contains(text(), '" + subText + "')]";
                    else
                        resultValue = "[@class='" + classValue + "']";
                }
            } catch (e) {
                this.getLog("Error : XpathLanLib[getAttributeXpathByClassAndText] : " + e);
            }
            
            return resultValue;
        },
        
        getAttributeXpathByClassAndTitle: function(element) {
            let resultValue = "",
                classValue = this.getAttributeValue(element, "class"),
                titleValue = this.getAttributeValue(element, "title");

            if(classValue !== 0 && titleValue !== 0) {
                resultValue = "[@class='" + classValue + "' and @title='" + titleValue + "']";
            }
            
            return resultValue;
        },
        
        getAttributeXpathByOtherAttribute: function(element) {
            let maxAttrLen = 3,
                otherAttributes = this.getAttributesOther(element),
                otherAttributesLen = otherAttributes.length,
                resultValue = "[";
            
            for(let i = 0; i < maxAttrLen && i < otherAttributesLen; i++) {
                if(i > 0) {
                    resultValue += " and ";
                }
                resultValue += "@" + otherAttributes[i].name + "='" + otherAttributes[i].value + "'";
            }
            resultValue += "]";
            if(otherAttributesLen > 0) {
                return resultValue;
            } else {
                return "";
            }
        },
        
        getXpathsById: function(element) {
            let xpath = "",
                resultValue = "",
                xpaths = [];
            
            resultValue = this.getAttributeXpathById(element);
            if(resultValue != "") {
                xpath = "xpath=//" + element.tagName.toLowerCase() + resultValue;
                xpaths.push(xpath);
            }
            return xpaths;
        },
            
        getXpathsByName: function(element) {
            let xpath = "",
                resultValue = "",
                xpaths = [];
            
            resultValue = this.getAttributeXpathByName(element);
            if(resultValue != "") {
                xpath = "xpath=//" + element.tagName.toLowerCase() + resultValue;
                xpaths.push(xpath);
            }
            
            return xpaths;
        },
            
        getXpathsByAttributes: function(element) {
            let xpath = "",
                resultTextValue = "",
                resultTitleValue = "",
                tagName = element.tagName.toLowerCase(),
                xpaths = [];
            
            resultTextValue = this.getAttributeXpathByClassAndText(element);
            if(resultTextValue != "") {
                xpath = "xpath=//" + tagName + resultTextValue;
                xpaths.push(xpath);
            }
            
            resultTitleValue = this.getAttributeXpathByClassAndTitle(element);
            if(resultTitleValue != "") {
                xpath = "xpath=//" + tagName + resultTitleValue;
                xpaths.push(xpath);
            }
            
            if(resultTextValue == "" && resultTitleValue == "") {
                let resultValue = this.getAttributeXpathByOtherAttribute(element);
                if(resultValue !== "") {
                    xpath = "xpath=//" + tagName + resultValue;
                    xpaths.push(xpath);
                }
            }
            
            return xpaths;
        },
        
        getXpathsByAncestorId: function(element) {
            
            let currentElement = element,
                xpaths = [];
            
            for(let i = 0; i <= 6; i++) {
                try {
                    currentElement = currentElement.parentNode;
                } catch(e) {
                    return xpaths;
                    this.getLog("Error : XpathLanLib[getXpathsByAncestorId] : " + e);
                }
                
                if(this.getAttributeValue(currentElement, "id") !== 0) {
                    
                    let preXpath = "xpath=//" + currentElement.tagName.toLowerCase() + "[@id='" + currentElement.id + "']/descendant::",
                        sufXpath = "",
                        resultNameValue = "",
                        resultTextValue = "",
                        resultTitleValue = "",
                        tagName = element.tagName.toLowerCase();
                    
//                    let resultIdValue = this.getAttributeXpathById(element);
//                    if(resultIdValue !== "") {
//                        sufXpath = tagName + resultIdValue;
//                        xpaths.push(preXpath + sufXpath);
//                    }
                    
                    resultNameValue = this.getAttributeXpathByName(element);
                    if(resultNameValue !== "") {
                        sufXpath = tagName + resultNameValue;
                        xpaths.push(preXpath + sufXpath);
                    }
                    
                    resultTextValue = this.getAttributeXpathByClassAndText(element);
                    if(resultTextValue !== "") {
                        sufXpath = tagName + resultTextValue;
                        xpaths.push(preXpath + sufXpath);
                    }
                    
                    resultTitleValue = this.getAttributeXpathByClassAndTitle(element);
                    if(resultTitleValue !== "") {
                        sufXpath = tagName + resultTitleValue;
                        xpaths.push(preXpath + sufXpath);
                    }
                    
                    if(resultNameValue == "" && resultTextValue == "" && resultTitleValue == "") {
                        let resultOtherValue = this.getAttributeXpathByOtherAttribute(element);
                        
                        if(resultOtherValue !== "") {
                            sufXpath = tagName + resultOtherValue;
                            xpaths.push(preXpath + sufXpath);
                        }
                    }
                }
            }
            
            return xpaths;
        },
        
        parseXpath20rXpath: function(xpathsArr) {
            let arrLen = xpathsArr.length,
                i = 0,
                xpath0rArray = [];
            
            for(i = 0; i < arrLen; i++) {
                xpath0rArray.push({xpath: xpathsArr[i].toString(), score: 100});
            }
            return xpath0rArray;
        },
            
        getXpaths: function(element) {
            let xpaths = [];
            
//            xpaths.push(this.getXpathsById(element));
//            xpaths.push(this.getXpathsByName(element));
            xpaths = xpaths.concat(this.getXpathsByAttributes(element));
            xpaths = xpaths.concat(this.getXpathsByAncestorId(element));
            
            return this.parseXpath20rXpath(xpaths);
        }
    
    };
    
    return XpathLanLib;
}());

var XpathLanLib = new XpathLanLib();
