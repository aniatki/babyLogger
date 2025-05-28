document.addEventListener('DOMContentLoaded', () => {
    const feedBtn = document.getElementById('feedBtn');
    const sleepBtn = document.getElementById('sleepBtn');
    const cryBtn = document.getElementById('cryBtn');
    const crampsBtn = document.getElementById('crampsBtn');
    const gasBtn = document.getElementById('gasBtn');
    const stoolBtn = document.getElementById('stoolBtn');
    const diaperBtn = document.getElementById('diaperBtn'); // New Diaper button
    const milkInput = document.getElementById('milkInput');
    const activityTableBody = document.querySelector('#activityTable tbody');
    const activityTimeInput = document.getElementById('activityTime');
    const resetTimeBtn = document.getElementById('resetTimeBtn');

    let activities = [];

    // Function to format a Date object for the datetime-local input
    // This will correctly set the input to the user's local time.
    const formatDateTimeLocal = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Set the initial time input to the current local time
    const setActivityTimeToNow = () => {
        const now = new Date();
        now.setSeconds(0); // Clear seconds for cleaner display
        now.setMilliseconds(0); // Clear milliseconds
        activityTimeInput.value = formatDateTimeLocal(now);
    };

    // Load activities from localStorage
    const loadActivities = () => {
        const storedActivities = localStorage.getItem('newbornActivities');
        if (storedActivities) {
            activities = JSON.parse(storedActivities);
            // Ensure timestamps are numbers if they were strings from storage
            activities.forEach(activity => {
                if (typeof activity.timestamp === 'string') {
                    activity.timestamp = parseInt(activity.timestamp);
                }
            });
        }
    };

    // Save activities to localStorage
    const saveActivities = () => {
        localStorage.setItem('newbornActivities', JSON.stringify(activities));
    };

    // Function to get the time and date for logging
    const getLogDateTime = () => {
        let dateToLog;
        const inputTime = activityTimeInput.value;

        if (inputTime) {
            // If user provided a time, use it. Date will be parsed correctly as local.
            dateToLog = new Date(inputTime);
        } else {
            // Otherwise, use the current time
            dateToLog = new Date();
        }

        return {
            // Format for display: e.g., "May 28, 2025, 06:13 PM"
            display: dateToLog.toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: dateToLog.getTime()
        };
    };

    // Function to render activities in the table
    const renderActivities = () => {
        activityTableBody.innerHTML = ''; // Clear existing entries
        // Sort activities in reverse chronological order
        const sortedActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp);

        sortedActivities.forEach(activity => {
            const newRow = activityTableBody.insertRow();
            const timeCell = newRow.insertCell();
            const activityCell = newRow.insertCell();
            const detailsCell = newRow.insertCell();

            timeCell.textContent = activity.time; // This is the 'display' time (now includes date)
            activityCell.textContent = activity.type;
            detailsCell.textContent = activity.details || '';
        });
    };

    // Initialize: Set current time and load/render activities
    setActivityTimeToNow();
    loadActivities();
    renderActivities();

    // Event listener for Reset Time button
    resetTimeBtn.addEventListener('click', setActivityTimeToNow);

    // Event listener for Feed button
    feedBtn.addEventListener('click', () => {
        const milkAmount = milkInput.value.trim();
        if (milkAmount === '' || isNaN(milkAmount) || parseInt(milkAmount) <= 0) {
            alert('Please enter a valid milk amount in ml.');
            return;
        }
        const { display: dateTimeDisplay, timestamp } = getLogDateTime();
        activities.push({
            type: 'Fed',
            details: `${milkAmount}ml`,
            time: dateTimeDisplay,
            timestamp: timestamp
        });
        milkInput.value = ''; // Clear input after logging
        saveActivities(); // Save to localStorage
        renderActivities();
        setActivityTimeToNow(); // Reset time input after logging
    });

    // Universal logging function for other activities
    const logActivity = (type, details = '') => {
        const { display: dateTimeDisplay, timestamp } = getLogDateTime();
        activities.push({
            type: type,
            details: details,
            time: dateTimeDisplay,
            timestamp: timestamp
        });
        saveActivities();
        renderActivities();
        setActivityTimeToNow(); // Reset time input after logging
    };

    // Event listeners for new and existing buttons
    sleepBtn.addEventListener('click', () => logActivity('Slept'));
    cryBtn.addEventListener('click', () => logActivity('Cried'));
    crampsBtn.addEventListener('click', () => logActivity('Cramps'));
    gasBtn.addEventListener('click', () => logActivity('Gas'));
    stoolBtn.addEventListener('click', () => logActivity('Stool'));
    diaperBtn.addEventListener('click', () => logActivity('Diaper Change')); // New Diaper event listener
});
