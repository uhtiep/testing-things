// game.js

// Canvas setup for displaying auras
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// List of auras (for brevity, I'll define a few here but can be expanded)
const auras = [
    { name: "Grey Aura", color: "#808080", rarity: 2, effect: "greyEffect" },
    { name: "Red Aura", color: "#FF0000", rarity: 2, effect: "redEffect" },
    { name: "Blue Aura", color: "#0000FF", rarity: 2, effect: "blueEffect" },
    { name: "Green Aura", color: "#008000", rarity: 2, effect: "greenEffect" },
    { name: "Sun & Moon Eclipse Aura", color: "#FFFF00", rarity: 1000, effect: "eclipseEffect" },
    // Add more unique aura effects here
];

// Generate 1000 unique auras with random names and effects
function generateAuras() {
    const auraNames = [
        "Grey Aura", "Red Aura", "Blue Aura", "Green Aura", "Sun & Moon Eclipse Aura",
        "Flame Aura", "Mystic Aura", "Shadow Aura", "Frost Aura", "Electric Aura", // Add more here
        // ...repeat or make more names for a total of 1000
    ];

    const auraEffects = [
        "greyEffect", "redEffect", "blueEffect", "greenEffect", "eclipseEffect",
        "flameEffect", "mysticEffect", "shadowEffect", "frostEffect", "electricEffect", // Add more effects
        // ... add random or unique effects here
    ];

    for (let i = 0; i < 1000; i++) {
        const randomAura = {
            name: auraNames[i % auraNames.length],
            color: getRandomColor(),
            rarity: Math.floor(Math.random() * 1000) + 1, // Rarity ranges from 1 to 1000
            effect: auraEffects[i % auraEffects.length],
        };
        auras.push(randomAura);
    }
}

// Random color generator for aura names
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Randomly select an aura based on rarity
function getRandomAura() {
    const randomValue = Math.random() * 1000;
    let selectedAura = null;

    // Apply rarity system (less rare auras will be selected more often)
    for (let i = 0; i < auras.length; i++) {
        if (randomValue < auras[i].rarity) {
            selectedAura = auras[i];
            break;
        }
    }

    // If no aura found (extremely rare), pick a random aura
    if (!selectedAura) {
        selectedAura = auras[Math.floor(Math.random() * auras.length)];
    }

    return selectedAura;
}

// Display selected aura on screen with its effect
function displayAura(aura) {
    const effect = aura.effect;

    // Display aura name and rarity in the UI
    document.getElementById('auraName').innerText = `Aura: ${aura.name}`;
    document.getElementById('auraInfo').innerText = `Rarity: 1 in ${aura.rarity}`;

    // Display visual effect based on aura's type
    if (effect === "greyEffect") {
        greyEffect(aura);
    } else if (effect === "redEffect") {
        redEffect(aura);
    } else if (effect === "blueEffect") {
        blueEffect(aura);
    } else if (effect === "greenEffect") {
        greenEffect(aura);
    } else if (effect === "eclipseEffect") {
        eclipseEffect(aura);
    }
    // Add more effect cases as needed
}

// Example visual effect: Grey Aura
function greyEffect(aura) {
    ctx.fillStyle = aura.color;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
    ctx.fill();
}

// Example visual effect: Red Aura
function redEffect(aura) {
    ctx.fillStyle = aura.color;
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 80, 0, Math.PI * 2);
    ctx.fill();
}

// Example visual effect: Eclipse Aura
function eclipseEffect(aura) {
    // Draw Sun (Yellow Circle)
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
    ctx.fill();

    // Draw Moon (Black Circle) over the Sun to create an eclipse
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + 50, canvas.height / 2, 60, 0, Math.PI * 2);
    ctx.fill();
}

// Call this function to initiate the aura system
function generateAndDisplayAura() {
    const randomAura = getRandomAura();
    displayAura(randomAura);
}

// Call generateAuras() to create the full aura pool
generateAuras();

// Start the game by showing an aura every 3 seconds (for testing)
setInterval(generateAndDisplayAura, 3000);
