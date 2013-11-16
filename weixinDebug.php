<?php
header("Content-Type:text/xml");
$msgData = json_decode($_POST['data'],true);

class Weixin{
    public function __construct($param){
        $this->url = $param['url'];
        $this->token = $param['token'];
        $this->toUser = $param['toUser'];
        $this->fromUser = $param['fromUser'];
    }

    private function makeMsg($data){    
        $header = "<xml>
                    <ToUserName><![CDATA[".$this->toUser."]]></ToUserName>
                    <FromUserName><![CDATA[".$this->fromUser."]]></FromUserName>
                    <CreateTime>".time()."</CreateTime>
                    <MsgType><![CDATA[".$data['msgType']."]]></MsgType>";
        switch( $data['msgType'] ){
            case 'text':
                $content = "<Content><![CDATA[".$data['content']."]]></Content>";
                break;
        }
        $footer = "<MsgId>1234567890123456</MsgId>
                    </xml>";
        return $header . $content . $footer;
    }
    public function send($data){
        $rst = $this->makeMsg($data);

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
        return $tmpInfo; // 返回数据     
    }
}

$Wx = new Weixin( $msgData['param'] );
$rst = $Wx->send( $msgData['info'] );

echo $rst;

?>
