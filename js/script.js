$(document).ready (function(){
  $("#alertDelivery").hide();
  $("#alertRound").hide();
});


function insertGame(){
  $.ajax({
      type: "POST",
      dataType: "text",
      url: "insert.php",
      data: {
        func: "insertGame",
        doz: $("#dozent").val()
      },
      success: function(data) {
        $("#gameUrl").html("Die Spiel-ID lautet: " + data.toString());
      },
      error: function(data) {
        alert("Fehler: "+ data.toString());
      }
    });
}

function insertTeam(){
  localStorage.gameId = $("#gameId").val();
  localStorage.round = 1;
  localStorage.delivery = 1;
	$.ajax({
      type: "POST",
      dataType: "text",
      url: "insert.php",
      data: {
        func: "insertTeam",
        teamName: $("#teamName").val(),
		    gameId: $("#gameId").val()
      },
      success: function(data) {
        localStorage.teamId = data;
        window.location.href = "game.html";
      },
      error: function(data) {
        alert("Fehler: "+data.toString());
      }
    });
}

function insertDelivery(){
	pass = parseInt($("#r" + localStorage.delivery + "p").val());
	fail = parseInt($("#r" + localStorage.delivery + "f").val());
	demand = parseInt($("#r" + localStorage.delivery + "d").val());

	$.ajax({
      type: "POST",
      dataType: "text",
      url: "insert.php",
      data: {
        func: "insertDelivery",
        teamId: localStorage.getItem('teamId'),
        round: localStorage.getItem('round'),
        delivery: localStorage.getItem('delivery'),
        demand: demand,
        pass: pass,
        fail: fail,
      },
      success: function(data) {
        $("#alertDelivery").fadeTo(1000, 500).slideUp(500, function(){
          $("#alertDelivery").slideUp(500);
        });
        $("input").prop( "disabled", true)
        addDeliveryRow();
      },
      error: function(data) {
        alert("Fehler: "+data.toString());
      }
    });
}

function addDeliveryRow() {
    localStorage.delivery++
    $('.addBtn').prop('disabled', true);

    var table = document.getElementById("deliveryTable");
    var row = table.insertRow(-1);
    var cellRD = row.insertCell(0);
    var cellRP = row.insertCell(1);
    var cellRF = row.insertCell(2);
    var cellBtn = row.insertCell(3);

    var inputRP = document.createElement("INPUT");
    inputRP.setAttribute("type", "text");
    inputRP.setAttribute("id", "r" + localStorage.delivery + "p");

    var inputRF = document.createElement("INPUT");
    inputRF.setAttribute("type", "text");
    inputRF.setAttribute("id", "r" + localStorage.delivery + "f");

    var inputRT = document.createElement("INPUT");
    inputRT.setAttribute("type", "text");
    inputRT.setAttribute("id", "r" + localStorage.delivery + "d");

    var inputBtn = document.createElement("BUTTON");
    inputBtn.setAttribute("class", "addBtn");
    inputBtn.setAttribute("onclick", "insertDelivery()");
    var text = document.createTextNode("Hinzufügen");
    inputBtn.appendChild(text);

    cellRP.appendChild(inputRP);
    cellRF.appendChild(inputRF);
    cellRD.appendChild(inputRT);
    cellBtn.appendChild(inputBtn);

}

function addRound(){
    $('input[type=text]').val("");
    localStorage.round++;
    localStorage.delivery = 1;
    $("input").prop( "disabled", false);
    $("#deliveryTable").find("tr:gt(1)").remove();
    $('.addBtn').prop('disabled', false);
    $("#roundTitle").html("Runde " + localStorage.round);
    $("#alertRound").fadeTo(1000, 500).slideUp(500, function(){
    $("#alertRound").slideUp(500);
    });
}
