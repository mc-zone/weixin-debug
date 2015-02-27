requirejs.config({
    baseUrl: "lib/",
    paths: {
        jquery:    "jquery-1.9.1.min",
        bootstrap: "bootstrap.min",
        cookie:    "jquery.cookie",
        template:  "template",
        domReady:  "domReady",
    
        WechatSpec: "../scripts/wechat-spec"
    },
     shim:{//插件自动加载
          "bootstrap":["jquery"],
          "cookie":["jquery"]
     }
});
//调用依赖
require(["jquery","template","domReady","WechatSpec","cookie","bootstrap"], function($,template,ready,WechatSpec) {
    var $openID = $("#openID"), 
        $url = $("#url"),
        $token = $("#token"),
        msgType = WechatSpec.msgType;
    
    //msg type choose insert
    var $msgTypeForm = $("#form-msg-type"),
        $msgTypeField = $("<div/>"),
        $msgTypeChoose = null;

    for(var i = 0, j = msgType.length; i < j; i++){
        var group = msgType[i],
            tpl = "";
        for(var ii = 0, jj = group.length; ii < jj; ii++){
            var item = group[ii],
                field = template("msg-type-field",{
                    type:item.name,
                    title:item.title
                });
            tpl += field;
        }
        tpl = "<div class='form-group' >" + tpl + "</div>";
        $msgTypeField.append(tpl);
    }
    $msgTypeField = $msgTypeField.children().appendTo($msgTypeForm);
    $msgTypeChoose = $msgTypeField.find("input[type='radio'][name='msg-type']");

    //type change bindding
    $msgTypeChoose.change(function(e){
        var tar = this,
            type = this.value;
        console.log(type);

    }).triggerHandler("change");
        
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
    var WeixinClass = function(){
        this.verify = {
            url:/^(([A-Za-z]+):)(\/{0,3})([0-9.\-A-Za-z]+)(:(\d+))?(\/([^?#]*))?(\?([^#]*))?(#(.*))?$/
            ,locality:/^\d+(.\d*)?$/
        };       
        this.modal = $("#myModal");
        this.msgCnt = 0;
        this.url = null;
        this.type = "";
    };
    
    WeixinClass.prototype.dataIncomplete = function(name,id){
        this.modal.find(".modal-body h3").text(name+"格式不正确！请填写正确的"+name);
        this.modal.modal();
        $("#"+id).focus();
    };

    WeixinClass.prototype.setSendData = function(){//根据选择设定消息
        var url = $("#url").val();
        if( url !== this.url ){
            if( url == "" || !this.verify.url.test(url) ){
                this.dataIncomplete('url','url');
                return false;
            }else{
                this.url = url;
            }
        }

        var sendData = { 
               url : this.url
              ,token : $("#token").val() 
              ,toUser : $("#openID").val()!=""?$("#openID").val():'Server'
              ,fromUser : $("#user-name").val()==""?"Me":$("#user-name").val()
              ,info :{}
        };
        this.type = $("input[type='radio'][name='msg-type']:checked").val();

        switch( this.type ){
            case 'text':
                var text = $("#content").val();
                if( text == "" ){
                    this.dataIncomplete('信息','content');
                    return false;
                }else{
                    sendData.info.MsgType = 'text'; 
                    sendData.info.Content = text;
                }
                break;
            case 'location':
                var x = $("#location-x").val(),
                    y = $("#location-y").val();
                if( x == "" || !this.verify.locality.test(x) ){
                    this.dataIncomplete('经度数字','location-x');
                    return false;
                }else if( y == "" || !this.verify.locality.test(y) ){
                    this.dataIncomplete('纬度数字','location-y');
                    return false;
                }else{
                    sendData.info.MsgType = 'location'; 
                    sendData.info.Location_X = x;
                    sendData.info.Location_Y = y;
                }
                break;
            case 'subscribe':
                    sendData.info.MsgType = 'event'; 
                    sendData.info.Event = 'subscribe';
                break;
            case 'click':
                    sendData.info.MsgType = 'event'; 
                    sendData.info.Event = 'CLICK';
                    sendData.info.EventKey = $("#event-key").val();
                break;
            case 'voice':
                var reco = $("#Recognition").val();
                if( reco == "" ){
                    this.dataIncomplete('Recognition','reco');
                    return false;
                }else{
                    sendData.info.MsgType = 'voice'; 
                    sendData.info.Recognition = reco;
                }
                break;
         }
        return sendData;
    };

    WeixinClass.prototype.loadXml = function($xmlDoc,key){
        
        var a = $xmlDoc.last().find(key).text();
        return a;
    };
    
    WeixinClass.prototype.htmlEncode = function(s){
        var reg = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        return (typeof s != "string") ? s :s.replace(reg,
        function(a){
            var c = a.charCodeAt(0), r = ["&#"];
            c = (c == 0x20) ? 0xA0 : c;
            r.push(c); r.push(";");
            return r.join("");
        });
    };

    WeixinClass.prototype.pushInfo = function(statu,jqXHR){//状态信息详情推送
        var template = [];
        var date = new Date();
        var id = date.getTime();
        var time = date.getMonth()+1+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        var statuLabel = '<span class="label label-' + (statu == 'success'?'success">Success':'danger">Error') + '</span>';
        var result = "";
        var $tar = $("#accordion");
        var $cnt = $("#msgCnt");
        template[0] = '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
            '<h4 class="panel-title msg-info-title">'+statuLabel;
        template[1] = ' <small>' + time + " 状态：" + jqXHR.status + " " + jqXHR.statusText + 
            '</small></h4>' +
            '<a class="msg-info-show btn btn-link" data-toggle="collapse"  data-toggle="collapse" data-parent="#accordion" href="#collapse'+id+'">查看详情</a>';
        template[2] = '</div>'+
            '<div id="collapse' + id + '" class="panel-collapse collapse">'+
            '<div class="panel-body"><div class="panel-body-inner-wrapper"> <div class="panel-body-inner">';
        template[3] = '<p>readyState:'+jqXHR.readyState + '</p>'+
            '<p>status:' + jqXHR.status + ' ' + jqXHR.statusText + '</p>'+
            '<p>responseText:' + this.htmlEncode( jqXHR.responseText ) + '</p>';
        template[4] = '</div></div></div></div></div>';
        result = template.join(''); 
        $tar.prepend( result );
        $cnt.text( ++this.msgCnt );
    };

    WeixinClass.prototype.getResponse = function(xmlData){//取得回传的数据进行处理
        var $xmlDoc = $(xmlData);
        switch( this.loadXml( $xmlDoc,'MsgType' ) ){
            case 'text':
                this.pushMsgText( this.loadXml( $xmlDoc,'Content'),this.loadXml( $xmlDoc,'FromUserName') ,false);
                break;
            case 'news':
                var $articles = $xmlDoc.find('Articles');

                this.pushMsgNews( $articles,this.loadXml( $xmlDoc,'FromUserName') );
                break;
        }

    };

    WeixinClass.prototype.pushMsgText = function(text,author,isSelf){//消息区推送,文本类
        var $tar = $("#msg-inner");
        var msg = "";
        if( isSelf ){
            msg = "<div class='msg-wrapper-self'>"+
                "<span class='label label-default'>"+
                author+"</span>"+
                "<div class='alert alert-info msg-content'>"+text+"</div></div>";
        }else{
            msg = "<div class='msg-wrapper-server'>"+
                //"<span class='label label-default'>"+
                //author+"</span>"+
                "<div class='alert alert-success msg-content'>"+text+"</div></div>";
        }
        $tar.append(msg);
        $tar.parent().scrollTop($tar.height()-340);//滚动到最底
    };
    
    WeixinClass.prototype.pushMsgNews = function($news,author){//消息区推送,文本类
        var $tar = $("#msg-inner");
        var $items = $news.find('item');
        if( $items.length <= 1 ){
            var html = '<div class="panel panel-default news-single">'+
                '<a href="' + $items.find('Url').text() + '" target="_blank">'+
                '<div class="panel-body"><h4>'+
                $items.find('Title').text() + '</h4>'+
                '<img src="'+ $items.find('PicUrl').text() +'">'+
                '<p class="text-muted">'+ $items.find('Description').text() + '</p>'+
                '</div></a></div>';
            var $rst = $(html);

        }else{
            var $container = $('<div class="panel panel-default news-muti">'+
                    '<div class="panel-body"></div>'+
                    '<ul class="list-group"></ul></div>');
            var $first = $items.first();
            var $firstDom = $('<a href="'+ $first.find('Url').text() +'" target="_blank"><img src="' + $first.find('PicUrl').text() +'"><p>'+ $first.find('Title').text() +'</p></a>');
            $container.find('.panel-body').append($firstDom);

            for(var i=1;i<$items.length-1;i++){
                var $item = $items.eq(i);
                var $tmpDom = $('<li class="list-group-item">'+
                        '<a href="' + $item.find('Url').text() + '" target="_blank">'+
                        '<p>'+ $item.find('Title').text() +'</p>'+
                        '<img src="' + $item.find('PicUrl').text() +'">'+
                        '</a></li>');
                $container.find('ul.list-group').append($tmpDom);
            }
            var $rst = $container;
        }

        var $wrap = $("<div class='msg-wrapper-server'><div class='row'>"+
               "<div class='col-xs-8'><div class='news-content'></div></div></div></div>");
        $wrap.find('.news-content').append($rst).end().appendTo($tar);

        $tar.parent().scrollTop($tar.height());//滚动到最底
    };

    WeixinClass.prototype.send = function( before,callback ){//发送信息
        var sendData = this.setSendData();
        if( sendData === false ) return false;

        switch( this.type ){
            case 'text':
                this.pushMsgText(sendData.info.Content,sendData.fromUser,true);
                break;
            case 'subscribe':
                this.pushMsgText('已推送模拟订阅事件',sendData.fromUser,true);
                break;
            case 'location':
                this.pushMsgText('已发送地址信息',sendData.fromUser,true);
                break;
            case 'voice':
                this.pushMsgText('已发送语音格式信息',sendData.fromUser,true);
                break;
        }

        var that = this;
        $.ajax({
            url:'weixinDebug.php',
            type:'POST',
            dataType:'xml',
            data:{data:JSON.stringify(sendData)},
            beforeSend:function(){
                before();
            },
            success:function(data,statu,jqXHR){//数据合理时(限定于XML)进行的处理
                that.getResponse(data);
                that.pushInfo(statu,jqXHR);//推送详细信息
            },
            error:function(jqXHR,statu,errorThrown){
                      //console.log(jqXHR,statu,errorThrown);
                      that.pushInfo(statu,jqXHR);
                  },
            complete:callback
        });
    };

    return WeixinClass;
}(jQuery));
*/
