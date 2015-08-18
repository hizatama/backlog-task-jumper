/**
 * -- Useful Backlog Project --
 * [01] Backlog Task Jumper
 *
 * @author hizatama
 **/
jQuery(function($){

    // constants ===================================
    var ISSUE_URI = '/view/%PJ_NAME%-%ISSUE_ID%';

    // variables ===================================
    var pjName = ($("#navi-home").attr("href")||"").replace("/projects/",""),
        protocol = location.protocol,
        host = location.hostname;

    var cacheIssues = {},
        issueTimer;

    // exit if can't get projectname
    if(!pjName) return;
  
    // element =====================================
    var btjWrapper = $('<div id="btj-wrapper" style="display:none;position: fixed;top: 0px;left: 50%;margin-left: -200px;z-index: 1001;width: 400px;background-color: rgba(125, 168, 0, 0.77);text-align: center;padding: 10px;box-sizing: border-box;border-radius: 0 0 5px 5px;">').appendTo("body"),
        btjInputBox = $('<input type="number" class="btj-input-box" style="width: 100%;box-sizing: border-box;padding: 7px;">').appendTo(btjWrapper),
        tbjIssueTitle = $('<p id="tbj-issue-title" style="margin-top: 10px;padding: 5px 0;background-color: rgba(249, 248, 227, 0.9);">').appendTo(btjWrapper);
        
    // functions ===================================
    var setIssueUri = function(issueId){
            var str = ISSUE_URI,
                map = {
                    "PJ_NAME":pjName,
                    'ISSUE_ID':issueId
                };
            for(var k in map) {
                str = str.replace("%"+k+"%", map[k], "g");
            }
            return str;
        },
        convertZenkakuNumber = function(num){
            return num.replace(/[０-９]/g, function(s){
                return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
            });
        },
        openBox = function(){
            tbjIssueTitle.text('');
            btjWrapper.stop().slideDown(100);
            btjInputBox.val('').focus();
        },
        closeBox = function(){
            btjWrapper.slideUp(100);
            btjInputBox.blur();
        },
        isValidIssueId = function(issueId) {
            return (/^[\d]+$/.test(issueId) && issueId > 0);
        },
        issueUrl = function(issueId) {
            return protocol+"//"+host+setIssueUri(issueId);
        },
        openIssue = function(issueId, newWindow) {
            issueId = convertZenkakuNumber(issueId);
            if(!isValidIssueId(issueId)){
                closeBox();
                return false;
            }
            if(newWindow) {
                window.open(issueUrl(issueId));
                closeBox();
            } else {
                location.href = issueUrl(issueId);
            }
        },
        setIssueSummary = function(issueId) {
            tbjIssueTitle.text('');
            issueId = convertZenkakuNumber(issueId);
            if(!isValidIssueId(issueId)){
                return false;
            }
            if(cacheIssues[issueId] !== undefined){
                var issue = cacheIssues[issueId];
                tbjIssueTitle.html(issue.type + issue.title);
                return false;
            }
            var issueTitle = issueType = '';
            $.ajax({
                url : issueUrl(issueId), 
                success: function(data){
                    var issuecard = $('#issuecard', data);
                    issueType = $('.key .issue-type-name', issuecard).get(0).outerHTML;
                    issueTitle = $('.summary span', issuecard).text();
                },
                complete : function(){
                    cacheIssues[issueId] = {
                        'title' : issueTitle,
                        'type' : issueType
                    };
                    tbjIssueTitle.html(issueType + issueTitle);
                }
            });
        },
        setIssueSummary2 = function(issueId){

        }

    // events =========================================
    btjInputBox.on("keydown", function(e){
        switch(e.which) {
            case 27: // Esc
                closeBox();
                return false;
        }
    }).on("keypress", function(e){
        switch(e.which) {
            case 10: 
            case 13: // Enter
                openIssue(this.value, e.ctrlKey);
                return false;
        }
    }).on("keyup", function(e){
        if(issueTimer){
            clearTimeout(issueTimer);
        }
        var tv = this.value;
        issueTimer = setTimeout(function(){
            setIssueSummary(tv);
            issueTimer=null;
        },200);
    });

    $(document).on("keypress", function(e){
        switch(e.which) {
            case 35: // #
                if($.contains(btjWrapper[0], e.target)){
                    closeBox();
                    return false;
                }else if(!$(e.target).is(':input')){
                    openBox();
                    return false;
                }
        }
    }).on("click", function(e){
        if(!$.contains(btjWrapper[0], e.target)) closeBox();
    })
});