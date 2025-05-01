var objecttype_behavior = '';

(function() {
    chrome.storage.sync.get(['objecttype_behavior'], function(items) {
        objecttype_behavior = items.objecttype_behavior;
        initObjecttypeBehavior(objecttype_behavior);
    });
})(jQuery)

document.addEventListener("DOMContentLoaded", function(){
    
    chrome.storage.sync.get(["objecttype"], function(items) {
        if(items.objecttype) {
            document.getElementById("objecttype").value = items.objecttype;
        } else if(items.objecttype == undefined) {
            document.getElementById("objecttype").value = defaultObjecttypeValue;
            updateOptions(defaultObjecttypeValue);
        } else {
            document.getElementById("objecttype").value = "";
        }
    });
    
    $(document).on("click", "#save", function() {
        let objecttypeValue = document.getElementById("objecttype").value;
        chrome.storage.sync.set({'objecttype': objecttypeValue}, function() {
            updateOptions(objecttypeValue);
            alert('OK.');
        });
    });
    
    var $ObjectType_TABLE =$('#objecttypeTable');
    
    $(document).on("click", "#objecttypeTable-add", function() {
        let tr = '<tr><td id="objecttype_list" class="ObjectType" contenteditable="true">';
        tr += actionNameToHtml(webElement.Button);
        tr += '</td><td contenteditable="true">';
        tr += '';
        tr += '</td><td contenteditable="true">';
        tr += '';
        tr += '</td><td contenteditable="true">';
        tr += '';
        tr += '</td><td contenteditable="true">';
        tr += '';
        tr += '</td><td contenteditable="true">';
        tr += '';
        tr += '</td><td><span class="objecttypeTable-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span></td></tr>';
        
        $ObjectType_TABLE.append($(tr));
    });
    
    $(document).on("click", ".objecttypeTable-remove", function() {
        $(this).parents('tr').detach();
        $("#objecttypeTable-save").trigger("click");
    });
    
    //通过下啦项为ObjectType表格赋值
    $(document).on("click", ".ActionSelect", function() {
        jQuery(this).change(function() {
            var ele = $(this).children('option:selected');
            $(this).siblings("span")[0].innerHTML = $(this).children("option:selected").val();
        });
    });
    
    $(document).on("click", "#objecttypeTable-save", function () {
        var $rows = $ObjectType_TABLE.find('tr:not(:hidden)');
        var headers = [];
        var data = [];
        
        // Get the headers (add special header logic here)
        $($rows.toArray().shift()).find('th:not(:empty)').each(function() {
            headers.push($(this).text().toLowerCase().replace('*', ''));
        });
        
        //Turn all existing rows into a loopable array
        $rows.each(function() {
            var $td = $(this).find('td');
            var h = {};
            
            if($td.length > 0 && $td.eq(0).text() && $td.eq(0).text() != '') {
                // Use the headers from earlier to nae our hash keys
                headers.forEach(function(header, i) {
                    if(0 == i) {
                        h[header] = $td.find('span').html();
                    } else {
                        var temp = $td.eq(i).text();
                        h[header] = temp ? temp.trim() : temp;
                    }
                });
                data.push(h);
            }
        });
        
        var objecttype_behavior_json = '';
        if(data.length > 0) {
            objecttype_behavior_json = JSON.stringify(data);
        }
        chrome.storage.sync.set({'objecttype_behavior': objecttype_behavior_json}, function() {
            objecttype_behavior_value = objecttype_behavior_json;
            alert('OK.');
        });
    });
    
});

function initObjecttypeBehavior(objecttype_behavior_json) {
    
    if(!objecttype_behavior_json || 0 == objecttype_behavior_json.length) return;
    
    let temp = '',
        objecttype_behavior_arr = JSON.parse(objecttype_behavior_json);
    
    for(let idx = 0; idx < objecttype_behavior_arr.length; idx++) {
        let tr = '<tr><td id="objecttype_list" class="ObjectType" contenteditable="true">';
        tr += actionNameToHtml(objecttype_behavior_arr[idx]['objecttype']);
        tr += '</td><td contenteditable="true">';
        tr += objecttype_behavior_arr[idx]['tag'];
        tr += '</td><td contenteditable="true">';
        tr += objecttype_behavior_arr[idx]['type'];
        tr += '</td><td contenteditable="true">';
        tr += objecttype_behavior_arr[idx]['class'];
        tr += '</td><td contenteditable="true">';
        tr += objecttype_behavior_arr[idx]['attributename'];
        tr += '</td><td contenteditable="true">';
        tr += objecttype_behavior_arr[idx]['attributevalue'];
        tr += '</td><td><span class="objecttypeTable-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span></td></tr>';
        temp += tr;
    }
    $('#objecttypeTable').append($(temp));
}

function actionNameToHtml(selectActionValue){
    var strHtml = "<div class='classActionTypeDiv'><select class='ActionSelect'>";
    let keys = Object.keys(webElement);
    let keysLen = keys.length;
    for(let i = 0; i < keysLen; i++) {
        if(selectActionValue == keys[i]) {
            strHtml += "<option value='" + webElement[keys[i]] + "'  selected='selected'>" + webElement[keys[i]] + "</option>";
        } else {
            strHtml += "<option value='" + webElement[keys[i]] + "'>" + webElement[keys[i]] + "</option>";
        }
    }
    if(selectActionValue && keysLen > 0) {
        strHtml += '</select><span hidden="hidden">' + selectActionValue + '</span></div>';
    } else {
        strHtml += '</select><span hidden="hidden"></span></div>';
    }
    return strHtml;
}