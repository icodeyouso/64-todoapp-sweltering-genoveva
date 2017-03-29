var date;

function getDay(day) {
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday',
  'Saturday'];
  return days[date.getDay()];
}

function getMonth(month) {
  var months = ['January','February','March','April','May','June','July',
  'August','September','October','November','December'];

  return months[date.getMonth()];
}

function pad (n, width = 2, z = 0)
{
  return (String(z).repeat(width) + String(n)).slice(String(n).length);
}

function populatePage(result) {

}

function parseTime(time) {
  var hours;
  var minutes
  var ampm;

  if(time > 60) {
    hours = Math.floor(time / 60);
    minutes = time % 60;
  }
  else {
    hours = 0;
    minutes = time;
  }
  if(hours < 12)
    ampm = "AM";
  else
    ampm = "PM";
  return pad(hours) + ":" + pad(minutes) + ampm;
}

function getTodos() {
  $.getJSON("api/todos", function (result) {
    $(".tasks-pending").html(result.data.length + " tasks pending");
    $.each(result.data, function (index, data) {
      $(".todos").append('<div class="card"><label><div class="card-block clear-fix"><p class="float-left"><input type="checkbox">  ' + data.item + '</p><p class="float-right">' + parseTime(data.dotime) + '</p></div></label></div>');
    });
  });
}

$("document").ready(function () {
  date = new Date();
  $(".day").html(getDay());
  $(".date").append(getMonth() + " " + date.getDate());

  // Initial to-do list load
getTodos();
});
