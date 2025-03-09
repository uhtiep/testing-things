let currentUser = null;
let currency = 0;
let lastGrindTime = 0;
let job = null;
let shiftsLeft = 0;
let lootboxItems = ['Gold Coin', 'Silver Coin', 'Diamond', 'Nothing'];

const authSection = document.getElementById('auth-section');
const gameSection = document.getElementById('game-section');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authButton = document.getElementById('auth-button');
const authMessage = document.getElementById('auth-message');
const grindButton = document.getElementById('grind-button');
const cooldownMessage = document.getElementById('cooldown-message');
const lootboxButton = document.getElementById('lootbox-button');
const lootboxMessage = document.getElementById('lootbox-message');
const currencyDisplay = document.getElementById('currency');
const jobSection = document.getElementById('job-section');
const applyJobButton = document.getElementById('apply-job-button');
const workButton = document.getElementById('work-button');
const workMessage = document.getElementById('work-message');
const shiftsLeftDisplay = document.getElementById('shifts-left');
const gambleButton = document.getElementById('gamble-button');
const gambleMessage = document.getElementById('gamble-message');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');

// Helper functions for saving and loading user data
function saveUserData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('currency', currency);
    localStorage.setItem('lastGrindTime', lastGrindTime);
    localStorage.setItem('job', job);
    localStorage.setItem('shiftsLeft', shiftsLeft);
}

function loadUserData() {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    currency = parseInt(localStorage.getItem('currency')) || 0;
    lastGrindTime = parseInt(localStorage.getItem('lastGrindTime')) || 0;
    job = JSON.parse(localStorage.getItem('job')) || null;
    shiftsLeft = parseInt(localStorage.getItem('shiftsLeft')) || 0;
}

// Handle Sign Up and Login
authButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username && password) {
        if (!currentUser) {
            currentUser = { username, password };
            saveUserData();
            authSection.style.display = 'none';
            gameSection.style.display = 'block';
            authMessage.textContent = `Welcome, ${username}!`;
        } else {
            authMessage.textContent = 'You are already logged in!';
        }
    } else {
        authMessage.textContent = 'Please enter a valid username and password.';
    }
});

// Handle Grind Button
grindButton.addEventListener('click', () => {
    const currentTime = Date.now();
    const grindCooldown = 5000; // 5-second cooldown

    if (currentTime - lastGrindTime >= grindCooldown) {
        const earnedCoins = Math.floor(Math.random() * 10) + 1; // Random coins between 1 and 10
        currency += earnedCoins;
        lastGrindTime = currentTime;
        saveUserData();
        currencyDisplay.textContent = currency;
        cooldownMessage.style.display = 'none';
    } else {
        cooldownMessage.style.display = 'block';
    }
});

// Handle Lootbox Button
lootboxButton.addEventListener('click', () => {
    const randomItem = lootboxItems[Math.floor(Math.random() * lootboxItems.length)];
    lootboxMessage.textContent = `You got: ${randomItem}`;
});

// Handle Apply for a Job
applyJobButton.addEventListener('click', () => {
    const jobs = [
        { name: 'Junior Worker', shiftsRequired: 2, pay: 10 },
        { name: 'Senior Worker', shiftsRequired: 4, pay: 20 },
        { name: 'Manager', shiftsRequired: 6, pay: 50 },
    ];

    job = jobs[Math.floor(Math.random() * jobs.length)];
    shiftsLeft = job.shiftsRequired;
    saveUserData();
    jobSection.innerHTML = `
        <h3>Current Job: ${job.name}</h3>
        <button id="work-button">Work</button>
        <p id="shifts-left">Shifts Left: ${shiftsLeft}</p>
    `;
    workButton.style.display = 'inline-block';
    shiftsLeftDisplay.style.display = 'inline-block';
});

// Handle Work Button
workButton.addEventListener('click', () => {
    if (shiftsLeft > 0) {
        currency += job.pay;
        shiftsLeft -= 1;
        saveUserData();
        workMessage.textContent = `You worked a shift and earned ${job.pay} coins.`;
        currencyDisplay.textContent = currency;

        if (shiftsLeft === 0) {
            workButton.style.display = 'none';
            workMessage.textContent = `You have completed your shifts for the day!`;
        }

        shiftsLeftDisplay.textContent = `Shifts Left: ${shiftsLeft}`;
    }
});

// Handle Gamble Button
gambleButton.addEventListener('click', () => {
    const gambleOutcome = Math.random();
    if (gambleOutcome < 0.5) {
        const loss = Math.floor(Math.random() * 20) + 1;
        currency -= loss;
        gambleMessage.textContent = `You lost ${loss} coins!`;
    } else {
        const win = Math.floor(Math.random() * 20) + 1;
        currency += win;
        gambleMessage.textContent = `You won ${win} coins!`;
    }
    saveUserData();
    currencyDisplay.textContent = currency;
});

// Chat functionality
function displayChatMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendChatButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        displayChatMessage(`You: ${message}`);
        chatInput.value = '';
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatButton.click();
    }
});

// Load user data on page load
loadUserData();
currencyDisplay.textContent = currency;
if (currentUser) {
    authSection.style.display = 'none';
    gameSection.style.display = 'block';
}
