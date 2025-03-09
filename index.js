let currentUser = null;
let currency = 0;
let lastGrindTime = 0;
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
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');

// Helper functions for saving and loading user data
function saveUserData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('currency', currency);
    localStorage.setItem('lastGrindTime', lastGrindTime);
}

function loadUserData() {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    currency = parseInt(localStorage.getItem('currency')) || 0;
    lastGrindTime = parseInt(localStorage.getItem('lastGrindTime')) || 0;
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
