function updateTimers() {
    const now = new Date();

    // Chainsaw Man Chapter (Every Wednesday)
    let chainsawDate = getNextOccurrence(now, 3); // 3 represents Wednesday
    document.getElementById("chainsawTimer").textContent = getTimeRemaining(chainsawDate);

    // Christmas Countdown (December 25)
    const christmas = new Date(now.getFullYear(), 11, 25);
    if (now.getMonth() === 11 && now.getDate() > 25) {
        christmas.setFullYear(christmas.getFullYear() + 1);
    }
    document.getElementById("christmasTimer").textContent = getTimeRemaining(christmas);

    // Re:Zero Episode (Every Wednesday)
    let rezeroDate = getNextOccurrence(now, 3); // 3 represents Wednesday
    document.getElementById("rezeroTimer").textContent = getTimeRemaining(rezeroDate);

    // Solo Leveling Episode (Every Saturday)
    let soloLevelingDate = getNextOccurrence(now, 6); // 6 represents Saturday
    document.getElementById("sololevelingTimer").textContent = getTimeRemaining(soloLevelingDate);
}

// Function to get the next occurrence of a specific day of the week
function getNextOccurrence(currentDate, dayOfWeek) {
    const resultDate = new Date(currentDate);
    resultDate.setDate(resultDate.getDate() + ((dayOfWeek - currentDate.getDay() + 7) % 7 || 7));
    resultDate.setHours(0, 0, 0, 0);
    return resultDate;
}

// Function to get time remaining in Days, Hours, Minutes, Seconds
function getTimeRemaining(targetDate) {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) return "Already Released!";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Update timers every second
setInterval(updateTimers, 1000);
updateTimers();
