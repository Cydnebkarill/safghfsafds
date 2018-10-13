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
	$sql = "INSERT INTO game (dozent) VALUES ('$doz')";
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
	$sql = "INSERT INTO team (name, gameId) VALUES ('$team', '$gameId')";
	writeToDB($con, $sql);
	mysqli_close($con);
}

function insertDelivery(){
	$con = mysqli_connect(HOST,USER,PASS,DB);
	// Check connection
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	$teamId = $_POST['teamId'];
	$actualRound = $_POST['round'];
	$delivery = $_POST['delivery'];
	$demand = $_POST['demand'];
	$pass = $_POST['pass'];
	$fail = $_POST['fail'];

	$sql = "INSERT INTO delivery (teamId, actualRound, delivery, demand, pass, fail)
	VALUES ('$teamId', '$actualRound', '$delivery', '$demand', '$pass', '$fail')";
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
