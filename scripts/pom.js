/*!
 * POM Magic Created&designed by Leiping and Developed by Lanhongdong,tested by Leiping&lanhongdong
 * leiping3333@163.com lanhongdong@126.com
 * Leiping and Lanhongdong reserve all copy right of POM Magic
 * Copyright 2017 and other contributors
 *
 *
 * Date: 2017-09-19 T21:10Z
 */


var elements = [];
var elementsFromXML = [];
var port = chrome.extension.connect({name: "pom"});

document.write("<script language='text/javascript' src='jquery-2.1.0.js'><\/script>");

//show elements in page table
function showElementsInfo(nodes){
    							
	var table = "<table id=\"records\" width=100% border=\"1\">\n" + 
				"<tr><td align=\"center\" width=2%><input id=\"allCheckBox\" type=\"checkbox\" style=\"zoom: 130%;\"/></td>" + 
                "<td align=\"center\">No.</td>" +
				"<td align=\"center\">MapName</td>" +
				"<td align=\"center\">ObjectType</td>" +
                "<td align=\"center\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Priority&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>" + 
				"<td align=\"center\">Id</td>" + 
				"<td align=\"center\">Name</td>" + 
				"<td align=\"center\">SimpleXpath</td>" + 
				"<td align=\"center\" style=\"display:none;\">Xpath</td>" + 
                "<td align=\"center\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OtherXpaths&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>" + 
				"<td align=\"center\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Css&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>" + 
				"<td align=\"center\">Value</td>" + 
                "<td align=\"center\">Title</td>" + 
				"<td align=\"center\">Tag</td>" +
				"<td align=\"center\">Type</td>" +
                "<td align=\"center\">Class</td>" +
				"<td align=\"center\">Iframe</td>" +
				"<td align=\"center\">Html</td>" +
				"</tr>\n";
  
    function showTable(){
        table += "</table>\n";
        var div = document.getElementById("Display-list");
        div.innerHTML = table;
    }

    if(nodes.length == 0) return showTable();
    nodes.forEach(function(element, index){
        table += showElementInfo(element, index);
        if(index == nodes.length - 1){
            showTable();
        }
    });

}
function showElementInfo(element, index) {
	
	table = "<tr><td align=\"center\"><input name=\"checkBox\" type=\"checkbox\" style=\"zoom: 130%;\"/>";
    
    table += "</td><td class='indexClass' style='text-align: center;'>" + (index+1) + "</td>";

    if(element.mapValue)
		table += "<td class='ableEdit'><div class='classMapValueDiv'><textarea name=\"mapValue\">" + element.mapValue + "</textarea></div></td>";
	else
		table += "<td class='ableEdit'><div class='classMapValueDiv'><textarea name=\"mapValue\"></textarea></div></td>";
	
    //下拉项actionName
//    element.actionName = (element.actionName ? element.actionName : webElement.Button);
    table += "<td class='ableEdit'>" + actionNameToHtml(element.actionName) + "</td>";

    
    //优先级prior
    table += "<td class='ableEdit'>" + priortoHtml(element.prior) + "</td>";
	
	if(element.id)
		table += "<td>" + element.id + "</td>";
	else
		table += "<td></td>";
	
	if(element.name)
		table += "<td>" + element.name + "</td>";
	else
		table += "<td></td>";

	if(element.relativeXpathStr)
		table += "<td id=\"relativeXpathStr\">" + element.relativeXpathStr + "</td>";
	else
		table += "<td id=\"relativeXpathStr\"></td>";
	
	if(element.xpathStr)
		table += "<td style=\"display:none;\">" + element.xpathStr + "</td>";
	else
		table += "<td style=\"display:none;\"></td>";
    
    if(element.xpaths.length > 1)
		table += "<td class=\"ableEdit\">" + xpathsToHtml(element.xpaths) + "</td>";
	else
		table += "<td class=\"ableEdit\"></td>";
		
//	if(element.cssStr)
//		table += "<td>" + element.cssStr + "</td>";
//	else
//		table += "<td></td>";
    if(element.cssArr.length > 1)
		table += "<td class=\"ableEdit\">" + cssArrToHtml(element.cssArr) + "</td>";
	else
		table += "<td class=\"ableEdit\"></td>";
	
	if(element.value)
		table += "<td>" + element.value + "</td>";
	else
		table += "<td></td>";
    
    if(element.title)
		table += "<td>" + element.title + "</td>";
	else
		table += "<td></td>";
	
	if(element.tag)
		table += "<td>" + element.tag + "</td>";
	else
		table += "<td></td>";
		
	if(element.type)
		table += "<td>" + element.type + "</td>";
	else
		table += "<td></td>";
    
    if(element.className)
		table += "<td>" + element.className + "</td>";
	else
		table += "<td></td>";
		
	if(element.frameId)
		table += "<td>" + element.frameId + "</td>";
	else
		table += "<td></td>";
	
	table += "<td>" + "<xmp>" + element.htmlStr + "</xmp>" + "</td>" +
					"</tr>\n";
	
	return table;
}

function actionNameToHtml(selectActionValue){
    var strHtml = "<div class='classActionTypeDiv'><select name='ActionSelect'>";
    if(!selectActionValue) selectActionValue = '';
    let keys = Object.keys(webElement);
    let keysLen = keys.length;
    for(let i = 0; i < keysLen; i++) {
        if(selectActionValue == keys[i]) {
            strHtml += "<option value='" + webElement[keys[i]] + "'  selected='selected'>" + webElement[keys[i]] + "</option>";
        } else {
            strHtml += "<option value='" + webElement[keys[i]] + "'>" + webElement[keys[i]] + "</option>";
        }
    }
    
    strHtml += '</select><span hidden="hidden"></span></div>';
    return strHtml;
}

