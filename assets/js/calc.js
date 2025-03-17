let ovulationDays = [];
let fertileDays = [];
let initialDate = new Date();
let lastDate = new Date();
let fertileStart = new Date();
let fertileEnd = new Date();
let ovulationDate = new Date();

document.getElementById("lastPeriod").addEventListener("change", function() {
  initialDate = new Date(document.getElementById("lastPeriod").value);
  lastDate = new Date(document.getElementById("lastPeriod").value);
});

function calculateOvulation() {
  let cycleLength = parseInt(document.getElementById("cycleLength").value);
  let lastPeriod = new Date(document.getElementById("lastPeriod").value);

  if (!lastPeriod || isNaN(cycleLength) || cycleLength < 21 || cycleLength > 35) {
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
  ovulationDate = new Date(ovulationDays[1]);

  fertileStart.setDate(ovulationDate.getDate() - 5);
  fertileEnd.setDate(ovulationDate.getDate() + 1);
  document.getElementById("result").innerHTML = `
                Nächsten Fruchtbare Tage: vom <strong>${fertileStart.toLocaleDateString("de-DE")}</strong> bis 
                <strong>${fertileEnd.toLocaleDateString("de-DE")}</strong><br>
                Eisprung: <strong>${ovulationDate.toLocaleDateString("de-DE")}</strong>
            `;
}

function generateCalendar() {
  console.log(ovulationDays, fertileDays)
  document.getElementById("result-container").style.display = 'block';
  let calendarDiv = document.getElementById("calendar");
  calendarDiv.innerHTML = "";

  let monthYear = document.getElementById("monthYear");
  monthYear.innerHTML = `${lastDate.getFullYear()} <span>${lastDate.toLocaleString('de-DE', { month: 'long' })}</span>`;

  let calendar = document.createElement("table");
  calendar.style.width = "100%";
  calendar.style.borderCollapse = "collapse";

  let date = new Date(lastDate);
  date.setDate(1);
  let firstDay = date.getDay();
  let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  let prevMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  let row = document.createElement("tr");

  for (let i = firstDay - 1; i >= 0; i--) {
    let cell = document.createElement("td");
    cell.textContent = prevMonthDays - i;
    cell.classList.add("prev-next-month");
    row.appendChild(cell);
  }
  let fertileFirstDay = true;
  for (let i = 1; i <= daysInMonth; i++) {
    let cell = document.createElement("td");
    let currentDateObj = new Date(date.getFullYear(), date.getMonth(), i);
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
    row.appendChild(cell);
  }

  calendar.appendChild(row);
  calendarDiv.appendChild(calendar);
}

function changeMonth(offset) {
  lastDate.setMonth(lastDate.getMonth() + offset);
  document.getElementById("prev-month").style.visibility = lastDate.getMonth() >= initialDate.getMonth() ? 'visible' : 'hidden' ;
  document.getElementById("next-month").style.visibility = lastDate.getMonth() < initialDate.getMonth() + 5 ? 'visible' : 'hidden' ;

  generateCalendar();
}
