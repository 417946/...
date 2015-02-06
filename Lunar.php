<?
include('Lunar.class.php');
//获取传过来的参数
$year=$_GET['year'];
$month=$_GET['month'];
$day=$_GET['day'];
$msg=$_GET['msg'];

function arrayRecursive(&$array, $function, $apply_to_keys_also = false)
{
    static $recursive_counter = 0;
    if (++$recursive_counter > 1000) {
        die('possible deep recursion attack'); 
    }
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            arrayRecursive($array[$key], $function, $apply_to_keys_also); 
        } else {
            $array[$key] = $function($value);
        }
        if ($apply_to_keys_also && is_string($key)) { 
            $new_key = $function($key);
            if ($new_key != $key) {
                $array[$new_key] = $array[$key];
                unset($array[$key]);
            }
        }
    }
    $recursive_counter--;
}


function JSON($array) { 
    arrayRecursive($array, 'urlencode', true);

    $json = json_encode($array);

    return urldecode($json);

}


if($msg==0){
	//阳历转阴历
	$lunar = new Lunar();
	$date = $lunar->convertSolarToLunar($year,$month,$day);  
	//print_r($date);
   // echo $php_json=json_encode($date);
    echo $php_json=JSON($date);
}else if($msg==1){
	//阴历转阳历
	$lunar = new Lunar();
	$date = $lunar->convertLunarToSolar($year,$month,$day); 
	//print_r($date);
	echo $php_json=JSON($date);
}
?>