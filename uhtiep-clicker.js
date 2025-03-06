let uhtiepShells = 0;
let uhtiepPerSecond = 0;
let factoryPrice = 100;
let factoryCount = 0;

function clickShell() {
    uhtiepShells++;
    updateDisplay();
}

function buyFactory() {
    if (uhtiepShells >= factoryPrice) {
        uhtiepShells -= factoryPrice;
        factoryCount++;
        uhtiepPerSecond += 1;
        factoryPrice = Math.floor(factoryPrice * 1.5);  // Increase factory price
        updateDisplay();
        updateFactoryButton();
    } else {
        alert("Not enough uhtiep shells!");
    }
}

function updateDisplay() {
    document.getElementById('uhtiepCounter').textContent = `Uhtiep Shells: ${uhtiepShells}`;
    document.getElementById('uhtiepPerSecond').textContent = uhtiepPerSecond;
}

function updateFactoryButton() {
    document.getElementById('buyFactoryButton').textContent = `Buy Uhtiep Shell Factory (${factoryPrice} shells)`;
}

// Auto-generate uhtiep shells every second
setInterval(function() {
    uhtiepShells += uhtiepPerSecond;
    updateDisplay();
}, 1000);