function priortoHtml(selectPrior){
    var strHtml = "<div class='classPriorDiv'><select name='PriorSelect'>";
    var trPriorArray = PriorArray;
    var trPriorLen = trPriorArray.length;
    if(!selectPrior) selectPrior = PriorArray[0];
    for(var i=0; i<trPriorLen; i++){
        if(selectPrior == trPriorArray[i])
            strHtml += "<option value='" + trPriorArray[i] + "'  selected='selected'>" + trPriorArray[i] + "</option>";
        else
            strHtml += "<option value='" + trPriorArray[i] + "'>" + trPriorArray[i] + "</option>";
    }
    strHtml += '</select><span hidden="hidden"></span></div>';
    return strHtml;
}

function xpathsToHtml(elsArray){
    var strHtml = "<div class='select-editable'><select name='XpathsSelect' onchange='this.nextElementSibling.value=this.value'>";
    var elsArraylen = elsArray.length;
    var selectFlag = false;
    if(elsArraylen > 0 && elsArray[0].xpath != ""){
        strHtml += "<option value='" + elsArray[0].xpath + "'  selected='selected' hidden='hidden'>" + elsArray[0].xpath + "</option>";
        selectFlag = true;
    }
    for(var i=1; i<elsArraylen; i++){
        if(elsArray[i].xpath){
            if(!selectFlag){
                strHtml += "<option value='" + elsArray[i].xpath + "'  selected='selected'>" + elsArray[i].xpath + "</option>";
                elsArray[0].xpath = elsArray[i].xpath;
                selectFlag = true;
            }
            else
                strHtml += "<option value='" + elsArray[i].xpath + "'>" + elsArray[i].xpath + "</option>";
        }
        
    }
    
    if(elsArraylen > 0 && elsArray[0].xpath != ""){
        strHtml += "</select><input class=\"xpathArrInput\" type=\"text\" name=\"format\" value='"+ elsArray[0].xpath +"' /></div>";
    } else {
        strHtml += "</select><input class=\"xpathArrInput\" type=\"text\" name=\"format\" value='' /></div>";
    }
    return strHtml;
}

function cssArrToHtml(elsArray){
    var strHtml = "<div class='select-editable'><select name='CssArrSelect' onchange='this.nextElementSibling.value=this.value'>";
    var elsArraylen = elsArray.length;
    var selectFlag = false;
    if(elsArraylen > 0 && elsArray[0].css != ""){
        strHtml += "<option value='" + elsArray[0].css + "'  selected='selected' hidden='hidden'>" + elsArray[0].css + "</option>";
        selectFlag = true;
    }
    for(var i=1; i<elsArraylen; i++){
        if(elsArray[i].css){
            if(!selectFlag){
                strHtml += "<option value='" + elsArray[i].css + "'  selected='selected'>" + elsArray[i].css + "</option>";
                elsArray[0].css = elsArray[i].css;
                selectFlag = true;
            }
            else
                strHtml += "<option value='" + elsArray[i].css + "'>" + elsArray[i].css + "</option>";
        }
        
    }
    
    if(elsArraylen > 0 && elsArray[0].css != ""){
        strHtml += "</select><input class=\"cssArrInput\" type=\"text\" name=\"format\" value='"+ elsArray[0].css +"' /></div>";
    } else {
        strHtml += "</select><input class=\"cssArrInput\" type=\"text\" name=\"format\" value='' /></div>";
    }
    return strHtml;
}

