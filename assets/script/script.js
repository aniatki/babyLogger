document.addEventListener('DOMContentLoaded', () => {
    const feedBtn = document.getElementById('feedBtn');
    const sleepBtn = document.getElementById('sleepBtn');
    const cryBtn = document.getElementById('cryBtn');
    const milkInput = document.getElementById('milkInput');
    const activityTableBody = document.querySelector('#activityTable tbody');

    let activities = [];

    // Function to load activities from localStorage
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

    // Function to save activities to localStorage
    const saveActivities = () => {
        localStorage.setItem('newbornActivities', JSON.stringify(activities));
    };

    // Function to get current time in HH:MM format
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
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

            timeCell.textContent = activity.time;
            activityCell.textContent = activity.type;
            detailsCell.textContent = activity.details || '';
        });
    };

    // Load activities when the page loads
    loadActivities();
    renderActivities(); // Render them immediately after loading

    // Event listener for Feed button
    feedBtn.addEventListener('click', () => {
        const milkAmount = milkInput.value.trim();
        if (milkAmount === '' || isNaN(milkAmount) || parseInt(milkAmount) <= 0) {
            alert('Please enter a valid milk amount in ml.');
            return;
        }
        const time = getCurrentTime();
        activities.push({
            type: 'Fed',
            details: `${milkAmount}ml`,
            time: time,
            timestamp: new Date().getTime() // Store timestamp for sorting
        });
        milkInput.value = ''; // Clear input after logging
        saveActivities(); // Save to localStorage
        renderActivities();
    });

    // Event listener for Sleep button
    sleepBtn.addEventListener('click', () => {
        const time = getCurrentTime();
        activities.push({
            type: 'Slept',
            details: '',
            time: time,
            timestamp: new Date().getTime()
        });
        saveActivities(); // Save to localStorage
        renderActivities();
    });

    // Event listener for Cry button
    cryBtn.addEventListener('click', () => {
        const time = getCurrentTime();
        activities.push({
            type: 'Cried',
            details: '',
            time: time,
            timestamp: new Date().getTime()
        });
        saveActivities(); // Save to localStorage
        renderActivities();
    });
});
