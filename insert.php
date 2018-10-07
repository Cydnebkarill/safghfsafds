<?php

define('HOST','localhost');
define('USER','root');
define('PASS','');
define('DB','ship');

switch ($_POST['func']){
	case 'insertGame': insertGame();
	break;
	case 'insertTeam': insertTeam();
	break;
	case 'insertRound': insertRound();
	break;
	case 'insertDelivery': insertDelivery();
	break;
}


function insertGame(){
	$con = mysqli_connect(HOST,USER,PASS,DB);
	// Check connection
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	$doz = $_POST['doz'];
	$sql = "INSERT INTO Game (dozent) VALUES ('$doz')";
	writeToDB($con, $sql);
	mysqli_close($con);
}

function insertTeam(){
	$con = mysqli_connect(HOST,USER,PASS,DB);
	// Check connection
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	$gameId = $_POST['gameId'];
	$team = $_POST['teamName'];
	$sql = "INSERT INTO Team (name, game) VALUES ('$team', '$gameId')";
	writeToDB($con, $sql);
	mysqli_close($con);
}

function insertRound(){
	$con = mysqli_connect(HOST,USER,PASS,DB);
	// Check connection
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	$teamId = $_POST['teamId'];
	$round = $_POST['round'];
	$sql = "INSERT INTO Round (round, team) VALUES ('$round', '$teamId')";
	writeToDB($con, $sql);
	mysqli_close($con);
}

function insertDelivery(){
	$con = mysqli_connect(HOST,USER,PASS,DB);
	// Check connection
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	$roundId = $_POST['roundId'];
	$demand = $_POST['demand'];
	$pass = $_POST['pass'];
	$fail = $_POST['fail'];

	$sql = "INSERT INTO Delivery (round, demand, pass, fail) VALUES ('$roundId', '$demand', '$pass', '$fail')";
	writeToDB($con, $sql);
	mysqli_close($con);
}

function writeToDB($con, $sql){
	if(mysqli_query($con,$sql)){
		// Print auto-generated id
		echo mysqli_insert_id($con);
	}
	else{
		echo("Error description: " . mysqli_error($con));
	}
}

?>
