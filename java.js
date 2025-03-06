let uhtiepShells = 0;
let uhtiepPerSecond = 0;
let factoryPrice = 50;
let minePrice = 150;
let robotPrice = 400;
let farmPrice = 800;
let cranePrice = 2000;
let refineryPrice = 5000;
let factoryUpgradePrice = 10000;
let automationPrice = 25000;
let asteroidPrice = 50000;
let superRobotPrice = 100000;
let rebirthPrice = 50000;

let factoryCount = 0;
let mineCount = 0;
let robotCount = 0;
let farmCount = 0;
let craneCount = 0;
let refineryCount = 0;
let factoryUpgradeCount = 0;
let automationCount = 0;
let asteroidCount = 0;
let superRobotCount = 0;
let rebirthCount = 0;

function clickShell() {
    uhtiepShells++;
    createShellMessage(uhtiepShells); // Create the message when shells are earned
    updateDisplay();
}

function createShellMessage(amount) {
    const shellMessage = document.createElement("div");
    shellMessage.classList.add("shell-message");

    // Create the shell icon
    const shellIcon = document.createElement("img");
    shellIcon.src = "https://example.com/shell-icon.png";  // Replace with actual shell icon path
    shellMessage.appendChild(shellIcon);

    // Add the "+(amount) shells" text
    const text = document.createElement("span");
    text.textContent = `+${amount} shells`;
    shellMessage.appendChild(text);

    // Append to the shell message container
    const container = document.getElementById("shellMessageContainer");
    container.appendChild(shellMessage);

    // Random direction for the shell animation
    const randX = (Math.random() - 0.5) * 400 + "px"; // Random X movement
    const randY = (Math.random() - 0.5) * 400 + "px"; // Random Y movement
    shellMessage.style.setProperty('--rand-x', randX);
    shellMessage.style.setProperty('--rand-y', randY);
}

function buyFactory() {
    if (uhtiepShells >= factoryPrice) {
        uhtiepShells -= factoryPrice;
        factoryCount++;
        uhtiepPerSecond += 2;
        factoryPrice = Math.floor(factoryPrice * 1.25);
        updateDisplay();
        updateFactoryButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

function buyMine() {
    if (uhtiepShells >= minePrice) {
        uhtiepShells -= minePrice;
        mineCount++;
        uhtiepPerSecond += 5;
        minePrice = Math.floor(minePrice * 1.3);
        updateDisplay();
        updateMineButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

// Add other purchase functions as before...
function rebirth() {
    if (uhtiepShells >= rebirthPrice) {
        uhtiepShells = 0;
        uhtiepPerSecond *= 2;  // Double the earnings after rebirth
        rebirthCount++;
        rebirthPrice = Math.floor(rebirthPrice * 5);  // Price increases by 5X each rebirth
        updateDisplay();
        alert("Rebirth Successful! Your earnings are now multiplied!");
    } else {
        alert("Not enough uhtiep shells for rebirth!");
    }
}

function updateDisplay() {
    document.getElementById('uhtiepCounter').textContent = `Uhtiep Shells: ${uhtiepShells}`;
    document.getElementById('uhtiepPerSecond').textContent = uhtiepPerSecond;
}

// Update buttons based on the items purchased (same as before)
setInterval(function() {
    uhtiepShells += uhtiepPerSecond;
    updateDisplay();
}, 1000);
