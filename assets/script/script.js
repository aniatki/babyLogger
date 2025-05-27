document.addEventListener('DOMContentLoaded', () => {
    const feedBtn = document.getElementById('feedBtn');
    const sleepBtn = document.getElementById('sleepBtn');
    const cryBtn = document.getElementById('cryBtn');
    const crampsBtn = document.getElementById('crampsBtn'); // New
    const gasBtn = document.getElementById('gasBtn');       // New
    const stoolBtn = document.getElementById('stoolBtn');   // New
    const milkInput = document.getElementById('milkInput');
    const activityTableBody = document.querySelector('#activityTable tbody');
    const activityTimeInput = document.getElementById('activityTime'); // New
    const resetTimeBtn = document.getElementById('resetTimeBtn'); // New

    let activities = [];

    // Set the initial time input to the current time
    const setActivityTimeToNow = () => {
        const now = new Date();
        now.setSeconds(0); // Clear seconds for cleaner display
        now.setMilliseconds(0); // Clear milliseconds
        activityTimeInput.value = now.toISOString().slice(0, 16); // Format for datetime-local input
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

    // Function to get the time for logging
    const getLogTime = () => {
        const inputTime = activityTimeInput.value;
        if (inputTime) {
            // If user provided a time, use it
            const date = new Date(inputTime);
            return {
                display: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: date.getTime()
            };
        } else {
            // Otherwise, use the current time
            const now = new Date();
            return {
                display: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: now.getTime()
            };
        }
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

            timeCell.textContent = activity.time; // This is the 'display' time
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
        const { display: time, timestamp } = getLogTime();
        activities.push({
            type: 'Fed',
            details: `${milkAmount}ml`,
            time: time,
            timestamp: timestamp
        });
        milkInput.value = ''; // Clear input after logging
        saveActivities(); // Save to localStorage
        renderActivities();
        setActivityTimeToNow(); // Reset time input after logging
    });

    // Universal logging function for other activities
    const logActivity = (type, details = '') => {
        const { display: time, timestamp } = getLogTime();
        activities.push({
            type: type,
            details: details,
            time: time,
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
});
