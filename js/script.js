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
         alert(data);
         $("#gameUrl").val("Die Spiel-ID lautet: " + data.toString());
      },
      error: function(data) {
        alert("Fehler: "+ data.toString());
      }
    });
}

function insertTeam(){
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
		 localStorage.round = 1;
     localStorage.delivery = 1;
		 window.location.href = "game.html";
      },
      error: function(data) {
        alert("Fehler: "+data.toString());
      }
    });
}

function insertRound(){

  $.ajax({
      type: "POST",
      dataType: "text",
      url: "insert.php",
      data: {
        func: "insertRound",
        teamId: localStorage.teamId,
		    round: localStorage.round
      },
      success: function(data) {
         localStorage.roundId = data;
		     $('#roundTitle').html("Runde "+localStorage.round);
      },
      error: function(data) {
        alert("Fehler: "+data.toString());
      }
    });
}

function insertDelivery(){
	pass = parseInt($("#r" + localStorage.delivery + "p").val());
	fail = parseInt($("#r" + localStorage.delivery + "f").val());
	demand = pass + fail;
	$("#r" + localStorage.delivery + "t").val(demand);

	$.ajax({
      type: "POST",
      dataType: "text",
      url: "insert.php",
      data: {
        func: "insertDelivery",
		roundId: localStorage.getItem('roundId'),
		pass: pass,
		fail: fail,
		demand: demand
      },
      success: function(data) {
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
    var cellRP = row.insertCell(0);
    var cellRF = row.insertCell(1);
    var cellRT = row.insertCell(2);
    var cellBtn = row.insertCell(3);

    var inputRP = document.createElement("INPUT");
    inputRP.setAttribute("type", "text");
    inputRP.setAttribute("id", "r" + localStorage.delivery + "p");

    var inputRF = document.createElement("INPUT");
    inputRF.setAttribute("type", "text");
    inputRF.setAttribute("id", "r" + localStorage.delivery + "f");

    var inputRT = document.createElement("INPUT");
    inputRT.setAttribute("type", "text");
    inputRT.setAttribute("id", "r" + localStorage.delivery + "t");
    inputRT.setAttribute("disabled", "disabled");

    var inputBtn = document.createElement("BUTTON");
    inputBtn.setAttribute("class", "addBtn");
    inputBtn.setAttribute("onclick", "insertDelivery()");
    var text = document.createTextNode("Hinzufügen");
    inputBtn.appendChild(text);

    cellRP.appendChild(inputRP);
    cellRF.appendChild(inputRF);
    cellRT.appendChild(inputRT);
    cellBtn.appendChild(inputBtn);

}

function addRound(){
    $('input[type=text]').val("");
    localStorage.round++;
    location.reload();
}
