<?php

define('HOST','localhost');
define('USER','web375');
define('PASS','@m!vNO18m');
define('DB','usr_web375_5');

switch ($_POST['func']){
	case 'insertGame': insertGame();
	break;
}


mysqli_close($con);
}
?>

