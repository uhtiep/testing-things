// Initialize currency from localStorage
let currency = parseInt(localStorage.getItem('currency')) || 0;
const currencyDisplay = document.getElementById('currency');
const grindButton = document.getElementById('grind-button');
const cooldownMessage = document.getElementById('cooldown-message');

// Display the current currency
currencyDisplay.textContent = currency;

// Check the last grind time from localStorage
let lastGrindTime = localStorage.getItem('lastGrindTime') || 0;
const grindCooldown = 5 * 1000; // Cooldown time in milliseconds (5 seconds for this example)

// Function to update the currency in localStorage
function updateCurrency(newCurrency) {
    currency = newCurrency;
    currencyDisplay.textContent = currency;
    localStorage.setItem('currency', currency);
}

// Handle grind button click
grindButton.addEventListener('click', () => {
    const currentTime = Date.now();
    
    // Check if the cooldown has passed
    if (currentTime - lastGrindTime >= grindCooldown) {
        // Simulate the grind action
        const earnedCoins = Math.floor(Math.random() * 10) + 1; // Random coins between 1 and 10
        updateCurrency(currency + earnedCoins);
        
        // Update the last grind time in localStorage
        lastGrindTime = currentTime;
        localStorage.setItem('lastGrindTime', lastGrindTime);
        
        // Hide cooldown message
        cooldownMessage.style.display = 'none';
    } else {
        // Show cooldown message
        cooldownMessage.style.display = 'block';
    }
});

// Update currency on page load
updateCurrency(currency);

// Set a timeout to hide the cooldown message if it's visible
setInterval(() => {
    const currentTime = Date.now();
    if (currentTime - lastGrindTime >= grindCooldown) {
        cooldownMessage.style.display = 'none';
    }
}, 1000);

// Chat functionality
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');

// Function to display the chat message
function displayChatMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to the latest message
}

// Send chat message
sendChatButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        displayChatMessage(`You: ${message}`);
        chatInput.value = ''; // Clear the input field
    }
});

// Optional: You can also handle "Enter" to send a message
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatButton.click();
    }
});