function showElementsInfoFromXML(nodesXml){
    var xmlTable = "<hr><table id=\"recordsXML\" width=100% border=\"1\"\n" + 
							"<tr><th align=\"center\" width=2%><input id=\"allCheckBox\" type=\"checkbox\"/></th>" + 
                            "<th align=\"center\" width=2%><b>No.</b></th>" +
							"<th align=\"center\" width=10%><b>MapValue</b></th>" +
							"<th align=\"center\" width=7%><b>ObjectType</b></th>" +
                            "<th align=\"center\" width=8%><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Priority&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></th>" + 
							"<th align=\"center\" width=8%><b>Id</b></th>" + 
							"<th align=\"center\" width=8%><b>Name</b></th>" + 
							"<th align=\"center\" width=10%><b>SimpleXpath</b></th>" + 
							"<th align=\"center\" width=10%><b>Xpath</b></th>" + 
                            "<th align=\"center\" width=10%><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OtherXpaths&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></th>" + 
							"<th align=\"center\" width=5%><b>Css</b></th>" + 
							"<th align=\"center\" width=5%><b>Value</b></th>" + 
                            "<th align=\"center\" width=5%><b>Title</b></th>" + 
							"<th align=\"center\" width=5%><b>Tag</b></th>" +
							"<th align=\"center\" width=5%><b>Type</b></th>" +
                            "<th align=\"center\" width=5%><b>Class</b></th>" +
							"<th align=\"center\" width=5%><b>IframId</b></th>" +
							"<th align=\"center\"  width=13%><b>Element</b></th>" +
							"</tr>\n";
  
    function showXmlTable(){
        xmlTable += "</table>\n";
        var div = document.getElementById("Display-xml");
        div.innerHTML = xmlTable;
    }

    if(nodesXml.length == 0) return showXmlTable();
    nodesXml.forEach(function(elementXml, index){
        xmlTable += showElementInfoFromXML(elementXml, index);
        if(index == nodesXml.length - 1){
            showXmlTable();
        }
    });
}
function showElementInfoFromXML(element, index) {
    
	
	table = "<tr><td align=\"center\"><input name=\"checkBox\" type=\"checkbox\" />";
    
    table += "</td><td>" + (index+1) + "</td>";

    if(element.mapValue)
		table += "<td class='ableEdit'><div class='classMapValueDiv'><textarea name=\"mapValue\">" + element.mapValue + "</textarea></div></td>";
	else
		table += "<td class='ableEdit'><div class='classMapValueDiv'><textarea name=\"mapValue\"></textarea></div></td>";
	
    //下拉项actionName
    table += "<td class='ableEdit'>" + actionNameToHtml(element.actionName) + "</td>";

    
    //优先级prior
    table += "<td class='ableEdit'>" + priortoHtml(element.prior) + "</td>";
	
	if(element.id)
		table += "<td>" + element.id + "</td>";
	else
		table += "<td></td>";
	
	if(element.name)
		table += "<td>" + element.name + "</td>";
	else
		table += "<td></td>";

	if(element.relativeXpathStr)
		table += "<td id=\"relativeXpathStr\">" + element.relativeXpathStr + "</td>";
	else
		table += "<td id=\"relativeXpathStr\"></td>";
	
	if(element.xpathStr)
		table += "<td>" + element.xpathStr + "</td>";
	else
		table += "<td></td>";
    
    if(element.xpaths.length > 0)
		table += "<td class=\"ableEdit\">" + element.xpaths[0].xpath + "</td>";
	else
		table += "<td class=\"ableEdit\"></td>";
		
	if(element.cssStr)
		table += "<td>" + element.cssStr + "</td>";
	else
		table += "<td></td>";
	
	if(element.value)
		table += "<td>" + element.value + "</td>";
	else
		table += "<td></td>";
    
    if(element.title)
		table += "<td>" + element.title + "</td>";
	else
		table += "<td></td>";
	
	if(element.tag)
		table += "<td>" + element.tag + "</td>";
	else
		table += "<td></td>";
		
	if(element.type)
		table += "<td>" + element.type + "</td>";
	else
		table += "<td></td>";
    
    if(element.className)
		table += "<td>" + element.className + "</td>";
	else
		table += "<td></td>";
		
	if(element.frameId)
		table += "<td>" + element.frameId + "</td>";
	else
		table += "<td></td>";
	
	table += "<td>" + "<xmp>" + element.htmlStr + "</xmp>" + "</td>" +
					"</tr>\n";
	
	return table;
}

//追加元素到table
function addElementsToTable(elementArr){
    if(elementArr.length <= 0) return;
    var newElementArr = [];
    if(elements.length > 0)
        newElementArr = elements.concat(elementArr);
    else
        newElementArr = elementArr;
    
    //test
    showElementsInfo(newElementArr);
    
    try{
        var request = {
            'topic': 'updateElements',
            'elements': newElementArr,
            'tabId': chrome.devtools.inspectedWindow.tabId
          };
        port.postMessage(request);
    } catch(e) {
//        console.log("***POMMagic:" + e.message);
        try {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var request = {
                    'topic': 'updateElements',
                    'elements': newElementArr,
                    'tabId': tabs[0].id
                  };
                port.postMessage(request);
            });
        } catch(e2) {
            console.log("***POMMagic:" + e2.message);
        }
    }
    
}

//返回相应数量的缩进
function getIndentation(num) {
    
    if(num <= 0) return "";
    
    let indentationIdx = 0;
    let temp = "";
    for(; indentationIdx < num; indentationIdx++) {
//        temp += "\t";
        temp += "    ";
    }
    return temp;
}

function appendElementToYaml(yamlStr, local, trElement, trIndex, basicIndentationNum, offsetIndentationNum) {

    yamlStr += getIndentation(basicIndentationNum + offsetIndentationNum) + trElement.mapValue.trim().replace(" ","") + trElement.actionName.trim() + ':\r\n';
    yamlStr += getIndentation(basicIndentationNum + 1 + offsetIndentationNum) + 'iframe:\r\n';
    yamlStr += getIndentation(basicIndentationNum + 2 + offsetIndentationNum) + local + ': "';
    yamlStr += trElement.frameId;
    yamlStr += '"\r\n';
    yamlStr += getIndentation(basicIndentationNum + 1 + offsetIndentationNum) + 'locators:\r\n';
    yamlStr += getIndentation(basicIndentationNum + 2 + offsetIndentationNum) + local + ': "';

    var elementPrior = trElement.prior;
    switch(elementPrior) {
        case "id":
            if(trElement.id) yamlStr += 'id=' + trElement.id + ' | ';
            break;
        case "name":
            if(trElement.name) yamlStr += 'name=' + trElement.name + ' | ';
            break;
        case "css":
//            if(trElement.cssStr) yamlStr += 'css=' + trElement.cssStr + ' | ';
            if(trElement.cssArr) {
                yamlStr += 'css=' + trElement.cssArr + ' | ';
            }
            break;
        case "xpath":
            if(trElement.relativeXpathStr) yamlStr += 'xpath=' + trElement.relativeXpathStr + ' | ';
            if(trElement.xpathStr) yamlStr += 'xpath=' + trElement.xpathStr + ' | ';
            if(trElement.xpaths) yamlStr += 'xpath=' + trElement.xpaths + ' | ';
            break;
    }
    if(trElement.id && elementPrior != 'id') yamlStr += 'id=' + trElement.id + ' | ';
    if(trElement.name && elementPrior != 'name') yamlStr += 'name=' + trElement.name + ' | ';
//    if(trElement.cssStr && elementPrior != 'css') yamlStr += 'css=' + trElement.cssStr + ' | ';
    if(trElement.cssArr && elementPrior != 'css') {
        yamlStr += 'css=' + (trElement.cssArr.substring(0,4) == 'css=' ? trElement.cssArr.substring(4) : trElement.cssArr) + ' | ';
    }
    if(elementPrior != 'xpath') {
        if(trElement.relativeXpathStr) yamlStr += 'xpath=' + trElement.relativeXpathStr + ' | ';
        if(trElement.xpathStr) yamlStr += 'xpath=' + trElement.xpathStr + ' | ';
        if(trElement.xpaths) yamlStr += 'xpath=' + (trElement.xpaths.substring(0,6) == 'xpath=' ? trElement.xpaths.substr(6) : trElement.xpaths) + ' | ';
    }
    if(trElement.cssStr || trElement.id || trElement.name || trElement.relativeXpathStr || trElement.xpathStr || trElement.xpaths)
        yamlStr = yamlStr.substr(0, yamlStr.length-3);
    return yamlStr += '"\r\n';
}

