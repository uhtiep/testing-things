let uhtiepShells = 0;
let uhtiepPerSecond = 0;
let uhtiepPerClick = 1;
let rebirthPrice = 50000;
let rebirthCount = 0;

// Store upgrades in an object
const upgrades = {
    factory: { cost: 50, sps: 2, owned: 0 },
    mine: { cost: 150, sps: 5, owned: 0 },
    robot: { cost: 400, sps: 10, owned: 0 },
    farm: { cost: 800, sps: 20, owned: 0 },
    crane: { cost: 2000, sps: 50, owned: 0 },
    refinery: { cost: 5000, sps: 100, owned: 0 },
    asteroid: { cost: 15000, sps: 250, owned: 0 },
    drill: { cost: 40000, sps: 500, owned: 0 },
    automation: { cost: 100000, sps: 1000, owned: 0 },
    superRobot: { cost: 500000, sps: 5000, owned: 0 },

    strongerClick: { cost: 100, spc: 2, owned: 0 },
    doubleClick: { cost: 500, spc: 5, owned: 0 },
    tripleClick: { cost: 2000, spc: 10, owned: 0 },
    turboClick: { cost: 8000, spc: 20, owned: 0 },
    autoClick: { cost: 25000, spc: 50, owned: 0 },
    hyperClick: { cost: 75000, spc: 100, owned: 0 },
    ultraClick: { cost: 200000, spc: 250, owned: 0 },
    omegaClick: { cost: 500000, spc: 500, owned: 0 },
};

function clickShell() {
    uhtiepShells += uhtiepPerClick;
    createShellMessage(`+${uhtiepPerClick} shells`);
    updateDisplay();
}

function buyItem(item) {
    if (uhtiepShells >= upgrades[item].cost) {
        uhtiepShells -= upgrades[item].cost;
        upgrades[item].owned++;
        if (upgrades[item].sps) uhtiepPerSecond += upgrades[item].sps;
        if (upgrades[item].spc) uhtiepPerClick += upgrades[item].spc;
        upgrades[item].cost = Math.floor(upgrades[item].cost * 1.3);
        updateDisplay();
    }
}

function createShellMessage(text) {
    const shellMessage = document.createElement("div");
    shellMessage.classList.add("shell-message");
    shellMessage.textContent = text;
    document.getElementById("shellMessageContainer").appendChild(shellMessage);
}
