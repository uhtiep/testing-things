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
    updateDisplay();
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

function buyRobot() {
    if (uhtiepShells >= robotPrice) {
        uhtiepShells -= robotPrice;
        robotCount++;
        uhtiepPerSecond += 10;
        robotPrice = Math.floor(robotPrice * 1.35);
        updateDisplay();
        updateRobotButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

// Add more items below...
function buyFarm() {
    if (uhtiepShells >= farmPrice) {
        uhtiepShells -= farmPrice;
        farmCount++;
        uhtiepPerSecond += 15;
        farmPrice = Math.floor(farmPrice * 1.4);
        updateDisplay();
        updateFarmButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

function buyCrane() {
    if (uhtiepShells >= cranePrice) {
        uhtiepShells -= cranePrice;
        craneCount++;
        uhtiepPerSecond += 20;
        cranePrice = Math.floor(cranePrice * 1.45);
        updateDisplay();
        updateCraneButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

function buyRefinery() {
    if (uhtiepShells >= refineryPrice) {
        uhtiepShells -= refineryPrice;
        refineryCount++;
        uhtiepPerSecond += 50;
        refineryPrice = Math.floor(refineryPrice * 1.5);
        updateDisplay();
        updateRefineryButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

function buyFactoryUpgrade() {
    if (uhtiepShells >= factoryUpgradePrice) {
        uhtiepShells -= factoryUpgradePrice;
        factoryUpgradeCount++;
        uhtiepPerSecond += 30;
        factoryUpgradePrice = Math.floor(factoryUpgradePrice * 1.6);
        updateDisplay();
        updateFactoryUpgradeButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

function buyAutomation() {
    if (uhtiepShells >= automationPrice) {
        uhtiepShells -= automationPrice;
        automationCount++;
        uhtiepPerSecond += 100;
        automationPrice = Math.floor(automationPrice * 1.7);
        updateDisplay();
        updateAutomationButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

function buyAsteroid() {
    if (uhtiepShells >= asteroidPrice) {
        uhtiepShells -= asteroidPrice;
        asteroidCount++;
        uhtiepPerSecond += 200;
        asteroidPrice = Math.floor(asteroidPrice * 1.8);
        updateDisplay();
        updateAsteroidButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

function buySuperRobot() {
    if (uhtiepShells >= superRobotPrice) {
        uhtiepShells -= superRobotPrice;
        superRobotCount++;
        uhtiepPerSecond += 500;
        superRobotPrice = Math.floor(superRobotPrice * 1.9);
        updateDisplay();
        updateSuperRobotButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

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
    document.getElementById('uhtiepPerSe
