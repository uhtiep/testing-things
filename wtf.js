let cookieCount = localStorage.getItem("cookieCount") ? parseInt(localStorage.getItem("cookieCount")) : 0;
let upgrades = [
    { name: "Upgrade 1", cost: 10, effect: () => { cookieCount += 50; updateGame(); }},
    { name: "Upgrade 2", cost: 50, effect: () => { cookieCount += 100; updateGame(); }},
    { name: "Upgrade 3", cost: 100, effect: () => { cookieCount += 10000; updateGame(); }},
    { name: "Upgrade 25", cost: 10000, effect: () => { cookieCount += 1; updateGame(); }},
];

const cookieElement = document.getElementById("cookie");
const cookieCountDisplay = document.getElementById("cookie-count-display");
const upgradesList = document.getElementById("upgrades-list");

cookieElement.addEventListener("click", () => {
    cookieCount++;
    updateGame();
});

function updateGame() {
    cookieCountDisplay.innerText = cookieCount;
    localStorage.setItem("cookieCount", cookieCount);
    renderUpgrades();
}

function renderUpgrades() {
    upgradesList.innerHTML = "";
    upgrades.forEach(upgrade => {
        const upgradeDiv = document.createElement("div");
        upgradeDiv.classList.add("upgrade");
        upgradeDiv.innerText = `${upgrade.name} - Cost: ${upgrade.cost}`;
        upgradeDiv.addEventListener("click", () => {
            if (cookieCount >= upgrade.cost) {
                cookieCount -= upgrade.cost;
                upgrade.effect();
            }
        });
        upgradesList.appendChild(upgradeDiv);
    });
}

updateGame();
