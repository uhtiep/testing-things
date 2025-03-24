let tamiaShameCount = localStorage.getItem("tamiaShameCount") ? parseInt(localStorage.getItem("tamiaShameCount")) : 0;
let upgrades = [
    { name: "Upgrade 1", cost: 10, effect: () => { tamiaShameCount += 50; updateGame(); }},
    { name: "Upgrade 2", cost: 50, effect: () => { tamiaShameCount += 100; updateGame(); }},
    { name: "Upgrade 3", cost: 100, effect: () => { tamiaShameCount += 250; updateGame(); }},
    { name: "Upgrade 4", cost: 250, effect: () => { tamiaShameCount += 500; updateGame(); }},
    { name: "Upgrade 5", cost: 500, effect: () => { tamiaShameCount += 10000; updateGame(); }},
    { name: "Upgrade 6", cost: 1000, effect: () => { tamiaShameCount += 2000; updateGame(); }},
    { name: "Upgrade 7", cost: 2000, effect: () => { tamiaShameCount += 200; updateGame(); }},
    { name: "Upgrade 8", cost: 5000, effect: () => { tamiaShameCount += 500; updateGame(); }},
    { name: "Upgrade 9", cost: 10000, effect: () => { tamiaShameCount += 1000; updateGame(); }},
    { name: "Upgrade 10", cost: 20000, effect: () => { tamiaShameCount += 1500; updateGame(); }},
    { name: "Upgrade 11", cost: 50000, effect: () => { tamiaShameCount += 2000; updateGame(); }},
    { name: "Upgrade 12", cost: 100000, effect: () => { tamiaShameCount += 3000; updateGame(); }},
    { name: "Upgrade 13", cost: 200000, effect: () => { tamiaShameCount += 5000; updateGame(); }},
    { name: "Upgrade 14", cost: 500000, effect: () => { tamiaShameCount += 8000; updateGame(); }},
    { name: "Upgrade 15", cost: 1000000, effect: () => { tamiaShameCount += 12000; updateGame(); }},
    { name: "Upgrade 16", cost: 2000000, effect: () => { tamiaShameCount += 15000; updateGame(); }},
    { name: "Upgrade 17", cost: 5000000, effect: () => { tamiaShameCount += 20000; updateGame(); }},
    { name: "Upgrade 18", cost: 10000000, effect: () => { tamiaShameCount += 30000; updateGame(); }},
    { name: "Upgrade 19", cost: 25000000, effect: () => { tamiaShameCount += 50000; updateGame(); }},
    { name: "Upgrade 20", cost: 50000000, effect: () => { tamiaShameCount += 80000; updateGame(); }},
    { name: "Upgrade 21", cost: 100000000, effect: () => { tamiaShameCount += 100000; updateGame(); }},
    { name: "Upgrade 22", cost: 200000000, effect: () => { tamiaShameCount += 150000; updateGame(); }},
    { name: "Upgrade 23", cost: 500000000, effect: () => { tamiaShameCount += 200000; updateGame(); }},
    { name: "Upgrade 24", cost: 1000000000, effect: () => { tamiaShameCount += 250000; updateGame(); }},
    { name: "Upgrade 25", cost: 2000000000, effect: () => { tamiaShameCount += 500000; updateGame(); }}
];

const tamiaShameElement = document.getElementById("tamia-shame");
const tamiaShameCountDisplay = document.getElementById("tamia-count-display");
const upgradesList = document.getElementById("upgrades-list");

tamiaShameElement.addEventListener("click", () => {
    tamiaShameCount++;
    updateGame();
});

function updateGame() {
    tamiaShameCountDisplay.innerText = tamiaShameCount;
    localStorage.setItem("tamiaShameCount", tamiaShameCount);
    renderUpgrades();
}

function renderUpgrades() {
    upgradesList.innerHTML = "";
    upgrades.forEach(upgrade => {
        const upgradeDiv = document.createElement("div");
        upgradeDiv.classList.add("upgrade");
        upgradeDiv.innerText = `${upgrade.name} - Cost: ${upgrade.cost}`;
        upgradeDiv.addEventListener("click", () => {
            if (tamiaShameCount >= upgrade.cost) {
                tamiaShameCount -= upgrade.cost;
                upgrade.effect();
            }
        });
        upgradesList.appendChild(upgradeDiv);
    });
}

updateGame();
