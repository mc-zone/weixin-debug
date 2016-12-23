requirejs.config({
    baseUrl: "lib/",
    paths: {
        jquery:    "jquery-1.9.1.min",
        bootstrap: "bootstrap.min",
        template:  "template",
        domReady:  "domReady",

        formData: "../scripts/form-data",
        receiveHandler: "../scripts/receive-handler"
    },
    shim:{
        "bootstrap":["jquery"]
    }
});
//调用依赖
require(["jquery","template","domReady","formData","receiveHandler","bootstrap"], function($,template,ready,formData,receiveHandler) {
    var $openID = $("#openID"),
        $url = $("#url"),
        $token = $("#token"),
        $fromUser = $("#fromUser"),
        $textInput = $("#content"),
        $sendBtn = $("#send"),
        $modal = $("#myModal"),
        $msgTypeForm = $("#form-msg-type"),
        $msgInfoForm = $("#form-msg-info"),
        msgType = formData.msgType,
        msgTypeCache = {},
        fieldsValueCache = {},
        localStorageKey = "weixin-debug",
        proxyUrl = "server-proxy/weixin-debug-proxy.php",
        //cacheTimeId = -1,
        curType = '';

    //valueCache init
    //TODO 优化更新机制
    if(window.localStorage){
        //load cache
        var storageData = window.localStorage.getItem(localStorageKey);
        if( !!storageData ){
            try{
                fieldsValueCache = JSON.parse(storageData);
            }catch(e){
                window.localStorage.removeItem(localStorageKey);
            }
            //use cache
            if(!$.isEmptyObject(fieldsValueCache) ){
                $("input.need-cache-input").each(function(){
                    var $this = $(this),
                        id = $this.attr('id');
                    if( !!fieldsValueCache[id] ){
                        this.value = fieldsValueCache[id];
                    }
                });
            }
        }
    }

    /* msg type choose insert */
    var $msgTypeField = $("<div/>"),
        $msgTypeChoose = null;
    for(var i = 0, j = msgType.length; i < j; i++){
        var group = msgType[i],
            tpl = "";
        for(var ii = 0, jj = group.length; ii < jj; ii++){
            var item = group[ii],
                html = template("msg-type-radio",{
                    type:item.name,
                    title:item.title,
                    checked:item.checked || null
                });
            tpl += html;
            msgTypeCache[item.name] = item;
        }
        tpl = "<div class='form-group' >" + tpl + "</div>";
        $msgTypeField.append(tpl);
    }
    $msgTypeField = $msgTypeField.children().appendTo($msgTypeForm);
    $msgTypeChoose = $msgTypeField.find("input[type='radio'][name='msg-type']");

    /* msgtype change bindding */
    $msgTypeChoose.change(function(e){
        var tar = this,
            type = this.value;

        typeChangeTrigger(type);
        curType = type;

    }).triggerHandler("change");

    /* fields value change cache */
    $(document).on("input change propertychage",".need-cache-input",function(e){
        var $this = $(this),
            id = $this.attr('id');
        fieldsValueCache[id] = this.value;
        if( e.type == 'change' ){
            updateCache();
        }
    });

    /* send button */
    $sendBtn.click(function(e){
        e.preventDefault();
        if( !curType ){
            return modalInfo("未选择消息类型");
        }
        var ajaxData = {
            url:$url.val(),
            token:$token.val()
        };
        if( ajaxData.url === "" || ajaxData.token === "" ){
            modalInfo("接口信息填写不全，请填写 url 和 token ");
            return false;
        }
        var data = makeSendData(curType);
        if( !data ){
            return false;
        }
        ajaxData.data = data;

        $.ajax({
            url: proxyUrl,
            type:'POST',
            dataType:'xml',
            data:{data:JSON.stringify(ajaxData)},
            beforeSend:function(){
                receiveHandler.beforeSend(curType,data);
            },
            success:function(data,statu,jqXHR){//数据合理时(限定于XML)进行的处理
                //console.log(data,statu,jqXHR);
                receiveHandler.getResponse(data);
                receiveHandler.pushInfo(statu,jqXHR);//推送详细信息
            },
            error:function(jqXHR,statu,errorThrown){
                //console.log(jqXHR,statu,errorThrown);
                receiveHandler.pushInfo(statu,jqXHR);
            }
        });

    });

    /* functions */
    function updateCache(){
        //window.clearTimeout(cacheTimeId);
        if( window.localStorage ){
            window.localStorage.setItem( localStorageKey, JSON.stringify(fieldsValueCache) );
            // cacheTimeId = window.setTimeout(function(){
            //     updateCache();
            // },3*1000);
        }
    }
    function typeChangeTrigger(type){
        var id = "msg-info-" + type,
            $existing = $("#"+id),
            fields = msgTypeCache[type].field;
        //是否禁用text框
        if(type == "text"){
            $textInput.removeAttr('disabled');
        }else{
            $textInput.attr('disabled',true);
        }

        //已载入就显示出来
        $(".msg-info-field").hide();
        if( $existing.length > 0 ){
            $existing.show();
            return ;
        }

        //新的读模板载入
        if( typeof fields === "undefined" ){
            return false;
        }
        var html = "";
        for( var field in fields ){
            html += makeInfoField(type,field,fields[field]);
        }
        if( html !== "" ){
            html = "<div class='row msg-info-field' id='"+id+"'>" + html + "</div>";
            $msgInfoForm.append(html);
        }
    }

    //必要信息表单域
    function makeInfoField(typeName,fieldName,data){
        data.id = "msg-info-" + typeName + "-" + fieldName;
        data.name = fieldName;
        data.value = fieldsValueCache[ data.id ] || data.defaults || "";

        var html = template("msg-info-field",data);
        return html;
    }

    //准备消息内容
    function makeSendData(type){
        var infoMsgId = "msg-info-" + type,
            $infoMsg = $("#"+infoMsgId),
            data = {},
            enterData = {},
            enterComplete = true,
            typeItem = msgTypeCache[type];

        //输入的信息
        $infoMsg.find("input[type='text'], input[type='radio']:checked").each(function(){
            if( $(this).attr("required") && this.value === "" ){
                enterComplete = false;
                return modalInfo( $(this).attr('title')+" 未填写！");
                //$(this).focus();
            }
            enterData[this.name] = this.value;
        });
        if( !enterComplete ){
            return false;
        }

        if( !$textInput.is(":disabled") ){
            enterData.Content = $textInput.val();
            if( !enterData.Content ){
                modalInfo( "请在对话框填写要发送的文本！");
                return false;
            }
        }

        //固定的信息
        data.ToUserName = $openID.val();
        if( data.ToUserName === "" ){
            modalInfo("openID未填写！");
            return false;
        }

        data.MsgType = typeItem.MsgType || type;
        if( data.MsgType == "event" ){
            data.Event = type;
        }
        data.FromUserName = $fromUser.val() === "" ? formData.infoDefault.FromUserName : $fromUser.val();
        data.CreateTime = parseInt( ( +new Date() ).toString().substr(0,10) , 10 );
        data.MsgId = formData.infoDefault.MsgId;

        //合并信息。输入的可以覆盖固定的
        data = $.extend(data,{},enterData);
        //特殊处理
        specialTypeHandle(data,type);
        console.log(data);
        return data;
    }

    function specialTypeHandle(data,type){
        switch( type ){
            case "scancode":
                data.ScanCodeInfo = {
                    ScanType:'qrcode',
                    ScanResult:data.ScanResult
                };
                delete data.ScanResult;
                break;
            case "pic":
                data.SendPicsInfo = {
                    Count:parseInt(data.Count,10),
                    PicList:{
                        item:[]
                    }
                };
                var list = data.PicMd5Sum.split('|');
                for( var i=0;i<data.Count;i++ ){
                    var md5 = list[i] || formData.infoDefault.PicMd5Sum;
                    data.SendPicsInfo.PicList.item[i] = {
                        PicMd5Sum: md5
                    };
                }
                delete data.Count;
                delete data.PicMd5Sum;
                break;
            case "location_select":
                data.SendLocationInfo = {
                    Location_X:data.Location_X,
                    Location_Y:data.Location_Y,
                    Scale:data.Scale,
                    Label:data.Label,
                    Poiname:data.Poiname
                };
                for( var j in data.SendLocationInfo ){
                    if( data.SendLocationInfo.hasOwnProperty(j) && data.hasOwnProperty(j) ){
                        delete data[j];
                    }
                }
                break;
        }

    }

    function modalInfo(text){
        $modal.find(".modal-body h3").text(text);
        $modal.modal('show');
        return false;
    }

    /*
            var Wx = new Weixin();
            $(function(){
                    $("input[type='text']").each(function(){
                        var $this = $(this);
                        var name = $this.attr('id') || $this.attr('name') || $this.index('input');
                        if( $this.val() == "" ){
                            $this.val( $.cookie(name) );
                        }

                        $this.change(function(){
                            $.cookie(name,$(this).val());
                        });
                    });

                    var $radio = $("input[type=radio][name=msg-type]");
                    var typeSwitch = function(type){
                        switch(type){
                        case 'text':
                        $("#content").removeAttr("disabled");
                        $(".location").hide();
                        $(".click").hide();
                        $(".reco").hide();
                        break;
                        case 'subscribe':
                        $("#content").attr("disabled","disabled");
                        $(".location").hide();
                        $(".click").hide();
                        $(".reco").hide();
                        break;
                        case 'location':
                        $("#content").attr("disabled","disabled");
                        $(".location").show();
                        $(".click").hide();
                        $(".reco").hide();
                        break;
                        case 'click':
                        $("#content").attr("disabled","disabled");
                        $(".location").hide();
                        $(".click").show();
                        $(".reco").hide();
                        break;
                        case 'voice':
                        $("#content").attr("disabled","disabled");
                        $(".location").hide();
                        $(".click").hide();
                        $(".reco").show();
                        break;
                        }
                    };
                    $radio.change(function(){
                        typeSwitch($(this).val());
                        });
                    $("#send").click(function(){
                        var $btn = $(this);
                        Wx.send(function(){
                            $btn.addClass('disabled').text("等待..");
                            }
                            ,function(){
                            $btn.removeClass('disabled').text(" 发 送 ");
                            });
                        });

                    $("form").each(function(){
                            $(this).submit(function(event){
                                event.preventDefault();
                                });
                            });

                    //初始设为text类型
                    typeSwitch('text');
            });
*/


});

/*
var Weixin = (function($){
}(jQuery));
*/
