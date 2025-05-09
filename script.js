// ==== Skill Definitions ====

const skills = [
  { name: 'Wrath Slash', sin: 'Wrath', type: 'Slash', damage: 12 },
  { name: 'Wrath Smash', sin: 'Wrath', type: 'Blunt', damage: 14 },
  { name: 'Lust Pierce', sin: 'Lust', type: 'Pierce', damage: 10 },
  { name: 'Pride Slash', sin: 'Pride', type: 'Slash', damage: 15 },
  { name: 'Envy Smash', sin: 'Envy', type: 'Blunt', damage: 13 },
  { name: 'Gloom Pierce', sin: 'Gloom', type: 'Pierce', damage: 11 }
];

let selectedSkills = [];
let sanity = 0;
let enemyHP = 100;

// ==== UI Setup ====

const skillContainer = document.getElementById("skills");
const logBox = document.getElementById("log");

skills.forEach((skill, index) => {
  const btn = document.createElement("button");
  btn.className = "skill-btn";
  btn.innerText = `${skill.name}\n(${skill.sin} / ${skill.type})`;
  btn.onclick = () => selectSkill(index);
  skillContainer.appendChild(btn);
});

function selectSkill(index) {
  if (selectedSkills.length >= 3) {
    log("Max 3 skills per chain.");
    return;
  }
  selectedSkills.push(skills[index]);
  log(`Added ${skills[index].name} to chain.`);
}

function log(text) {
  logBox.textContent = text;
}

function updateUI() {
  document.getElementById("sanity").textContent = sanity;
  document.getElementById("enemy-hp").textContent = `HP: ${enemyHP}`;
}

// ==== Chain Attack Logic ====

function startChain() {
  if (selectedSkills.length === 0) {
    log("No skills selected.");
    return;
  }

  let damage = 0;
  let lastSin = null;
  let resonance = 1.0;

  selectedSkills.forEach(skill => {
    damage += skill.damage;
    if (skill.sin === lastSin) {
      resonance += 0.2;
    }
    lastSin = skill.sin;
  });

  // Absolute Resonance
  if (
    selectedSkills.length >= 3 &&
    selectedSkills.every(s => s.sin === selectedSkills[0].sin)
  ) {
    resonance += 0.5;
    log("Absolute Resonance triggered!");
  }

  // Simulate Clash
  const playerRoll = Math.floor(Math.random() * 100) + sanity;
  const enemyRoll = Math.floor(Math.random() * 100);
  log(`Player Coin: ${playerRoll} | Enemy Coin: ${enemyRoll}`);

  if (playerRoll >= enemyRoll) {
    const totalDamage = Math.floor(damage * resonance);
    enemyHP -= totalDamage;
    sanity = Math.min(45, sanity + 5);
    log(`Clash Won! Dealt ${totalDamage} damage.`);
  } else {
    sanity = Math.max(-45, sanity - 10);
    log("Clash Lost. No damage dealt.");
  }

  selectedSkills = [];
  updateUI();

  if (enemyHP <= 0) {
    log("Enemy defeated!");
    enemyHP = 0;
  }
}
