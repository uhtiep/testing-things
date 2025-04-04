// wtf.js
const rollBtn = document.getElementById('roll-btn');
const autoRollBtn = document.getElementById('auto-roll-btn');
const rebirthBtn = document.getElementById('rebirth-btn');
const auraName = document.getElementById('aura-name');
const rollCountDisplay = document.getElementById('roll-count');
const currencyDisplay = document.getElementById('currency');
const logList = document.getElementById('log-list');
const luckDisplay = document.getElementById('luck-value');

let rolls = 0;
let currency = 0;
let rebirths = 0;
let autoRolling = false;
let currentAura = null;

const rarities = [
  { name: 'common', chance: 0.7 },
  { name: 'uncommon', chance: 0.2 },
  { name: 'rare', chance: 0.07 },
  { name: 'epic', chance: 0.02 },
  { name: 'legendary', chance: 0.009 },
  { name: 'mythical', chance: 0.0009 },
  { name: 'godly', chance: 0.0001 },
];

// Generate 10k+ auras
const auras = [];
const adjectives = ['Frozen', 'Shimmering', 'Dark', 'Radiant', 'Burning', 'Silent', 'Infinite', 'Mystic', 'Twisted', 'Quantum'];
const elements = ['Flame', 'Void', 'Light', 'Storm', 'Frost', 'Time', 'Shadow', 'Soul', 'Nebula', 'Echo'];

for (let i = 0; i < 10000; i++) {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const ele = elements[Math.floor(Math.random() * elements.length)];
  const rarity = weightedRandomRarity();
  auras.push({
    id: i,
    name: `${adj} ${ele} #${i}`,
    rarity,
  });
}

function weightedRandomRarity() {
  let roll = Math.random();
  let total = 0;
  for (let r of rarities) {
    total += r.chance;
    if (roll <= total) return r.name;
  }
  return 'common';
}

function getRandomAura() {
  const index = Math.floor(Math.random() * auras.length);
  return auras[index];
}

function updateUI(aura) {
  auraName.textContent = aura.name;
  auraName.className = aura.rarity;
  rollCountDisplay.textContent = rolls;
  currencyDisplay.textContent = currency;
  luckDisplay.textContent = `${(1 + rebirths * 0.05).toFixed(2)}x`;

  const logItem = document.createElement('li');
  logItem.textContent = `Rolled ${aura.name}`;
  logItem.className = aura.rarity;
  logList.prepend(logItem);

  while (logList.childNodes.length > 20) {
    logList.removeChild(logList.lastChild);
  }
}

function rollAura() {
  const luck = 1 + rebirths * 0.05;
  let aura = getRandomAura();

  // Luck bonus
  if (Math.random() < 0.1 * luck) {
    aura = { ...aura, rarity: upgradeRarity(aura.rarity) };
  }

  currentAura = aura;
  rolls++;
  currency += 1;
  updateUI(aura);
  saveGame();
}

function upgradeRarity(rarity) {
  const index = rarities.findIndex(r => r.name === rarity);
  if (index < rarities.length - 1) {
    return rarities[index + 1].name;
  }
  return rarity;
}

function saveGame() {
  const data = {
    rolls,
    currency,
    rebirths,
  };
  localStorage.setItem('solsrng_clone_save', JSON.stringify(data));
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem('solsrng_clone_save'));
  if (data) {
    rolls = data.rolls || 0;
    currency = data.currency || 0;
    rebirths = data.rebirths || 0;
    rollCountDisplay.textContent = rolls;
    currencyDisplay.textContent = currency;
    luckDisplay.textContent = `${(1 + rebirths * 0.05).toFixed(2)}x`;
  }
}

function toggleAutoRoll() {
  autoRolling = !autoRolling;
  autoRollBtn.textContent = `Auto Roll: ${autoRolling ? 'ON' : 'OFF'}`;
  if (autoRolling) {
    autoRollLoop();
  }
}

function autoRollLoop() {
  if (!autoRolling) return;
  rollAura();
  setTimeout(autoRollLoop, 100);
}

function rebirth() {
  if (rolls >= 100) {
    rolls = 0;
    currency = 0;
    rebirths++;
    alert("You have been reborn. Luck increased!");
    saveGame();
    rollCountDisplay.textContent = rolls;
    currencyDisplay.textContent = currency;
    luckDisplay.textContent = `${(1 + rebirths * 0.05).toFixed(2)}x`;
  } else {
    alert("You need 100 rolls to rebirth!");
  }
}

rollBtn.addEventListener('click', rollAura);
autoRollBtn.addEventListener('click', toggleAutoRoll);
rebirthBtn.addEventListener('click', rebirth);

loadGame();
