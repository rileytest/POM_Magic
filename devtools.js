/*!
  * POM Magic Created&designed by Leiping and Developed by Lanhongdong,tested by Leiping&lanhongdong
 * leiping3333@163.com lanhongdong@126.com
 * Leiping and Lanhongdong reserve all copy right of POM Magic
 *
 * Date: 2017-09-19 T21:10Z
 */

chrome.devtools.panels.create("POM Magic", "images/camera.png", "pom.html", function(panel){
    
    var v_window;
    var v_data = null;
    var port = chrome.extension.connect({name : "pom"});

    port.onMessage.addListener(function( msg ) {
        if ( v_window ) {
            v_window.render( msg );
            
        } else {
            v_data = msg;
        }
    });
    
    //panel显示出来之后绑定事件
    panel.onShown.addListener(function tmp( win ) {
        panel.onShown.removeListener( tmp );
        v_window = win;
        v_window.port = port;
		if(v_data){
			port.postMessage(v_data);
			v_data = null;
		}
        
    });
    
    port.postMessage({
		topic: 'init',
		tabId: chrome.devtools.inspectedWindow.tabId
	});
});