function getSelectedRecordIndex() {
    var selectedRecordIndex = [];
    var checkBox = document.getElementsByName('checkBox');
    if(checkBox) {
        for(var i=0; i<checkBox.length; i++){
            if(checkBox[i].type == "checkbox" && checkBox[i].checked == true) selectedRecordIndex.push(i);
        }
    }
    return selectedRecordIndex;
}


document.addEventListener("DOMContentLoaded", function(){
    
    //点击Click me按钮开始选择区域获取页面元素
	var clickButton = document.querySelector("#sum");
	if(clickButton){
		clickButton.addEventListener("click", function(e){
            
            try {
                var request = {
                    'topic': 'updateElements',
                    'elements': elements,
                    'tabId': chrome.devtools.inspectedWindow.tabId || 1
                  };
                port.postMessage(request);
            } catch(e1) {
                try {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        var request = {
                        'topic': 'updateElements',
                        'elements': elements,
                        'tabId': tabs[0].id
                      };
                    port.postMessage(request);
                    });
                } catch(e2) {
                    console.log(e2);
                }
            }
            
            var Mode = 2;
            try {
                var request = {
                    'topic': 'initSelected',
                    'mode': Mode,
                    'tabId': chrome.devtools.inspectedWindow.tabId
                  };
                port.postMessage(request);
            } catch(e1) {
                try {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        var request = {
                            'topic': 'initSelected',
                            'mode': Mode,
                            'tabId': tabs[0].id
                          };
                        port.postMessage(request);
                    });
                } catch(e2) {
                    console.error(e2);
                }
            }
            
		});
	}else{
		alert("clickButton = " + clickButton);
	}
    
    //点击delete按钮,删除列表中的记录
    var btnDelete = document.getElementById('delete');
    btnDelete.addEventListener("click", function(e){
        var deleteBox = [];
        deleteBox = getSelectedRecordIndex();
        
        //逆序,从后面删除
        deleteBox = deleteBox.reverse();
        for(var i=0; i<deleteBox.length; i++){
            elements.splice(deleteBox[i], 1);
        }
        try {
            var request = {
                'topic': 'updateElements',
                'elements': elements,
                'tabId': chrome.devtools.inspectedWindow.tabId || 1
              };
            port.postMessage(request);
        } catch(e1) {
            try {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    var request = {
                    'topic': 'updateElements',
                    'elements': elements,
                    'tabId': tabs[0].id
                  };
                port.postMessage(request);
                });
            } catch(e2) {
                console.error(e2);
            }
        }
        
    });
    
    //点击Add按钮,在列表中增加空行
    var btnAdd = document.getElementById('add');
    btnAdd.addEventListener("click", function(){
        var blankEl = new MyElement();
        blankEl.mapValue = "";
        blankEl.actionName = webElement.Button;
        blankEl.prior = "";
        blankEl.id = "";
        blankEl.name = "";
        blankEl.relativeXpathStr = "";
        blankEl.xpathStr = "";
        blankEl.xpaths = [];
        blankEl.cssStr = "";
        blankEl.cssArr = [];
        blankEl.value = "";
        blankEl.title = "";
        blankEl.tag = "";
        blankEl.type = "";
        blankEl.className = "";
        blankEl.frameId = "";
        blankEl.htmlStr = "";
        var blankElArr = [];
        blankElArr.push(blankEl);
        addElementsToTable(blankElArr);
    });
    
    //优先级设置
    var priorConfig = document.getElementById('priorConfig');
    var priorHtml = "<select id='priorConfigSelect' style='height: 34px;'>";
    priorHtml += "<option value='' hidden='hidden'></option>";
    for(var priorIdx=0; priorIdx<PriorArray.length; priorIdx++) {
        if(0 == priorIdx)
            priorHtml += "<option value='" + PriorArray[0] + "'  selected='selected'>" + PriorArray[0] + "</option>";
        else
            priorHtml += "<option value='" + PriorArray[priorIdx] + "'>" + PriorArray[priorIdx] + "</option>";
    }
    priorHtml += "</select>";
    priorConfig.innerHTML = priorHtml;
    var priorConfigSelect = document.getElementById('priorConfigSelect');
    jQuery(priorConfigSelect).change(function(){
        var elesLen = elements.length;
        for(var i=0; i<elesLen; i++){
            elements[i].prior = $(this).children('option:selected').val();
            try {
                var request = {
                    'topic': 'updateElements',
                    'elements': elements,
                    'tabId': chrome.devtools.inspectedWindow.tabId
                  };
                port.postMessage(request);
            } catch(e1) {
                try {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        var request = {
                        'topic': 'updateElements',
                        'elements': elements,
                        'tabId': tabs[0].id
                      };
                    port.postMessage(request);
                    });
                } catch(e2) {
                    console.error(e2);
                }
            }
            
        }
    });
	
	//Add download link listener
	document.querySelector('#xmlLink').addEventListener('click', function(){

		var exportElements = [];
	
        //通过全局数组Elements下载
        for(var i=0; i<elements.length; i++){
            var trElement = new MyElement();
            trElement.mapValue = elements[i].mapValue ? elements[i].mapValue : "";
            trElement.actionName = elements[i].actionName ? elements[i].actionName : "";
            trElement.prior = elements[i].prior ? elements[i].prior : PriorArray[0];
            trElement.id = elements[i].id ? elements[i].id : "";
            trElement.name = elements[i].name ? elements[i].name : "";
            trElement.relativeXpathStr = elements[i].relativeXpathStr ? elements[i].relativeXpathStr : "";
            trElement.xpathStr = elements[i].xpathStr ? elements[i].xpathStr : "";
            trElement.xpaths = elements[i].xpaths.length > 0 ? elements[i].xpaths[0].xpath : "";
            trElement.cssStr = elements[i].cssStr ? elements[i].cssStr : "";
            trElement.value = elements[i].value ? elements[i].value : "";
            trElement.title = elements[i].title ? elements[i].title : "";
            trElement.tag = elements[i].tag ? elements[i].tag : "";
            trElement.type = elements[i].type ? elements[i].type : "";
            trElement.className = elements[i].className ? elements[i].className : "";
            trElement.frameId = elements[i].frameId ? elements[i].frameId : "";
            trElement.htmlStr = elements[i].htmlStr ? elements[i].htmlStr : "";
            exportElements.push(trElement);
        }
        
		var fileType = '.xml';
		var filename = document.querySelector('#pageName').value ? document.querySelector('#pageName').value + fileType : 'myPage' + fileType;
//		alert('filename=' + filename);
        //canvert exportElements[] to xml
		var xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\r\n<pom pagename="'+ filename.replace(fileType, '') + '">\r\n';
//        alert('jsonContent=' + xmlStr);
		exportElements.forEach(function(trElement, trIndex){
			xmlStr += '\t<element>\r\n\t\t<MapValue>';
			xmlStr += trElement.mapValue.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</MapValue>\r\n';
			xmlStr += '\t\t<ObjectType>';
			xmlStr += trElement.actionName.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</ObjectType>\r\n';
            xmlStr += '\t\t<Prior>';
			xmlStr += trElement.prior;
			xmlStr += '</Prior>\r\n';
			xmlStr += '\t\t<Id>';
			xmlStr += trElement.id;
			xmlStr += '</Id>\r\n';
			xmlStr += '\t\t<Name>';
			xmlStr += trElement.name;
			xmlStr += '</Name>\r\n';
			xmlStr += '\t\t<SimpleXpath>';
			xmlStr += trElement.relativeXpathStr.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</SimpleXpath>\r\n';
			xmlStr += '\t\t<Xpath>';
			xmlStr += trElement.xpathStr.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</Xpath>\r\n';
            xmlStr += '\t\t<OtherXpaths>';
			xmlStr += trElement.xpaths.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</OtherXpaths>\r\n';
			xmlStr += '\t\t<CssStr>';
			xmlStr += trElement.cssStr.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</CssStr>\r\n';
			xmlStr += '\t\t<Value>';
			xmlStr += trElement.value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</Value>\r\n';
            xmlStr += '\t\t<Title>';
			xmlStr += trElement.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</Title>\r\n';
			xmlStr += '\t\t<Tag>';
			xmlStr += trElement.tag;
			xmlStr += '</Tag>\r\n';
			xmlStr += '\t\t<Type>';
			xmlStr += trElement.type;
			xmlStr += '</Type>\r\n';
            xmlStr += '\t\t<Class>';
			xmlStr += trElement.className;
			xmlStr += '</Class>\r\n';
			xmlStr += '\t\t<IframeId>';
			xmlStr += trElement.frameId;
			xmlStr += '</IframeId>\r\n';
			xmlStr += '\t\t<ElementHtml>';
			xmlStr += trElement.htmlStr.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
			xmlStr += '</ElementHtml>\r\n';
			xmlStr += '\t</element>\r\n';
			console.log('xmlStr=' + xmlStr);
		});
		xmlStr += '</pom>';
//		alert('jsonContent=' + xmlStr);

		downloadFile('#xmlLink', filename, xmlStr);
	});
    
    //download yaml file by button
    document.querySelector("#exprotYaml").addEventListener("click", function(){
        var exportElements = [];
        var re = /\"/g;
        var downloadFlag = true;
        var e = new Error();
        
//        //test
//        var ele = GetPomLib.getNewMyElementObj();
//        ele.actionName = "Button";
//        ele.mapValue = "aaaa";
//        ele.prior = "id";
//        elements.push(ele);
	
        //通过全局数组Elements下载
        if(elements.length == 0) return;
        for(var i=0; i<elements.length; i++){
            var trElement = GetPomLib.getNewMyElementObj();
            trElement.mapValue = elements[i].mapValue ? elements[i].mapValue : "";
            trElement.actionName = elements[i].actionName ? elements[i].actionName : "";
            trElement.prior = elements[i].prior ? elements[i].prior : PriorArray[0];
            trElement.id = elements[i].id ? elements[i].id : "";
            trElement.name = elements[i].name ? elements[i].name : "";
            trElement.relativeXpathStr = elements[i].relativeXpathStr ? elements[i].relativeXpathStr.replace(re, '\\\"') : "";
            trElement.xpathStr = elements[i].xpathStr ? elements[i].xpathStr.replace(re, '\\\"') : "";
            trElement.xpaths = elements[i].xpaths.length > 0 ? elements[i].xpaths[0].xpath.replace(re, '\\\"') : "";
//            trElement.cssStr = elements[i].cssStr ? elements[i].cssStr : "";
            trElement.cssArr = elements[i].cssArr.length > 0 ? elements[i].cssArr[0].css.replace(re, '\\\"') : "";
            trElement.value = elements[i].value ? elements[i].value : "";
            trElement.title = elements[i].title ? elements[i].title : "";
            trElement.tag = elements[i].tag ? elements[i].tag : "";
            trElement.type = elements[i].type ? elements[i].type : "";
            trElement.className = elements[i].className ? elements[i].className : "";
            trElement.frameId = elements[i].frameId ? elements[i].frameId : "";
            trElement.htmlStr = elements[i].htmlStr ? elements[i].htmlStr : "";
            
            exportElements.push(trElement);
        }
        
        var flagContainer = false;
		var fileType = '.yaml';
        var inputFilename = document.querySelector('#pageName').value;
        var filename = "";
        if(!inputFilename) {
            filename = 'myPage' + fileType;
        } else {
            if(inputFilename.length > fileType.length && ".yaml" == inputFilename.substring(inputFilename.length - fileType.length).toLowerCase()) {
                filename = inputFilename;
            } else {
                filename = inputFilename + fileType;
            }
        }

        var baseClass = "com.lanhd.selion.testcomponents.BasicPageImpl";
        var local = "US";
        var yamlStr = 'baseClass: "'+ baseClass + '"\r\n';
        //yamlStr += 'pageTitle:' + '\r\n' + getIndentation(1) + local + ': "' + filename + '"' + '\r\n';
        yamlStr += 'elements:' + '\r\n';
        
        let basicIndentationNum = 1,
            offsetIndentationNum = 0;
        
        try{
            exportElements.forEach(function(trElement, trIndex){
                
                if(trElement.mapValue == "" || trElement.mapValue == "undefined") {
                    downloadFlag = false;
                    e.message = "[MapValue] is required.";
                    throw e;
                }
                if(trElement.actionName == "" || trElement.actionName == "undefined") {
                    downloadFlag = false;
                    e.message = "[ObjectType] is required.";
                    throw e;
                }
                
                if(trElement.actionName.trim() === "Container") {
                    if(flagContainer) {
                        flagContainer = false;
                    } else {
                        yamlStr += getIndentation(1) + trElement.mapValue.trim().replace(" ","") + trElement.actionName.trim() + ':\r\n';
                        yamlStr += getIndentation(2) + 'iframe:\r\n';
                        
                        if(trIndex < exportElements.length - 1) {
                            yamlStr += getIndentation(3) + local + ': "' + exportElements[trIndex].frameId + '"\r\n';
                        } else {
                            yamlStr += getIndentation(3) + local + ': ""\r\n';
                        }
                        
                        yamlStr += getIndentation(2) + 'locators:\r\n';
                        yamlStr += getIndentation(3) + local + ': "//*"\r\n';
                        yamlStr += getIndentation(2) + 'containerElements:\r\n';

                        flagContainer = true;
                    } 
                } else {
                    if(flagContainer) {
                        yamlStr = appendElementToYaml(yamlStr, local, trElement, trIndex, 1, 2);
                    } else {
                        yamlStr = appendElementToYaml(yamlStr, local, trElement, trIndex, 1, 0);
                    }
                }
                
            });
        } catch(err) {
            alert(err.message);
        }

        if(downloadFlag) {
            var uri = 'data:text/x-yaml;charset=utf-8,' + encodeURIComponent(yamlStr);
            var download_link = document.createElement('a');
            download_link.href = uri;
            download_link.download = filename;
            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);
        }
    },false);

    
    //Open And Read File
