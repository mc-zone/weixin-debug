define(["jquery"],function($){

    var reg = {
        url:/^(([A-Za-z]+):)(\/{0,3})([0-9.\-A-Za-z]+)(:(\d+))?(\/([^?#]*))?(\?([^#]*))?(#(.*))?$/,
        html: /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
        locality:/^\d+(.\d*)?$/
    };
    var msgCnt = 0;

    var util = {
        loadXml:function($xmlDoc,key){
            return $xmlDoc.last().find(key).text();
        },

        htmlEncode: function(s){
            return (typeof s != "string") ? s :s.replace(reg.html,
                function(a){
                    var c = a.charCodeAt(0), r = ["&#"];
                    c = (c == 0x20) ? 0xA0 : c;
                    r.push(c); r.push(";");
                    return r.join("");
                });
        },

        pushInfo: function(statu,jqXHR){//状态信息详情推送
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
            $cnt.text( ++msgCnt );
        },

        getResponse: function(xmlData){//取得回传的数据进行处理
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

        },

        pushMsgText: function(text,author,isSelf){//消息区推送,文本类
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
        },
    
        pushMsgNews: function($news,author){//消息区推送,文本类
            var $tar = $("#msg-inner");
            var $items = $news.find('item');
            var $rst;
            if( $items.length <= 1 ){
                var html = '<div class="panel panel-default news-single">'+
                    '<a href="' + $items.find('Url').text() + '" target="_blank">'+
                    '<div class="panel-body"><h4>'+
                    $items.find('Title').text() + '</h4>'+
                    '<img src="'+ $items.find('PicUrl').text() +'">'+
                    '<p class="text-muted">'+ $items.find('Description').text() + '</p>'+
                    '</div></a></div>';
                $rst = $(html);

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
                $rst = $container;
            }

            var $wrap = $("<div class='msg-wrapper-server'><div class='row'>"+
                   "<div class='col-xs-8'><div class='news-content'></div></div></div></div>");
            $wrap.find('.news-content').append($rst).end().appendTo($tar);

            $tar.parent().scrollTop($tar.height());//滚动到最底
        },

        beforeSend: function( type,data ){//发送信息
            if( type == "text" ){
                this.pushMsgText(data.Content,data.FromUserName,true);
            }else{
                this.pushMsgText('已发送 '+type+' 格式信息',data.FromUserName,true);
            }
        }
    };

    return util;

});
