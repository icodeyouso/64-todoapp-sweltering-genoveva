var date;
var tasksPending;

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

function parseTime(time) {
  var hours;
  var minutes;
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

function deleteItem() {
  var element = $(this).parent().parent().parent().parent();
  var id = parseInt(element[0].id);


  $.ajax({
    type: "DELETE",
    url: "api/todos/" + id,
    success: function (result) {

      tasksPending--;
      $(".tasks-pending").html(tasksPending + " tasks pending");
      element.slideUp("fast", function () {
        $(this).remove();
        sortItems();
      });
    }
  });
}

function getItem (id, callback) {
  $.ajax({
    type: "GET",
    url: "api/todos/" + id,
    success: callback
  });
}

function updateItem (id, data, callback) {
  $.ajax({
    type: "PUT",
    url: "api/todos/" + id,
    data: data,
    success: callback
  });
}

function toggleChecked (domElement) {
  if (domElement.className == "checked-off") {
    domElement.className = "";
    tasksPending++;
  }
  else {
    domElement.className="checked-off";
    tasksPending--;
  }
  $(".tasks-pending").html(tasksPending + " tasks pending");
}

function sortItems() {
  // Get array of item ids
  var items = [];
  var elements = $('#sortable').children().toArray();
  for(var i = 0; i < elements.length; i++) {
    items.push(elements[i].id);
  }

  // Update items in order.
  // Make position of item = array index;
  $.each(items, function (index, value) {
    // Get item to be sorted
    getItem(value, function (result) {
      // Change item's position
      var data = result.data;
      data.position = index;

      // Update item
      updateItem (value, data, function () {
        console.log("Item " + value + " has been updated with position " + index);
      });
    });
  });
}

function completeTask () {
  var element = $(this).parent().parent().parent().parent();
  var id = parseInt(element[0].id);
  var element = this;

  getItem(id, function (result) {
    var data = result.data;
    data.done = !data.done;

    $.ajax({
      type: "PUT",
      url: "api/todos/" + id,
      data: data,
      success: function () {
        toggleChecked($(element).siblings()[1]);
      }
    });

  });
}

function editItem() {
  var element = $(this).parent().parent().parent();
  var itemText = $(this).parent().parent().children().children().find("span");
  var itemDoTime = $(this).parent().parent().children().children();
  var id = parseInt(element[0].id);
  if($("#item").val() && $("#dotime").val()) {
    getItem(id, function (result) {
      // Update data
      var data = result.data;
      data.item = $("#item").val();
      data.dotime = $("#dotime").val();

      updateItem(id, data, function () {
        console.log("Item " + id + " has been updated.");
        itemText.html($("#item").val());
        itemDoTime.toArray()[1].innerHTML = parseTime(parseInt(data.dotime));
      });
    });
  }
  else {
    alert("Edit by putting changes in the fields below. Both fields are required.");
  }
}

function addItem() {
  var data = {
    position: 1000,
    item: $("#item").val(),
    dotime: $("#dotime").val(),
    done: false
  };

  $.ajax({
    type: "POST",
    url: "api/todos",
    data: data,
    success: function (result) {
      var id = parseInt(result.message);

      tasksPending++;
      $(".tasks-pending").html(tasksPending + " tasks pending");
      $('<div class="card" id="' + id + '"><div class="float-right card-block clear-fix"><label><p class="float-left"><a href="javascript:void(0);" class="text-danger delete-item" id="">[-] </a><input class="checkbox" type="checkbox">  <span class="item-display">' + data.item + '</span></p></label><p class="float-right"><span class="do-time">' + parseTime(data.dotime) + '</span> <span class="glyphicon glyphicon-pencil edit-item" aria-hidden="true"></span></p></div></div>').appendTo($('.todos')).hide().slideDown('fast');

      // Add event listeners
      $(".checkbox").off().on("click", completeTask);
      $(".delete-item").off().on("click", deleteItem);
      $(".edit-item").off().on("click", editItem);
      sortItems();
    }
  });
}

function getTodos() {
  var sortedData;

  $(".todos").html("");
  $.getJSON("api/todos", function (result) {
    tasksPending = result.data.length;
    sortedData = result.data.sort(function(a, b) {
      return a.position - b.position;
    });

    $.each(sortedData, function (index, data) {
      var itemDisplayClass;
      var checked;

      if(data.done) {
        itemDisplayClass = "checked-off";
        checked = "checked";
        tasksPending--;
      }
      else {
        itemDisplayClass = "item-display"
        checked = "";
      }

      $(".todos").append('<div class="card" id="' + data.id + '">' +
      '<div class="float-right card-block clear-fix"><label> ' +
      '<p class="float-left">' +
      '<a href="javascript:void(0);" class="text-danger delete-item">[-] </a>' +
      '<input class="checkbox" type="checkbox" ' +
      checked + '> ' + ' <span class="' + itemDisplayClass + '">' + data.item +
      '</span> ' + '</p></label><p class="float-right"> <span class="do-time">' +
      parseTime(data.dotime) +
      '</span><span class="glyphicon glyphicon-pencil edit-item" aria-hidden="true">' +
      '</span></p></div></div>');
    });

    // Update tasksPending
    $(".tasks-pending").html(tasksPending + " tasks pending");

    // Add event listeners
    $(".edit-item").on("click", editItem);
    $(".delete-item").on("click", deleteItem);
    $(".checkbox").on("click", completeTask);
  });

}

$(document).ajaxError(function(event,xhr,options,exc){
    if(xhr.readyState == 4) {
      alert("An error has occurred: " + xhr.status + " || " + xhr.statusText)
    }
    else if(xhr.readyState == 0) {
      alert("Network error! Connection to server refused.");
    }
    else {
      alert("An error has occurred: unknown");
    }
});

$("document").ready(function () {
  date = new Date();
  $(".day").html(getDay());
  $(".date").append(getMonth() + " " + date.getDate());

  // Initial to-do list load
getTodos();

  // Set up listeners
  $("#add-todo").on("click", addItem);

  // Sortable
  $('#sortable').sortable({
			update: function(event, ui) {
        // Update positions in server
        //sortItems($(this).sortable('toArray'));
        sortItems();
			}
		});
});