//    var oenfilediv = document.getElementById("Display-xml");
    var encoding = "utf-8";
    $("#openfile").change(function(){
        var input = $(this);
        if(window.FileReader){
            var file = input.get(0).files[0];
            if(!file) return;
            var filename = file.name.split(".")[0];
            var filetype = file.name.split(".")[1];
            var reader = new FileReader();
            elementsFromXML = [];
            paserFileToHtml(reader, file, filetype, encoding, elementsFromXML);
        }else{
            alert("window.FileReader error.");
        }
     });
	
});


/**
 * 渲染数据,并增加checkbox的事件监听器
 */
function render( request ){
    
    switch(request.topic)
    {
        case "render":
        	elements = request.elements;                   //同步panel和contents的elements    
            showElementsInfo(elements);                     //在panel中展示elements
            addTableListener();
        	
            if(request.size > 1 || request.size < 1) {
        		var idx = request.idx;
        		var message = "Input locator:";
        		if(request.size < 1) {
        			message = 'Cant find any elements!!!';
        		} else {
        			message = 'Find two or more elements!!!';
        		}
        		var $this = jQuery($('tr').get(idx+1));	//tr含表头
        		var oldValue = '',
        			fromObject = null;
        		if(request.type == 'xpaths') {
        			oldValue = elements[idx].xpaths[0].xpath;
        			fromObject = $this.find(".xpathArrInput");
        		}
        		if(request.type == 'cssx') {
        			oldValue = elements[idx].cssArr[0].css;
        			fromObject = $this.find(".cssArrInput");
        		}

            	dialog.prompttextarea({
//        			title: "Prompt example",
        			message: message,
        			button: "Save",
//        			required: true,
        			position: "absolute",
        			animation: "slide",
        			value: oldValue,
        			textarea: {
        				cols: "200",
        				rows: "3"
        			},
        			fromObject: fromObject,
        			validate: function(value){
        				if( $.trim(value) === "" ){
        					return false;
        				}
        			},
        			callback: function(fromObj, value){
        				value = value.trim();
//        				var idx = fromObj.parent().parent().parent().children(".indexClass").html();
        				if(value != null && value != oldValue) {
        					$(fromObj).val(value);
        					$(fromObj).trigger("change");
        				}
        			}
        		});
        	}
            
            break;
        case "updateSingleElement":
            
            var selectedRecordIndexArr = [];
            selectedRecordIndexArr = getSelectedRecordIndex();
            
            if(selectedRecordIndexArr.length == 1) {
                //更新元素
                let selectedIndex = selectedRecordIndexArr[0];
                if(elements.length > selectedIndex) {
                    let tempElement = request.elements[0];
                    if(!elements[selectedIndex].mapValue)
                        elements[selectedIndex].mapValue = tempElement.mapValue;
                    if(!elements[selectedIndex].actionName)
                        elements[selectedIndex].actionName = tempElement.actionName;
                    if(!elements[selectedIndex].prior)
                        elements[selectedIndex].prior = tempElement.prior;
                    elements[selectedIndex].className = tempElement.className;
                    elements[selectedIndex].cssStr = tempElement.cssStr;
                    elements[selectedIndex].cssArr = tempElement.cssArr.slice(0);
                    elements[selectedIndex].frameId = tempElement.frameId;
                    elements[selectedIndex].htmlStr = tempElement.htmlStr;
                    elements[selectedIndex].id = tempElement.id;
                    elements[selectedIndex].name = tempElement.name;
                    elements[selectedIndex].relativeXpathStr = tempElement.relativeXpathStr;
                    elements[selectedIndex].tag = tempElement.tag;
                    elements[selectedIndex].title = tempElement.title;
                    elements[selectedIndex].type = tempElement.type;
                    elements[selectedIndex].value = tempElement.value;
                    
                    elements[selectedIndex].xpaths = tempElement.xpaths.slice(0);
                    tempElement.xpaths.length = 0;
                    
                    elements[selectedIndex].xpathStr = tempElement.xpathStr;
                }
            } else {
                //追加元素
                elements = elements.length > 0 ? elements.concat(request.elements) : request.elements;
            }
            try {
                var request = {
                    'topic': 'updateElements',
                    'elements': elements,
                    'tabId': chrome.devtools.inspectedWindow.tabId || 1
                  };
                port.postMessage(request);
            } catch(e1) {
                try {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        var request = {
                            'topic': 'updateElements',
                            'elements': elements,
                            'tabId': tabs[0].id
                          };
                        port.postMessage(request);
                    });
                } catch(e2) {
                    console.error(e2);
                }
            }
            
            break;
    }

}


