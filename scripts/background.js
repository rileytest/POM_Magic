/*!
 * POM Magic v0.2.7  Created by Leiping and Developed by Lanhongdong,tested by Leiping&lanhongdong
 * leiping3333@163.com lanhongdong@126.com

 * Copyright 2017 and other contributors
 * Released under the MIT license
 *
 * Date: 2017-09-19 T21:10Z
 */


var ports = {};
var isClickElExist = false; //右键是否找到元素的标志

chrome.contextMenus.create({"title": "Get POM","contexts":["all"], "onclick": getPOM});

const cModeVisible 	= 0;
const cModeEntire  	= 1;
const cModeSelected = 2;
const cModeBrowser 	= 3;

var shortcutProcessing = false;
var fPluginInited = false;
var isDebug = true;
var extensionId = chrome.i18n.getMessage('@@extension_id');


function getPOM(info, tab) {
	if (tab.id in ports) {
		var inspectedId = tab.id;
        isClickElExist = false;
        chrome.tabs.executeScript(inspectedId, {
            file: "scripts/getpomlib.js",
            allFrames: true
        }, function() {
            if(!isClickElExist) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    injectListenerAndJsFile(tabs[0].id);
                    alert("Please get element again.");
                });
            }
        });
	}else{
		alert(chrome.i18n.getMessage( 'noPanel' ));
	}
}

function log(msg) 
{
    if (isDebug) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var request = {
                'topic': 'debug',
                'detail': msg
            };
            chrome.tabs.sendMessage(tabs[0].id, request, function(response) {});
        }); 
    }
}

function injectListenerAndJsFile(tabid)
{
    chrome.tabs.executeScript(tabid, {
        code: "document.addEventListener(\"contextmenu\", function(event) {clickedEl = event.target || event.srcElement;}, true);",
        allFrames: true
    }, null);
    
    ["scripts/getpomlib.js", "scripts/utils.js", "scripts/getElements.js", "scripts/cross-origin.js"].map(function(f) {
        chrome.tabs.executeScript(tabid, {
            file: f,
            allFrames: true
        }, null);
    });
}

function enableHotkey(fEnable)
{
	if (fEnable) 
		setTimeout(function() {
			shortcutProcessing = false;
		}, 500);
	else
		shortcutProcessing = true;
}

function getPlugin()
{
	var p = document.getElementById("fsplugin");
	if (!fPluginInited)
	{
		fPluginInited = true;
		p.useCallback(pluginEvent);
		p.launchFunction("setAddonVersion", extVersion, "", "");
	}
	
	return p;
}

function pluginCommand(cmd, param1, param2, param3)
{
	try
	{
		if (param2 == undefined)
			return getPlugin().launchFunction(cmd, JSON.stringify(param1));
		else
			return getPlugin().launchFunction(cmd, param1, param2, param3);
	}
	catch (e) 
	{
		logToConsole(e.message);
		return false;
	}
}

function logToConsole(data)
{
	if (isDebug)
		console.log(data);
}

chrome.extension.onMessage.addListener(function( request, sender, response ){
    
    var msg = request;
  	var Mode = 2;
  	switch(msg.topic)
		{
			case "initSelectedDone": 
                enableHotkey(true);
				
				switch (Mode)
				{
						case cModeVisible	:
						case cModeEntire	: 
							pluginCommand("captureInit", {}); 
							chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
								chrome.tabs.sendMessage(tabs[0].id, {topic: "scrollNext"}, function(response) {});
							});
							break;
						case cModeSelected	: 
							pluginCommand("captureInit", {}); 
							chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
								chrome.tabs.sendMessage(tabs[0].id, {topic: "selectArea"}, function(response) {});
							});
							break;
						case cModeBrowser	: 
							chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
								chrome.tabs.sendMessage(tabs[0].id, {topic: "scrollNext"}, function(response) {});
							});
							break;
				}
			break;
			case "areaSelected": 
//				elements = msg.elements;
                //传值给 panel
                var tabId = sender.tab.id;
                if (tabId in ports) {
//                    var request = {
//                        'topic': 'render',
//                        'elements': elements
//                      };
                	request.topic = 'render';
                    ports[ tabId ].postMessage(request);
                }
			break;
            
            case "getSingleElement": 
                //传值给panel，获取列表记录，若有已勾选单个记录（多记录勾选则提示），则更新该记录；没有则向列表追加记录。
                var tabId = sender.tab.id;
                if (tabId in ports) {
                    var request = {
                        'topic': 'updateSingleElement',
                        'elements': msg.elements
                      };
                    ports[ tabId ].postMessage(request);
                }
                isClickElExist = true;
			break;
                
            case "cross-origin-result": 
                var tabId = sender.tab.id;
                if (tabId in ports) {
                    var request = {
                        'topic': 'updateSingleElement',
                        'elements': JSON.parse(msg.elements)
                      };
                    ports[ tabId ].postMessage(request);
                }
			break;
		}
    
    
    
})

//接受devtools.panel连接Port，绑定Port消息响应
chrome.extension.onConnect.addListener(function(port) {
    if ( port.name !== "pom" ){
        return;
    }

    var extensionListener = function( msg, sender, sendResponse ) {
        
		if ( msg.topic === "init" ) {
			ports[ msg.tabId ] = port;
		}else if ( msg.topic === "initSelected" ) {
            var inspectedId = msg.tabId;
            //传递消息给content script
            chrome.tabs.sendMessage(inspectedId, msg, function(response) {

            });
        }else if ( msg.topic === "selectArea" ) {
            var inspectedId = msg.tabId;
//            chrome.tabs.executeScript(inspectedId, script);
            //传递消息给content script
            chrome.tabs.sendMessage(inspectedId, msg, function(response) {

            });
        }else if ( msg.topic === "updateElements" ) {
            var inspectedId = msg.tabId;
            //传递消息给content script
            chrome.tabs.sendMessage(inspectedId, msg, function(response) {

            });
        }else if ( msg.topic === "highLight" ) {
            var inspectedId = msg.tabId;
            //传递消息给content script
            chrome.tabs.sendMessage(inspectedId, msg, function(response) {

            });
        }else if ( msg.topic === "clearHighLight" ) {
            var inspectedId = msg.tabId;
            //传递消息给content script
            chrome.tabs.sendMessage(inspectedId, msg, function(response) {

            });
        }else{
			port.postMessage(msg);
		}
    }
	
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function( port ) {
        port.onMessage.removeListener(extensionListener);
		
		for( var id in ports ){
			if (ports[ id ] == port) {
				delete ports[ id ];
				break;
			}
		}
    });

    port.onMessage.addListener(extensionListener);
});


chrome.tabs.onUpdated.addListener(function(tabid, info, tab) {

    if("complete" == info.status || undefined == info.status) {
        injectListenerAndJsFile(tabid);
    }
    
});

chrome.tabs.onActivated.addListener(function(tabid, info, tab) {
    if("complete" == info.status  || undefined == info.status) {
        injectListenerAndJsFile(tabid);
    }
});

