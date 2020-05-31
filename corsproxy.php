<?php
//The url to send the POST/GET request to
$url = "";

// //The data to send via POST/GET
$fields = array();

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        $url = $_GET["url"];
        foreach ( $_GET as $key => $value) {
            $fields[$key] = $value;
        }
        break;
    default:
        $url = $_POST["url"]; 
        foreach ( $_POST as $key => $value) {
            $fields[$key] = $value;
        }
        break;
}

//url-ify the data for the POST
$fields_string = http_build_query($fields);

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    curl_setopt($ch,CURLOPT_POST, true);
}
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

//So that curl_exec returns the contents of the cURL; rather than echoing it
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

//execute post
$result = curl_exec($ch);
echo $result;
