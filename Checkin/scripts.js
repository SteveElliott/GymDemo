// Initialize sessions from JSON string
function initializeSessions(jsonString) {
    const sessions = JSON.parse(jsonString);

    // Start code For testing to set times for 2 sessions to current and next hours
    const now = new Date();

    // Canada has default format of YYYY-MM-DD.
    const dateFormatter = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const sessionDate = dateFormatter.format(now);

    // For testing use only 2 sessions.
    sessions[0].date = sessionDate;
    sessions[1].date = sessionDate;

    const timeFormatter = new Intl.DateTimeFormat("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    now.setMinutes(0); // Ensure the session id on the hour
    let sessionTime = timeFormatter.format(now);
    sessions[0].time = sessionTime;

    now.setHours(now.getHours() + 1);
    sessionTime = timeFormatter.format(now);
    sessions[1].time = sessionTime;

    localStorage.setItem("gymSessions", JSON.stringify(sessions));
}

// Get sessions from local storage
function getSessions() {
    const sessionsJSON = localStorage.getItem("gymSessions");
    return sessionsJSON ? JSON.parse(sessionsJSON) : [];
}

// Update a session in local storage
function updateSession(updatedSession) {
    const sessions = getSessions();
    const index = sessions.findIndex(
        (s) => s.date === updatedSession.date && s.time === updatedSession.time
    );
    if (index !== -1) {
        sessions[index] = updatedSession;
        localStorage.setItem("gymSessions", JSON.stringify(sessions));
    }
}

// Initialize sessions - Initially 2 sessions which will get the1r date & time set on refresh
const initialJSON = `
  [
  {
      "date": "2024-01-01",
      "time": "01:00",
      "members": [
            {  "name": "Alice", "status": "Booked"}, 
            {  "name": "Anita", "status": "Booked"}, 
            {  "name": "Ash", "status": "Waitlisted"}, 
            {  "name": "Barry", "status": "Booked"}, 
            {  "name": "Beatrice", "status": "Booked"}, 
            {  "name": "Bob", "status": "Booked"}, 
            {  "name": "Boyd", "status": "Booked"}, 
            {  "name": "Charles", "status": "Booked"}, 
            {  "name": "Ellie", "status": "Booked"}, 
            {  "name": "Emma", "status": "Booked"}, 
            {  "name": "Frank", "status": "Booked"}, 
            {  "name": "Georgia", "status": "Booked"}, 
            {  "name": "Harry", "status": "Waitlisted"}, 
            {  "name": "Rebecca", "status": "Booked"}, 
            {  "name": "Steve", "status": "Waitlisted"}, 
            {  "name": "Sue", "status": "Booked"}
     ]
  },
  {
      "date": "2024-01-01",
      "time": "02:00",
      "members": [
            {  "name": "Alice", "status": "Booked"}, 
            {  "name": "Anita", "status": "Booked"}, 
            {  "name": "Ash", "status": "Waitlisted"}, 
            {  "name": "Barry", "status": "Booked"}, 
            {  "name": "Beatrice", "status": "Booked"}, 
            {  "name": "Bob", "status": "Booked"}, 
            {  "name": "Boyd", "status": "Booked"}, 
            {  "name": "Charles", "status": "Booked"}, 
            {  "name": "Ellie", "status": "Booked"}, 
            {  "name": "Emma", "status": "Booked"}, 
            {  "name": "Rebecca", "status": "Booked"}, 
            {  "name": "Steve", "status": "Waitlisted"}, 
            {  "name": "Sue", "status": "Booked"}
     ]
  }
  ]
  `;

function updateDateTime() {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    const formattedDateTime = formatter.format(now);
    document.getElementById("current-datetime").textContent = formattedDateTime;
}

function inSessionCheckinWindow(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    let sessionTime = new Date();
    sessionTime.setHours(hours);
    sessionTime.setMinutes(minutes);

    // Calculate 30 minutes before the given time
    const windowStartTime = new Date(sessionTime.getTime() - 30 * 60 * 1000);
    // Calculate 45 minutes after the given time
    const windowEndTime = new Date(sessionTime.getTime() + 45 * 60000);

    const now = new Date();

    // Check if now is between 30 minutes before and 45 minutes after the given time
    return windowStartTime < now && now < windowEndTime;
}

function formatSessionTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    let sessionTime = new Date();
    sessionTime.setHours(hours);
    sessionTime.setMinutes(minutes);

    const formatter = new Intl.DateTimeFormat("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    return formatter.format(sessionTime);
}

function createTable(rows, cols) {
    // Create the table and its body
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    // Append the tbody to the table
    table.appendChild(tbody);

    // Create rows and cells
    for (let r = 0; r < rows; r++) {
        const row = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('td');
            // cell.textContent = `Row ${r + 1}, Cell ${c + 1}`;
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }

    // Append the table to the body
    document.body.appendChild(table);

    return table;
}

function appendChildToCell(table, rowIndex, colIndex, childElement) {
    // Get the specific row
    const row = table.rows[rowIndex];
    if (row) {
        // Get the specific cell
        const cell = row.cells[colIndex];
        if (cell) {
            // Append the child element to the cell
            cell.appendChild(childElement);
        } else {
            console.error(`Cell at column index ${colIndex} does not exist.`);
        }
    } else {
        console.error(`Row at index ${rowIndex} does not exist.`);
    }
}

function renderSessions() {
    const sessions = getSessions();
    const container = document.getElementById("sessions-container");
    container.innerHTML = "";

    const rows = 5;
    const cols = 4;

    sessions.forEach((session) => {
        if (inSessionCheckinWindow(session.time)) {
            const sessionDiv = document.createElement("div");
            sessionDiv.className = "session";

            const header = document.createElement("div");
            header.className = "session-header";

            const formattedSessionTime = formatSessionTime(session.time);
            header.textContent = `${formattedSessionTime} session`;

            const table = createTable(rows, cols);

            table.insertBefore(header, table.firstChild);

            var memberIndex = 0;

            for (let colIndex = 0; colIndex < cols; colIndex++) {
                for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                    const memberButton = document.createElement("button");
                    memberButton.className = "button";

                    const member = session.members[memberIndex++]; // Undefined if out of bounds

                    if (member == undefined) {
                        var nameSpanTextContent = "________ ";
                        var nameSpanClassName = "invisible";

                        var statusSpanTextContent = "________";
                        var statusSpanClassName = "invisible"
                    } else {
                        var nameSpanTextContent = member.name;
                        var nameSpanClassName = "member-name";

                        var statusSpanTextContent = member.status;
                        var statusSpanClassName = `status ${member.status
                            .toLowerCase()
                            .replace(" ", "-")}`;

                        // Set onclick event
                        memberButton.onclick = () => changeStatus(session, member);
                    }

                    // Create a span for the name
                    const nameSpan = document.createElement("span");
                    nameSpan.textContent = nameSpanTextContent;
                    nameSpan.className = nameSpanClassName;

                    // Create a span for the status
                    const statusSpan = document.createElement("span");
                    statusSpan.textContent = statusSpanTextContent;
                    statusSpan.className = statusSpanClassName;

                    // Append name and status spans to the button
                    memberButton.appendChild(nameSpan);
                    memberButton.appendChild(statusSpan);

                    appendChildToCell(table, rowIndex, colIndex, memberButton)

                }
            };

            sessionDiv.appendChild(table);
            container.appendChild(sessionDiv);
        }
    });
}

// Change member status
function changeStatus(session, member) {
    if (member.status === "Booked") {
        member.status = "Checked in";
        updateSession(session);
        renderSessions();
    }
}

// Initialize sessions and render
initializeSessions(initialJSON);
updateDateTime();
renderSessions();

// Refresh time every minute and re-render sessions
setInterval(() => {
    updateDateTime();
    renderSessions();
}, 60000);
