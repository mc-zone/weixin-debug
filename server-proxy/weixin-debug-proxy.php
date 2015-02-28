<?php
header("Content-Type:text/xml");
$data = json_decode($_POST['data'],true);
$Wx = new Weixin( $data );
$rst = $Wx->send();
echo $rst;

class Weixin{
    public function __construct($data){
        $this->url = $data["url"];
        $this->token = $data["token"];
        $this->data = $data;
    }

    private function makeMsg(){    
        $msg = $this->data['data'];
        $xml = $this->xmlItemPack("xml",$msg);
        $xmlDoc = new SimpleXMLElement( $xml );
        return $xmlDoc->asXML();
    }

    public function xmlItemPack($k,$v){
        $head = "<".$k.">";
        $foot = "</".$k.">";
        if( is_string($v) ){
            $tpl = $head."<![CDATA[".$v."]]>".$foot;
        }else if( is_numeric($v) ){
            $tpl = $head.$v.$foot;
        }else if( is_array($v) ){
            $stpl = "";
            foreach($v as $kk=>$vv){
                $stpl .= $this->xmlItemPack( ( is_int($kk) ? $k : $kk ), $vv );
            }
            if( is_int($kk) ){
                $tpl = $stpl;
            }else{
                $tpl = $head.$stpl.$foot;
            }
        }
        return $tpl;
    }
    private function makeSignature($timestamp,$nonce){
      $token = $this->token;
      $tmpArr = array($token, $timestamp, $nonce);
      sort($tmpArr, SORT_STRING);
      $signature = implode( $tmpArr );
      $signature = sha1( $signature );
      return $signature;
    }

    public function send(){
        $msg = $this->makeMsg();

        $timestamp = time();
        $nonce = mt_rand(10000,99999);
        $signature = $this->makeSignature($timestamp,$nonce);

        $url = trim( $this->url,"#?\t\s\n" );
        $query = "timestamp=".$timestamp."&nonce=".$nonce."&signature=".$signature;
        $urlParse = parse_url($url);
        if( !empty($urlParse['query']) && strpos($url,'?') !== false ){
            $url .= ("&".$query);
        }else{
            $url .= ("?".$query);
        }

        $curl = curl_init(); // 启动一个CURL会话      
        curl_setopt($curl, CURLOPT_URL, $url); // 要访问的地址                  
        curl_setopt($curl, CURLOPT_HEADER, 0); //返回header部分
        curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/xml"));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); //返回字符串，而非直接输出
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // 模拟用户使用的浏览器      
        curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求      
        curl_setopt($curl, CURLOPT_POSTFIELDS, $msg); // Post提交的数据包      
        curl_setopt($curl, CURLOPT_TIMEOUT, 30); // 设置超时限制防止死循环      
        $tmpInfo = curl_exec($curl); // 执行操作      
        curl_close($curl); // 关键CURL会话      
        $tmpInfo = str_replace('<?xml version="1.0"?>','',$tmpInfo);
        return $tmpInfo; // 返回数据     

    }
}

?>