/**
 * 增加table的事件监听器,包括:checkbox,Highlight
 */
function addTableListener(){
    
    //checkbox:点击table表头多选框按钮，全选或取消全选
    var allCheckBox = document.getElementById('allCheckBox');
    var checkBox = document.getElementsByName('checkBox');

    if(allCheckBox){
        allCheckBox.addEventListener("click", function(e){
            if(allCheckBox.checked){
                for(var i=0; i<checkBox.length; i++){
                    if(checkBox[i].type == "checkbox") checkBox[i].checked = true;
                }
            }else{
                for(var i=0; i<checkBox.length; i++){
                    if(checkBox[i].type == "checkbox") checkBox[i].checked = false;
                }
            }
        });
    }
    

    //通过下拉项为ActionType表格赋值
    var actions = document.getElementsByName('ActionSelect');
    jQuery(actions).each(function(){
         jQuery(this).change(function(){
//             alert($(this).children('option:selected').val() + "," + $(this).siblings("span")[0].innerHTML);
             $(this).siblings("span")[0].innerHTML = $(this).children('option:selected').val();
         });
     });
    
    //通过下拉项为PriorSelect表格赋值
    var priors = document.getElementsByName('PriorSelect');
    jQuery(priors).each(function(){
         jQuery(this).change(function(){
//             alert($(this).children('option:selected').val() + "," + $(this).siblings("span")[0].innerHTML);
             $(this).siblings("span")[0].innerHTML = $(this).children('option:selected').val();
         });
     });
    
    //通过下拉项为Xpaths表格赋值
    var tdXpaths = document.getElementsByName('XpathsSelect');
    jQuery(tdXpaths).each(function(){
         jQuery(this).change(function(){
             $(this).siblings("input")[0].value = $(this).children('option:selected').val();
         });
     });
    
    //通过下拉项为CssArray表格赋值
    var tdCssArr = document.getElementsByName('CssArrSelect');
    jQuery(tdCssArr).each(function(){
         jQuery(this).change(function(){
             $(this).siblings("input")[0].value = $(this).children('option:selected').val();
         });
     });
    
    $(document).on("dblclick", ".xpathArrInput,.cssArrInput", function(event) {
    	
    	var oldValue = jQuery(this).val();
    	var message = "Input locator:";
    	
    	dialog.prompttextarea({
//			title: "Prompt example",
			message: message,
			button: "Save",
//			required: true,
			position: "absolute",
			animation: "slide",
			value: oldValue,
			textarea: {
				cols: "200",
				rows: "3"
			},
			fromObject: jQuery(this),
			validate: function(value){
				if( $.trim(value) === "" ){
					return false;
				}
			},
			callback: function(fromObj, value){
				value = value.trim();
				var idx = fromObj.parent().parent().parent().children(".indexClass").html();
				if(value != null && value != oldValue) {
					fromObj.val(value);
					$(fromObj).trigger("change");
				}
			}
		});
    	JSON.parse(event);	//错误，中断
    });
    
    //table内容改变
    var ableEditTd = document.querySelectorAll(".ableEdit");
    var editColCount = 5;   //可编辑的列数
    jQuery(ableEditTd).each(function(){
        jQuery(this).change(function(){
        	
            switch($(this).index()){
                case 2:
                    elements[Math.floor(($(this).index(".ableEdit"))/editColCount)].mapValue = $(this).get(0).children[0].children[0].value;
 
                    try {
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            var request = {
                                'topic': 'updateElements',
                                'elements': elements,
                                'type': 'other',			//20180521
                                'idx': -1,
                                'tabId': tabs[0].id
                              };
                            port.postMessage(request);
                        });
                    } catch(e) {
                        console.error(e);
                    }
                    break;
                case 3:
                    elements[Math.floor(($(this).index(".ableEdit"))/editColCount)].actionName = $(this).get(0).children[0].children[1].innerText;

                    try {
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            var request = {
                                'topic': 'updateElements',
                                'elements': elements,
                                'type': 'other',			//20180521
                                'idx': -1,
                                'tabId': tabs[0].id
                              };
                            port.postMessage(request);
                        });
                    } catch(e) {
                        console.error(e);
                    }
                    break;
                case 4:
                    elements[Math.floor(($(this).index(".ableEdit"))/editColCount)].prior = $(this).get(0).children[0].children[1].innerText;

                    try {
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            var request = {
                                'topic': 'updateElements',
                                'elements': elements,
                                'type': 'other',			//20180521
                                'idx': -1,
                                'tabId': tabs[0].id
                              };
                            port.postMessage(request);
                        });
                    } catch(e) {
                        console.error(e);
                    }
                    break;
                case 9:
                     elements[Math.floor(($(this).index(".ableEdit"))/editColCount)].xpaths[0].xpath = $(this).get(0).children[0].children[1].value;

                     var idx = Math.floor(($(this).index(".ableEdit"))/editColCount);
                     try {
                         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                             var request = {
                                 'topic': 'updateElements',
                                 'elements': elements,
                                 'type': 'xpaths',			//20180521
                                 'idx': idx,
                                 'tabId': tabs[0].id
                               };
                             port.postMessage(request);
                         });
                     } catch(e) {
                         console.error(e);
                     }
                    break;
                case 10:
                     elements[Math.floor(($(this).index(".ableEdit"))/editColCount)].cssArr[0].css = $(this).get(0).children[0].children[1].value;

                     var idx = Math.floor(($(this).index(".ableEdit"))/editColCount);
                     try {
                         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                             var request = {
                                 'topic': 'updateElements',
                                 'elements': elements,
                                 'type': 'cssx',			//20180521
                                 'idx': idx,
                                 'tabId': tabs[0].id
                               };
                             port.postMessage(request);
                         });
                     } catch(e) {
                         console.error(e);
                     }
                    break;
            };
            
        });
    });

    
    
    //Highlight
    //鼠标滑过
    $("tr").hover(
        function(e){
//        	$(this).css("background-color", "aquamarine");
//        	$(this).css("background-color", "#EEE9E9");
            var idx = $(this).index(); //当前行序号,表头行序号为0
            if(--idx >= 0){
            	try {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        var request = {
                            'topic': 'highLight',
                            'idx': idx,
                            'type': 'other',				//20180521
                            'tabId': tabs[0].id
                          };
                        port.postMessage(request);
                    });
                } catch(e) {
                    console.error(e);
                }
            }
        },
        function(e){
//        	$(this).css("background-color", "");
        	try {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    var request = {
                        'topic': 'clearHighLight',
                        'tabId': tabs[0].id
                      };
                    port.postMessage(request);
                });
            } catch(e) {
                console.error(e);
            }
        }
    );
    
};


