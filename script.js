document.addEventListener("DOMContentLoaded", function () {
  var moods = document.querySelectorAll(".mood");
  var logDisplay = document.getElementById("logDisplay");
  var calendarDisplay = document.getElementById("calendarDisplay");

  var moodLogs = localStorage.getItem("moodLogs");
  if (moodLogs) {
    moodLogs = JSON.parse(moodLogs);
  } else {
    moodLogs = [];
  }

  function showLogs(logs) {
    logDisplay.innerHTML = "";
    calendarDisplay.innerHTML = "";
    if (logs.length === 0) {
      logDisplay.innerHTML =
        "No mood logs yet. Click a mood emoji to start logging!";
      return;
    }

    for (var i = 0; i < logs.length; i++) {
      var log = logs[i];
      var div = document.createElement("div");
      div.innerText = "Date: " + log.date + " - Mood: " + log.mood;
      logDisplay.appendChild(div);
    }
  }

  showLogs(moodLogs);

  for (var i = 0; i < moods.length; i++) {
    moods[i].addEventListener("click", function () {
      var mood = this.getAttribute("data-mood");
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        today.getDate().toString().padStart(2, "0");
      var newLog = { date: date, mood: mood };
      moodLogs.push(newLog);
      localStorage.setItem("moodLogs", JSON.stringify(moodLogs));
      showLogs(moodLogs);
    });
  }

  document.getElementById("dayView").addEventListener("click", function () {
    var today = new Date().toISOString().split("T")[0];
    var filteredLogs = moodLogs.filter(function (log) {
      return log.date === today;
    });
    showLogs(filteredLogs);
  });

  document.getElementById("weekView").addEventListener("click", function () {
    var now = new Date();
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    var filteredLogs = moodLogs.filter(function (log) {
      var logDate = new Date(log.date);
      return logDate >= oneWeekAgo;
    });
    showLogs(filteredLogs);
  });

  document.getElementById("monthView").addEventListener("click", function () {
    var now = new Date();
    var filteredLogs = moodLogs.filter(function (log) {
      var logDate = new Date(log.date);
      return (
        logDate.getMonth() === now.getMonth() &&
        logDate.getFullYear() === now.getFullYear()
      );
    });
    showLogs(filteredLogs);
  });

  document.getElementById("allView").addEventListener("click", function () {
    showLogs(moodLogs);
  });

  document
    .getElementById("calendarView")
    .addEventListener("click", function () {
      calendarDisplay.innerHTML = "<h3>Calendar View</h3>";

      var logsByDate = {};
      moodLogs.forEach(function (log) {
        logsByDate[log.date] = log.mood;
      });

      var now = new Date();
      var firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
      var daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();

      var table = document.createElement("table");
      table.className = "calendar-table";
      var headerRow = document.createElement("tr");

      var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      days.forEach(function (day) {
        var th = document.createElement("th");
        th.innerText = day;
        headerRow.appendChild(th);
      });

      table.appendChild(headerRow);

      var row = document.createElement("tr");

      for (var i = 0; i < firstDay; i++) {
        var emptyCell = document.createElement("td");
        row.appendChild(emptyCell);
      }

      for (var day = 1; day <= daysInMonth; day++) {
        if (row.children.length === 7) {
          table.appendChild(row);
          row = document.createElement("tr");
        }

        var cell = document.createElement("td");
        var dateStr =
          now.getFullYear() +
          "-" +
          (now.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          day.toString().padStart(2, "0");

        if (logsByDate[dateStr]) {
          cell.innerText = day + " " + logsByDate[dateStr];
        } else {
          cell.innerText = day;
        }
        row.appendChild(cell);
      }

      if (row.children.length > 0) {
        table.appendChild(row);
      }

      calendarDisplay.appendChild(table);
    });
});
