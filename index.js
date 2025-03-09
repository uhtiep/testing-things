// Set up currency
let currency = 0;
const currencyDisplay = document.getElementById('currency');
const grindButton = document.getElementById('grind-button');

// Simulate currency grinding when clicking the button
grindButton.addEventListener('click', () => {
    const earnedCoins = Math.floor(Math.random() * 10) + 1; // Random coins between 1 and 10
    currency += earnedCoins;
    currencyDisplay.textContent = currency;
});

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
