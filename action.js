var Weixin = (function($){
    var WeixinClass = function(){//{{{
        this.verify = {
            url:/^(([A-Za-z]+):)(\/{0,3})([0-9.\-A-Za-z]+)(:(\d+))?(\/([^?#]*))?(\?([^#]*))?(#(.*))?$/
            ,locality:/^\d+(.\d*)?$/
        };       
        this.modal = $("#myModal");
        this.msgCnt = 0;
        this.url = null;
        this.type = "";
    };//}}}
    
    WeixinClass.prototype.dataIncomplete = function(name,id){//{{{
        this.modal.find(".modal-body h3").text(name+"格式不正确！请填写正确的"+name);
        this.modal.modal();
        $("#"+id).focus();
    };//}}}

    WeixinClass.prototype.setSendData = function(){//根据选择设定消息//{{{
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
              ,toUser : 'Server'
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
        }
        return sendData;
    };//}}}

    WeixinClass.prototype.loadXml = function($xmlDoc,key){//{{{
        return $xmlDoc.find(key).text();
    };//}}}
    
    WeixinClass.prototype.htmlEncode = function(s){//{{{
        var reg = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        return (typeof s != "string") ? s :s.replace(reg,
        function(a){
            var c = a.charCodeAt(0), r = ["&#"];
            c = (c == 0x20) ? 0xA0 : c;
            r.push(c); r.push(";");
            return r.join("");
        });
    };//}}}

    WeixinClass.prototype.pushInfo = function(statu,jqXHR){//状态信息详情推送//{{{
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
    };//}}}

    WeixinClass.prototype.getResponse = function(xmlData){//取得回传的数据进行处理//{{{
        var $xmlDoc = $(xmlData);
        switch( this.loadXml( $xmlDoc,'MsgType' ) ){
            case 'text':
                this.pushMsgText( this.loadXml( $xmlDoc,'Content'),this.loadXml( $xmlDoc,'FromUserName') ,false);
                break;
        }

    };//}}}

    WeixinClass.prototype.pushMsgText = function(text,author,isSelf){//消息区推送,文本类//{{{
        var $tar = $("#msg-inner");
        var msg = "";
        if( isSelf ){
            msg = "<div class='msg-wrapper-self'>"+
                "<span class='label label-default'>"+
                author+"</span>"+
                "<div class='alert alert-info msg-content'>"+text+"</div></div>";
        }else{
            msg = "<div class='msg-wrapper-server'>"+
                "<span class='label label-default'>"+
                author+"</span>"+
                "<div class='alert alert-success msg-content'>"+text+"</div></div>";
        }
        $tar.append(msg);
        $tar.parent().scrollTop($tar.height()-340);//滚动到最底
    };//}}}

    WeixinClass.prototype.send = function( before,callback ){//发送信息//{{{
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
        }

        var that = this;
        $.ajax({
            url:'weixinDebug.php',
            type:'POST',
            dataType:'xml',
            data:{data:JSON.stringify(sendData)},
            beforeSend:before,
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
    };//}}}

    return WeixinClass;
}(jQuery));
