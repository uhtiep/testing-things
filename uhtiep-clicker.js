/* uhtiep-clicker.js */
let shells = 0;
let shellsPerClick = 1;
let shellsPerSecond = 0;
let rebirths = 0;
let rebirthCost = 50000;
let spcUpgrades = [];
let spsUpgrades = [];

const upgradeNames = ["Tiny Shell Boost", "Sand Collector", "Ocean Wave Helper", "Shell Magnet", "Tide Enhancer", "Sea Breeze Bonus", "Starfish Assistant", "Coral Growth", "Deep Sea Secret", "Tsunami Boost", "Pearl Finder", "Crab Workforce", "Whale Donation", "Dolphin Trainer", "Sunken Treasure", "Shell Engineer", "Underwater King", "Mermaid Assistance", "Poseidon's Favor", "Ocean Spirit", "Shell Alchemy", "Lost City Discovery", "Uhtiep Blessing", "Divine Ocean Power", "Eternal Tide"];

for (let i = 0; i < 25; i++) {
    spcUpgrades.push({ name: upgradeNames[i] + " (SPC)", cost: (i + 1) * 100, bonus: (i + 1) });
    spsUpgrades.push({ name: upgradeNames[i] + " (SPS)", cost: (i + 1) * 150, bonus: (i + 1) });
}

function clickShell() {
    shells += shellsPerClick;
    document.getElementById('shellCount').innerText = `Uhtiep Shells: ${shells}`;
    spawnFloatingText(`+${shellsPerClick} shells`);
}

function spawnFloatingText(text) {
    let message = document.createElement('div');
    message.classList.add('floating-text');
    message.innerText = text;
    document.body.appendChild(message);

    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    message.style.left = `${x}px`;
    message.style.top = `${y}px`;

    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateY(-50px)';
    }, 100);

    setTimeout(() => document.body.removeChild(message), 2500);
}

setInterval(() => {
    shells += shellsPerSecond;
    document.getElementById('shellCount').innerText = `Uhtiep Shells: ${shells}`;
}, 1000);

function rebirth() {
    if (shells >= rebirthCost) {
        shells = 0;
        shellsPerClick *= 2;
        shellsPerSecond *= 2;
        rebirths++;
        rebirthCost *= 5;
        document.getElementById('shellCount').innerText = `Uhtiep Shells: ${shells}`;
        document.getElementById('rebirthBtn').innerText = `Rebirth (Cost: ${rebirthCost} shells)`;
    }
}

function buyUpgrade(type, index) {
    let upgrade = type === 'spc' ? spcUpgrades[index] : spsUpgrades[index];
    if (shells >= upgrade.cost) {
        shells -= upgrade.cost;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        if (type === 'spc') {
            shellsPerClick += upgrade.bonus;
        } else {
            shellsPerSecond += upgrade.bonus;
        }
        document.getElementById('shellCount').innerText = `Uhtiep Shells: ${shells}`;
        renderUpgrades();
    }
}

function renderUpgrades() {
    let spcDiv = document.getElementById('spcItems');
    let spsDiv = document.getElementById('spsItems');
    spcDiv.innerHTML = '';
    spsDiv.innerHTML = '';

    spcUpgrades.forEach((upgrade, index) => {
        let btn = document.createElement('button');
        btn.innerText = `${upgrade.name} (Cost: ${upgrade.cost}, Bonus: +${upgrade.bonus})`;
        btn.onclick = () => buyUpgrade('spc', index);
        spcDiv.appendChild(btn);
    });

    spsUpgrades.forEach((upgrade, index) => {
        let btn = document.createElement('button');
        btn.innerText = `${upgrade.name} (Cost: ${upgrade.cost}, Bonus: +${upgrade.bonus}/s)`;
        btn.onclick = () => buyUpgrade('sps', index);
        spsDiv.appendChild(btn);
    });
}

document.addEventListener('DOMContentLoaded', renderUpgrades);

// uhtiep-clicker.js

// Show the selected page and hide the other
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    const selectedPage = document.getElementById(pageId);
    selectedPage.style.display = 'block';
}
