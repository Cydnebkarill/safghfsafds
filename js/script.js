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
      },
      error: function(data) {
        alert("Fehler"+data);
      }
    });
}
