/**
 * -- Useful Backlog Project --
 * [01] Backlog Task Jumper
 *
 * @author hizatama
 **/
$(function(){

    // constants ===================================
    var TASK_URI = '/view/%PJ_NAME%-%TASK_NUMBER%';

    // variables ===================================
    var pjName = ($("#navi-home").attr("href")||"").replace("/projects/",""),
        protocol = location.protocol,
        host = location.hostname,
        replaceMap = {
            "PJ_NAME":pjName
        };

    // exit if can't get projectname
    if(!pjName) return;

    // element =====================================
    var inputBox = $('<input class="btj-input-box" style="position:fixed;top:0;right:0;z-index:1001;display:none;">').appendTo("body");

    // functions ===================================
    var replaceUri = function(str, map){
            map = $.extend(replaceMap, map);
            for(var k in map) {
                str = str.replace("%"+k+"%", map[k], "g");
            }
            return str;
        },
        convertZenkakuNumber = function(num){
            var map = {"０":0, "１":1, "２":2, "３":3, "４":4, "５":5, "６":6, "７":7, "８":8, "９":9}
            for(var k in map) {
                num = num.replace(k, map[k], "g");
            }
            return num;
        },
        openBox = function(){
            inputBox.val("").show().focus(); 
        },
        closeBox = function(){
            inputBox.blur().hide(300);
        },
        openTask = function(taskNumber) {
            if(!/^[\d０-９]+$/.test(taskNumber)){
                closeBox();
                return false;
            }
            taskNumber = convertZenkakuNumber(taskNumber);
            location.href = protocol+"//"+host+replaceUri(TASK_URI, {"TASK_NUMBER":taskNumber});
        }

    // events =========================================
    inputBox.on("keydown", function(e){
        switch(e.which) {
            case 27: // Esc
                closeBox();
                return false;
            case 13: // Enter
                openTask($(this).val());
                return false;
        }
    });

    $(window).on("keypress", function(e){
        switch(e.which) {
            case 35: // #
                openBox();
                return false;
        }
    })
});