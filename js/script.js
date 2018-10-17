$(document).ready (function(){
  $("#alertDelivery").hide();
  $("#alertRound").hide();
});


function insertGame(){
  localStorage.round = 0;
  localStorage.delivery = 1;
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
        localStorage.game = data.toString();
        addRound();
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
    $('td input[type=text]').val("");
    localStorage.round++;
    $("#round").html(localStorage.round);
    localStorage.delivery = 1;
    $("input").prop( "disabled", false);
    $("#deliveryTable").find("tr:gt(1)").remove();
    $('.addBtn').prop('disabled', false);
    $("#roundTitle").html("Runde " + localStorage.round);
    $("#alertRound").fadeTo(1000, 500).slideUp(500, function(){
    $("#alertRound").slideUp(500);
    });
}

function insertDeliveryAmount(){
  deliveryAmount = parseInt($("#deliveryAmount" + localStorage.delivery + "").val());

	$.ajax({
      type: "POST",
      dataType: "text",
      url: "insert.php",
      data: {
        func: "insertDeliveryAmount",
        game: localStorage.getItem('game'),
        aRound: localStorage.getItem('round'),
        delivery: localStorage.getItem('delivery'),
        deliveryAmount: deliveryAmount
      },
      success: function(data) {
        $("#alertDelivery").fadeTo(1000, 500).slideUp(500, function(){
          $("#alertDelivery").slideUp(500);
        });
        $(".inputTable").prop( "disabled", true);
        localStorage.delivery ++;
        addDeliveryRowTeacher();
      },
      error: function(data) {
        alert("Fehler: "+data.toString());
      }
    });
}

function addDeliveryRowTeacher() {
  $('.addBtn').prop('disabled', true);

  var table = document.getElementById("deliveryTable");
  var row = table.insertRow(-1);
  var cellRound = row.insertCell(0);
  var cellDelivery = row.insertCell(1);
  var cellDeliveryAmount = row.insertCell(2);
  var cellBtn = row.insertCell(3);

  var inputRound = document.createElement("LABEL");
  inputRound.setAttribute("id", "game" + localStorage.round + "");
  var text = document.createTextNode(localStorage.round);
  inputRound.appendChild(text);

  var inputDelivery = document.createElement("LABEL");
  inputDelivery.setAttribute("id", "round" + localStorage.delivery + "");
  var text = document.createTextNode(localStorage.delivery);
  inputDelivery.appendChild(text);

  var inputDeliveryAmount = document.createElement("INPUT");
  inputDeliveryAmount.setAttribute("class", "inputTable");
  inputDeliveryAmount.setAttribute("type", "text");
  inputDeliveryAmount.setAttribute("id", "deliveryAmount" + localStorage.delivery + "");

  var inputBtn = document.createElement("BUTTON");
  inputBtn.setAttribute("class", "addBtn");
  inputBtn.setAttribute("onclick", "insertDeliveryAmount()");
  var text = document.createTextNode("Speichern");
  inputBtn.appendChild(text);

  cellRound.appendChild(inputRound);
  cellDelivery.appendChild(inputDelivery);
  cellDeliveryAmount.appendChild(inputDeliveryAmount);
  cellBtn.appendChild(inputBtn);
}


function createChart() {
  var labels = ["january", "february", "march","april","may","june","july"];
  var test2 = [0, 10, 5, 2, 20, 30, 45];

  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: labels,
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: test2,
        }]
    },

    // Configuration options go here
    options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
}

async function postLevel1(){
  const level1 = await getDelivery();
  alert(JSON.stringify(level1));
	for (const s of level1){
		$("#content").append(s[0]);
  }
}

async function getDelivery() {
	return $.ajax({
		type: "POST",
		dataType: "json",
		url: "output.php",
		data: {
			func: "getDelivery"
		}
    });
}