(function(){
    window.dialog.defaultParams.fromObject = null;
    window.dialog.defaultParams.callback = function(obj, value) {};
   	window.dialog.prompttextarea = function(params) {
    	dialog.appendDialogHolder();

		var params = $.extend(true, {}, dialog.defaultParams, params);
		var alertId = dialog.generateRandomId();

		var textareaAttributes = "";
		for (var attribute in params.textarea) {
			textareaAttributes += ' ' + attribute + '="' + params.textarea[attribute] + '" ';
		}

		var newAlert = '<div class="dialog-alert" id="' + alertId + '">';
		newAlert += '<div class="dialog-border"></div>';
		newAlert += '<div class="dialog-title">' + params.title + '</div>';
		newAlert += '<div class="dialog-message">' + params.message + '</div>';
		newAlert += '<label><textarea ' + textareaAttributes + ' >';
		if(params.value != null) {
			newAlert += params.value;
		}
		newAlert += '</textarea></label>';
		newAlert += '<div class="dialog-close">&times;</div>';
		newAlert += '<div class="dialog-confirm">' + params.button + '</div>';
		newAlert += '<div class="dialog-clearFloat"></div>';
		newAlert += '</div>';

		dialog.holder.find("td").append(newAlert);

		var alert = $("#" + alertId);
		var confirm = alert.find(".dialog-confirm");
		var close = alert.find(".dialog-close");
		var textarea = alert.find("textarea");

		if (params.required === true) {
			close.remove();
		}

		alert.attr("data-dialog-position", params.position);
		alert.attr("data-dialog-animation", params.animation);

		dialog.injectDialog();

		confirm.bind("click.dialog", function() {

			var fromObj = params.fromObject;
			var value = textarea.val();
			var isValid = params.validate(value) === false ? false : true;

			if (params.required === true && value === "") {
				isValid = false;
			}

			if (!isValid) {
				alert.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function(e) {
					alert.removeClass("dialog-shaking");
				}).addClass("dialog-shaking");

				return false;
			}
			params.callback(fromObj, value);
		});
		close.one("click.dialog", function() {
			params.callback(null);
		});
    };
})()