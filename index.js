let currentUser = null;
let currency = 0;
let lastGrindTime = 0;
let lastWorkTime = 0;
let lastStealTime = 0;
let lastRobTime = 0;
let lastGambleTime = 0;
let lastSearchTime = 0;
let lastBegTime = 0;
let job = null;
let shiftsLeft = 0;
let lootboxItems = ['Gold Coin', 'Silver Coin', 'Diamond', 'Nothing'];
let admin = false;

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
const workCooldownMessage = document.getElementById('work-cooldown-message');
const gambleButton = document.getElementById('gamble-button');
const gambleMessage = document.getElementById('gamble-message');
const stealButton = document.getElementById('steal-button');
const searchButton = document.getElementById('search-button');
const begButton = document.getElementById('beg-button');
const robButton = document.getElementById('rob-button');
const activityMessage = document.getElementById('activity-message');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');
const banButton = document.getElementById('ban-button');
const deleteAccountButton = document.getElementById('delete-account-button');

// Store the chat messages in localStorage (for global chat simulation)
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

function updateChatDisplay() {
    chatBox.innerHTML = '';
    chatMessages.forEach(message => {
        const chatMessageElement = document.createElement('div');
        chatMessageElement.textContent = message;
        chatBox.appendChild(chatMessageElement);
    });
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('currency', currency);
    localStorage.setItem('lastGrindTime', lastGrindTime);
    localStorage.setItem('lastWorkTime', lastWorkTime);
    localStorage.setItem('lastStealTime', lastStealTime);
    localStorage.setItem('lastRobTime', lastRobTime);
    localStorage.setItem('lastGambleTime', lastGambleTime);
    localStorage.setItem('lastSearchTime', lastSearchTime);
    localStorage.setItem('lastBegTime', lastBegTime);
    localStorage.setItem('job', JSON.stringify(job));
    localStorage.setItem('shiftsLeft', shiftsLeft);
    localStorage.setItem('admin', admin);
}

// Load user data from localStorage
function loadUserData() {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    currency = parseInt(localStorage.getItem('currency')) || 0;
    lastGrindTime = parseInt(localStorage.getItem('lastGrindTime')) || 0;
    lastWorkTime = parseInt(localStorage.getItem('lastWorkTime')) || 0;
    lastStealTime = parseInt(localStorage.getItem('lastStealTime')) || 0;
    lastRobTime = parseInt(localStorage.getItem('lastRobTime')) || 0;
    lastGambleTime = parseInt(localStorage.getItem('lastGambleTime')) || 0;
    lastSearchTime = parseInt(localStorage.getItem('lastSearchTime')) || 0;
    lastBegTime = parseInt(localStorage.getItem('lastBegTime')) || 0;
    job = JSON.parse(localStorage.getItem('job')) || null;
    shiftsLeft = parseInt(localStorage.getItem('shiftsLeft')) || 0;
    admin = JSON.parse(localStorage.getItem('admin')) || false;
}

// Handle Sign Up and Login
authButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === 'uhtiep' && password === 'discord') {
        admin = true;
    }

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

// Handle Global Chat
sendChatButton.addEventListener('click', () => {
    const chatMessage = chatInput.value;
    if (chatMessage) {
        chatMessages.push(`${currentUser.username}: ${chatMessage}`);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        updateChatDisplay();
        chatInput.value = '';
    }
});

// Handle Grind Button (Cooldown optimized)
grindButton.addEventListener('click', () => {
    const currentTime = Date.now();
    const grindCooldown = 5000; // 5-second cooldown for grinding

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

// Handle Job Apply
applyJobButton.addEventListener('click', () => {
    const jobs = [
        { name: 'Junior Worker', shiftsRequired: 2, pay: 10 },
        { name: 'Senior Worker', shiftsRequired: 4, pay: 20 },
        { name: 'Manager', shiftsRequired: 6, pay: 50 },
    ];

    job = jobs[Math.floor(Math.random() * jobs.length)];
    shiftsLeft = job.shiftsRequired;
    saveUserData();

    jobSection.style.display = 'block';
    applyJobButton.style.display = 'none';
    workButton.style.display = 'block';
    workMessage.textContent = `Job applied: ${job.name}`;
});

// Handle Work Button (Cooldown optimized)
workButton.addEventListener('click', () => {
    const currentTime = Date.now();
    const workCooldown = 3600000; // 1-hour cooldown for working

    if (currentTime - lastWorkTime >= workCooldown) {
        if (shiftsLeft > 0) {
            const earnedCoins = job.pay;
            currency += earnedCoins;
            shiftsLeft -= 1;
            lastWorkTime = currentTime;
            saveUserData();
            workMessage.textContent = `You earned ${earnedCoins} coins! Shifts left: ${shiftsLeft}`;
            currencyDisplay.textContent = currency;
        } else {
            workMessage.textContent = `Job done! Apply for a new job.`;
            workButton.style.display = 'none';
        }
    } else {
        const timeLeft = Math.ceil((workCooldown - (currentTime - lastWorkTime)) / 1000);
        workCooldownMessage.textContent = `Work is on cooldown! Try again in ${timeLeft} seconds.`;
        workCooldownMessage.style.display = 'block';
    }
});

// Handle Admin Commands (Ban, Delete Account)
banButton.addEventListener('click', () => {
    if (admin) {
        // Announce in chat
        chatMessages.push(`${currentUser.username} has banned a user!`);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        updateChatDisplay();
        alert('User banned!');
    } else {
        alert('You are not an admin!');
    }
});

deleteAccountButton.addEventListener('click', () => {
    if (admin) {
        // Announce in chat
        chatMessages.push(`${currentUser.username} has deleted an account!`);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        updateChatDisplay();
        alert('Account deleted!');
    } else {
        alert('You are not an admin!');
    }
});
