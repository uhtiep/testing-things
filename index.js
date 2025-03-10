function updateTimers() {
    const now = new Date();

    // Chainsaw Man Chapter (Every Wednesday)
    let chainsawDate = new Date();
    chainsawDate.setDate(chainsawDate.getDate() + ((3 - chainsawDate.getDay() + 7) % 7 || 7)); // Next Wednesday
    chainsawDate.setHours(0, 0, 0, 0);
    document.getElementById("chainsawTimer").textContent = getTimeRemaining(chainsawDate);

    // Christmas Countdown (December 25)
    const christmas = new Date(now.getFullYear(), 11, 25);
    document.getElementById("christmasTimer").textContent = getTimeRemaining(christmas);

    // Re:Zero Episode (Every Wednesday)
    let rezeroDate = new Date();
    rezeroDate.setDate(rezeroDate.getDate() + ((3 - rezeroDate.getDay() + 7) % 7 || 7)); // Next Wednesday
    rezeroDate.setHours(0, 0, 0, 0);
    document.getElementById("rezeroTimer").textContent = getTimeRemaining(rezeroDate);

    // Solo Leveling Episode (Every Saturday)
    let soloLevelingDate = new Date();
    soloLevelingDate.setDate(soloLevelingDate.getDate() + ((6 - soloLevelingDate.getDay() + 7) % 7 || 7)); // Next Saturday
    soloLevelingDate.setHours(0, 0, 0, 0);
    document.getElementById("sololevelingTimer").textContent = getTimeRemaining(soloLevelingDate);
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

// Update every second
setInterval(updateTimers, 1000);
updateTimers();
