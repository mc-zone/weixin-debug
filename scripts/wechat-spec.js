define([],function(){

    var self = {};

    self.infoDefault = {
        MediaId:"1234567890123456",
        MsgId:"1234567890123456"
    };

    self.msgType = [];
    self.msgType[0] = [
        {
            name:"text",
            checked:true,
            title:"文本",
            field:{}
        },
        {
            name:"image",
            title: "图片",
            field:{
                PicUrl:{ type:"text", title:"图片地址", holder:"PicUrl", defaults:"" },
                MediaId:{ type:"text", title:"MediaId", holder:"MediaId", defaults:self.infoDefault.MediaId }
            }
        },
        {
            name:"voice",
            title: "语音",
            field:{
                Recognition:{ type:"text", title:"识别字段", holder:"Recognition(可不写)", defaults:"" },
                MediaId:{ type:"text", title:"MediaId", holder:"MediaId", defaults:self.infoDefault.MediaId },
                Format:{
                    type:"radio",
                    title:"格式",
                    options:[
                        {
                            title:"amr",
                            value:"amr"
                        },
                        {
                            title:"speex",
                            value:"speex"
                        }
                    ]
                }
            }
        },
        {
            name:"video",
            title: "视频",
            field:{}
        },
        {
            name:"location",
            title: "位置",
            field:{}
        },
        {
            name:"link",
            title: "链接",
            field:{}
        }
    ];
    self.msgType[1] = [
        {
            name:"subscribe",
            title: "关注事件",
            field:{}
        },
        {
            name:"scan",
            title: "参数二维码扫描返回",
            field:{}
        },
        {
            name:"location-up",
            title: "地理位置上报",
            field:{}
        }
    ];
    self.msgType[2] = [
        {
            name:"click",
            title: "菜单click",
            field:{}
        },
        {
            name:"view",
            title: "菜单view",
            field:{}
        },
        {
            name:"scancode",
            title: "菜单扫码",
            field:{}
        },
        {
            name:"pic",
            title: "菜单选图",
            field:{}
        },
        {
            name:"location_select",
            title: "菜单选位置",
            field:{}
        }
    ];

    return self;
});
