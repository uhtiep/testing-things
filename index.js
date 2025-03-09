let currentUser = null;
let currency = 0;
let job = null;
let admin = false;

const authSection = document.getElementById('auth-section');
const gameSection = document.getElementById('game-section');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authButton = document.getElementById('auth-button');
const authMessage = document.getElementById('auth-message');
const commandInput = document.getElementById('command-input');
const commandButton = document.getElementById('command-button');
const commandOutput = document.getElementById('command-output');

// Store user data in localStorage
function saveUserData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('currency', currency);
    localStorage.setItem('job', JSON.stringify(job));
    localStorage.setItem('admin', admin);
}

// Load user data from localStorage
function loadUserData() {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    currency = parseInt(localStorage.getItem('currency')) || 0;
    job = JSON.parse(localStorage.getItem('job')) || null;
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

// Command handler
commandButton.addEventListener('click', () => {
    const command = commandInput.value.trim().toLowerCase();
    const args = command.split(' ');

    if (command === '?givemoney' && args.length > 1) {
        const playerName = args[1];
        const amount = 100; // example amount to give
        currency += amount;
        commandOutput.textContent = `${playerName} has been given ${amount} coins! New balance: ${currency} coins.`;
    } else if (command === '?ban' && args.length > 1) {
        const playerName = args[1];
        if (admin) {
            // Simulate banning the player
            commandOutput.textContent = `${playerName} has been banned!`;
        } else {
            commandOutput.textContent = 'You do not have permission to ban players!';
        }
    } else if (command === '?getpassword' && args.length > 1) {
        const playerName = args[1];
        if (playerName === currentUser.username || admin) {
            commandOutput.textContent = `The password for ${playerName} is: ${currentUser.password}`;
        } else {
            commandOutput.textContent = 'You do not have permission to view this password.';
        }
    } else if (command === '?reset' && args.length > 1) {
        const playerName = args[1];
        if (playerName === currentUser.username || admin) {
            currency = 0;
            job = null;
            saveUserData();
            commandOutput.textContent = `${playerName}'s progress has been reset!`;
        } else {
            commandOutput.textContent = 'You do not have permission to reset this player\'s progress.';
        }
    } else if (command === '?admin' && args.length > 1) {
        const playerName = args[1];
        if (admin) {
            commandOutput.textContent = `${playerName} is now an admin!`;
        } else {
            commandOutput.textContent = 'You do not have permission to promote players to admin.';
        }
    } else if (command === '?help') {
        commandOutput.textContent = `
        Available Commands:
        - ?givemoney <player>: Give coins to a player
        - ?ban <player>: Ban a player
        - ?getpassword <player>: Get a player’s password
        - ?reset <player>: Reset a player’s progress
        - ?admin <player>: Promote a player to admin
        - ?help: Display this list of commands
        `;
    } else {
        commandOutput.textContent = 'Unknown command. Type ?help for a list of commands.';
    }
    commandInput.value = '';
});
