/* uhtiep-clicker.js */
let shells = 0;
let shellsPerClick = 1;
let shellsPerSecond = 0;
let rebirths = 0;
let rebirthCost = 50000;

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
