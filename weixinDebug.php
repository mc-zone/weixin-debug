<?php
header("Content-Type:text/xml");
$msgData = json_decode($_POST['data'],true);

class Weixin{
    public function __construct($data){
        $this->url = $data['url'];
        $this->token = $data['token'];
        $this->toUser = $data['toUser'];
        $this->fromUser = $data['fromUser'];
        $this->info = $data['info'];
    }

    private function makeMsg(){    
        $info = $this->info;
        switch( $info['MsgType'] ){
            case 'text':
                $content = "<Content><![CDATA[".$info['Content']."]]></Content>";
                break;
            case 'location':
                $content = "<Location_X><![CDATA[".$info['Location_X']."]]></Location_X>";
                $content .= "<Location_Y><![CDATA[".$info['Location_Y']."]]></Location_Y>";
                break;
            case 'voice':
                $info['Format'] = 'amr';
                $info['MediaId'] = '1';
                $content = "<Recognition><![CDATA[".$info['Recognition']."]]></Recognition>";
                $content .= "<Format><![CDATA[".$info['Format']."]]></Format>";
                $content .= "<MediaId><![CDATA[".$info['MediaId']."]]></MediaId>";
                break;
            case 'event':
                $content = "<Event><![CDATA[".$info['Event']."]]></Event>";
                if( isset($info['Latitude']) && $info['Latitude'] !== "" ){
                    $content .= "<Latitude><![CDATA[".$info['Latitude']."]]></Latitude>";
                }
                if( isset($info['Longitude']) && $info['Longitude'] !== "" ){
                    $content .= "<Longitude><![CDATA[".$info['Longitude']."]]></Longitude>";
                }
                if( isset($info['EventKey']) && $info['EventKey'] !== "" ){
                    $content .= "<EventKey><![CDATA[".$info['EventKey']."]]></EventKey>";
                }
                if( isset($info['Ticket']) && $info['Ticket'] !== "" ){
                    $content .= "<Ticket><![CDATA[".$info['Ticket']."]]></Ticket>";
                }
                break;

        }
        $header = "<xml>
                    <ToUserName><![CDATA[".$this->toUser."]]></ToUserName>
                    <FromUserName><![CDATA[".$this->fromUser."]]></FromUserName>
                    <CreateTime>".time()."</CreateTime>
                    <MsgType><![CDATA[".$info['MsgType']."]]></MsgType>";

        $footer = "<MsgId>1234567890123456</MsgId>
                    </xml>";
        return $header . $content . $footer;
    }
    public function send(){
        $rst = $this->makeMsg();

        $curl = curl_init(); // 启动一个CURL会话      
        curl_setopt($curl, CURLOPT_URL, $this->url); // 要访问的地址                  
        curl_setopt($curl, CURLOPT_HEADER, 0); //返回header部分
        curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/xml"));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); //返回字符串，而非直接输出
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // 模拟用户使用的浏览器      
        curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求      
        curl_setopt($curl, CURLOPT_POSTFIELDS, $rst); // Post提交的数据包      
        curl_setopt($curl, CURLOPT_TIMEOUT, 30); // 设置超时限制防止死循环      
        $tmpInfo = curl_exec($curl); // 执行操作      
        curl_close($curl); // 关键CURL会话      
        $tmpInfo = str_replace('<?xml version="1.0"?>','',$tmpInfo);
        return $tmpInfo; // 返回数据     

    }
}

$Wx = new Weixin( $msgData );
$rst = $Wx->send();
echo $rst;

?>
