define([],function(){

    var self = {};

    self.infoDefault = {
        MediaId:"1234567890123456",
        MsgId:"1234567890123456",
        Location_X:"39.90923",
        Location_Y:"116.397428",
        PicMd5Sum:"e10adc3949ba59abbe56e057f20f883e"
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
                PicUrl:{ type:"text", title:"图片地址", holder:"PicUrl", defaults:"http://mat1.gtimg.com/www/images/qq2012/qqlogo_1x.png", required:true },
                MediaId:{ type:"text", title:"MediaId", holder:"MediaId", defaults:self.infoDefault.MediaId }
            }
        },
        {
            name:"voice",
            title: "语音",
            field:{
                Recognition:{ type:"text", title:"识别字段", holder:"Recognition(可省略)", defaults:"" },
                MediaId:{ type:"text", title:"MediaId", holder:"MediaId", defaults:self.infoDefault.MediaId },
                Format:{
                    type:"radio",
                    title:"格式",
                    options:[
                        {
                            title:"amr",
                            checked:true,
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
            field:{
                MediaId:{ type:"text", title:"MediaId", holder:"MediaId", defaults:self.infoDefault.MediaId },
                ThumbMediaId:{ type:"text", title:"ThumbMediaId", holder:"ThumbMediaId", defaults:self.infoDefault.MediaId }
            }
        },
        {
            name:"location",
            title: "位置",
            field:{
                Location_X:{ type:"text", title:"Location_X", holder:"Location_X", defaults:self.infoDefault.Location_X, required:true },
                Location_Y:{ type:"text", title:"Location_Y", holder:"Location_Y", defaults:self.infoDefault.Location_Y, required:true },
                Scale:{ type:"text", title:"Scale", holder:"Scale", defaults:"20" },
                Label:{ type:"text", title:"位置信息", holder:"Label", defaults:"" }
            }
        },
        {
            name:"link",
            title: "链接",
            field:{
                Title:{ type:"text", title:"Title", holder:"Title", defaults:"", required:true },
                Description:{ type:"text", title:"Description", holder:"Description", defaults:"" },
                Url:{ type:"text", title:"Url", holder:"Url", defaults:"http://www.qq.com", required:true }
            }
        }
    ];
    self.msgType[1] = [
        {
            name:"subscribe",
            title: "关注事件",
            MsgType:"event",
            field:{
                EventKey:{ type:"text", title:"EventKey", holder:"扫码关注的事件Key(qrscene_xxx 可省略)", defaults:"" },
                Ticket:{ type:"text", title:"Ticket", holder:"扫码关注的Ticket(可省略)", defaults:"TICKET" }
            }
        },
        {
            name:"SCAN",
            title: "参数二维码扫描(已关注)",
            MsgType:"event",
            field:{
                EventKey:{ type:"text", title:"EventKey", holder:"扫码关注的事件Key", defaults:"", required:true },
                Ticket:{ type:"text", title:"Ticket", holder:"扫码关注的Ticket", defaults:"TICKET" }
            }
        },
        {
            name:"LOCATION",
            title: "地理位置上报",
            MsgType:"event",
            field:{
                Latitude:{ type:"text", title:"Latitude", holder:"纬度", defaults:self.infoDefault.Location_X, required:true },
                Longitude:{ type:"text", title:"Longitude", holder:"经度", defaults:self.infoDefault.Location_Y, required:true },
                Precision:{ type:"text", title:"Precision", holder:"精度", defaults:"119.385040", required:true }
            }
        }
    ];
    self.msgType[2] = [
        {
            name:"CLICK",
            title: "菜单click",
            MsgType:"event",
            field:{
                EventKey:{ type:"text", title:"EventKey", holder:"EventKey", defaults:"", required:true }
            }
        },
        {
            name:"VIEW",
            title: "菜单view",
            MsgType:"event",
            field:{
                EventKey:{ type:"text", title:"EventKey", holder:"EventKey", defaults:"", required:true }
            }
        },
        {
            name:"scancode",
            title: "菜单扫码",
            MsgType:"event",
            field:{
                EventKey:{ type:"text", title:"EventKey", holder:"EventKey", defaults:"", required:true },
                ScanResult:{ type:"text", title:"ScanResult", holder:"扫描结果字段", defaults:"2", required:true },
                Event:{
                    type:"radio",
                    title:"事件类型",
                    options:[
                        {title:"扫码推送",value:"scancode_push",checked:true},
                        {title:"扫码推送+提示",value:"scancode_waitmsg"}
                    ]
                }
            }
        },
        {
            name:"pic",
            title: "菜单选图",
            MsgType:"event",
            field:{
                EventKey:{ type:"text", title:"EventKey", holder:"EventKey", defaults:"" },
                
                Count:{ type:"text", title:"图片数量", holder:"Count", defaults:"1" },
                PicMd5Sum:{ type:"text", title:"图片MD5(多个用|隔开)", holder:"MD5", defaults:"" },
                Event:{
                    type:"radio",
                    title:"事件类型",
                    options:[
                        {title:"系统拍照",value:"pic_sysphoto",checked:true},
                        {title:"拍照或相册",value:"pic_photo_or_album"},
                        {title:"微信相册",value:"pic_weixin"}
                    ]
                }
            }
        },
        {
            name:"location_select",
            title: "菜单选位置",
            MsgType:"event",
            field:{
                Location_X:{ type:"text", title:"Location_X", holder:"Location_X", defaults:self.infoDefault.Location_X },
                Location_Y:{ type:"text", title:"Location_Y", holder:"Location_Y", defaults:self.infoDefault.Location_Y },
                Scale:{ type:"text", title:"Scale", holder:"精度", defaults:"20" },
                Label:{ type:"text", title:"Label", holder:"文字信息", defaults:"" },
                Poiname:{ type:"text", title:"朋友圈Poiname", holder:"可为空", defaults:"" }
            }
        }
    ];

    return self;
});
