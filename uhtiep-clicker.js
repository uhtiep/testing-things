let shells = 0;
let shellsPerClick = 1;
let shellsPerSecond = 0;
let rebirths = 0;
let rebirthCost = 50000;
let spcUpgrades = [];
let spsUpgrades = [];

for (let i = 1; i <= 25; i++) {
    spcUpgrades.push({ name: `SPC Upgrade ${i}`, cost: i * 100, bonus: i });
    spsUpgrades.push({ name: `SPS Upgrade ${i}`, cost: i * 150, bonus: i });
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
