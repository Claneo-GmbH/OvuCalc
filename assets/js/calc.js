let ovulationDays = [];
let fertileDays = [];
let initialDate = new Date();
let lastDate = new Date();

function restrictDateInput(inputId) {
  let dateInput = document.getElementById(inputId);

  let today = new Date();
  let maxDate = today.toISOString().split('T')[0];

  let minDate = new Date();
  minDate.setDate(today.getDate() - 45);
  minDate = minDate.toISOString().split('T')[0];

  dateInput.setAttribute("max", maxDate);
  dateInput.setAttribute("min", minDate);
}

document.addEventListener("DOMContentLoaded", function () {
  restrictDateInput("lastPeriod");
});

document.getElementById("lastPeriod").addEventListener("change", function () {
  initialDate = new Date(document.getElementById("lastPeriod").value);
  lastDate = new Date(document.getElementById("lastPeriod").value);
});

function calculateOvulation() {
  let cycleLength = parseInt(document.getElementById("cycleLength").value);
  let lastPeriod = new Date(document.getElementById("lastPeriod").value);

  if (!lastPeriod || isNaN(cycleLength) || cycleLength < 21 || cycleLength > 45) {
    alert("Bitte geben Sie gültige Daten ein.");
    return;
  }

  ovulationDays = [];
  fertileDays = [];

  let prevPeriod = new Date(lastPeriod);
  prevPeriod.setDate(lastPeriod.getDate());
  let ovulationDate = new Date(prevPeriod);
  ovulationDate.setDate(prevPeriod.getDate() - 14);
  ovulationDays.push(ovulationDate.toISOString().split('T')[0]);

  for (let i = 1; i <= 6; i++) {
    let nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + (cycleLength * i));
    ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(nextPeriod.getDate() - 14);
    ovulationDays.push(ovulationDate.toISOString().split('T')[0]);
  }

  ovulationDays.forEach(d => {
    for (let i = -4; i <= 1; i++) {
      let fertileDay = new Date(d);
      fertileDay.setDate(fertileDay.getDate() + i)
      fertileDays.push(fertileDay.toISOString().split('T')[0]);
    }
  })
  showAnnotation();
  generateCalendar();
}

function showAnnotation() {
  let ovulationDate = new Date(ovulationDays[1]);
  let fertileStart = new Date(ovulationDate);
  let fertileEnd = new Date(ovulationDate);

  fertileStart.setDate(ovulationDate.getDate() - 4);
  fertileEnd.setDate(ovulationDate.getDate() + 1);

  document.getElementById("result").innerHTML = `
<div><div class="f-day"></div><div>Fruchtbare Tage: ${formatDate(fertileStart)} - ${formatDate(fertileEnd)}</div></div>
<div><div class="o-day"></div><div>Voraussichtlicher Eisprung: ${formatDate(ovulationDate)}</div></div>
            `;
}

function formatDate(date) {
  let day = date.getDate().toString().padStart(2, '0');
  let month = date.toLocaleString('de-DE', {month: 'long'});

  return `${day}. ${month}`;
}

function generateCalendar() {
  const currentDate = new Date();
  document.getElementById("prev-month").style.visibility = lastDate.getMonth() === currentDate.getMonth() - 1 ? 'hidden' : 'visible';
  document.getElementById("result-container").style.display = 'block';

  let calendarDiv = document.getElementById("calendar");
  calendarDiv.innerHTML = "";

  let monthYear = document.getElementById("monthYear");
  monthYear.innerHTML = `${lastDate.getFullYear()} <span>${lastDate.toLocaleString('de-DE', {month: 'long'})}</span>`;

  let calendar = document.createElement("table");
  calendar.style.width = "100%";
  calendar.style.borderCollapse = "collapse";

  let date = new Date(lastDate);
  date.setDate(1);
  let firstDay = date.getDay();
  let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  let prevMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  let row = document.createElement("tr");
  let fertileFirstDay = true;

  for (let i = firstDay - 1; i >= 0; i--) {
    let cell = document.createElement("td");
    cell.textContent = prevMonthDays - i;
    cell.classList.add("prev-next-month");

    let prevMonthDateObj = new Date(date.getFullYear(), date.getMonth() - 1, prevMonthDays - i + 1);

    if (fertileDays.includes(prevMonthDateObj.toISOString().split('T')[0])) {
      cell.classList.add(fertileFirstDay ? "fertile-first-day" : "fertile-day");
      fertileFirstDay = false
    }

    row.appendChild(cell);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    let cell = document.createElement("td");
    let currentDateObj = new Date(date.getFullYear(), date.getMonth(), i+1);
    cell.textContent = i;

    if (fertileDays.includes(currentDateObj.toISOString().split('T')[0])) {
      cell.classList.add(fertileFirstDay ? "fertile-first-day" : "fertile-day");
      fertileFirstDay = false
    }

    if (ovulationDays.includes(currentDateObj.toISOString().split('T')[0])) {
      cell.classList.add("ovulation-day");
    }
    row.appendChild(cell);

    if ((firstDay + i) % 7 === 0) {
      calendar.appendChild(row);
      row = document.createElement("tr");
    }
  }

  let remainingCells = 7 - row.children.length;
  for (let i = 1; i <= remainingCells; i++) {
    let cell = document.createElement("td");
    cell.textContent = i;
    cell.classList.add("prev-next-month");

    let nextMonthDateObj = new Date(date.getFullYear(), date.getMonth() + 1, i + 1);

    if (fertileDays.includes(nextMonthDateObj.toISOString().split('T')[0])) {
      cell.classList.add("fertile-day");
      fertileFirstDay = false
    }

    row.appendChild(cell);
  }

  calendar.appendChild(row);
  calendarDiv.appendChild(calendar);
}

function changeMonth(offset) {
  lastDate.setMonth(lastDate.getMonth() + offset);
  document.getElementById("prev-month").style.visibility = lastDate.getMonth() >= initialDate.getMonth() ? 'visible' : 'hidden';
  document.getElementById("next-month").style.visibility = lastDate.getMonth() < initialDate.getMonth() + 5 ? 'visible' : 'hidden';

  generateCalendar();
}
