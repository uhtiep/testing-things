const servers = [
    { name: "Server 1", channels: ["general", "memes", "bot"], bot: "Dank Memer" },
    { name: "Server 2", channels: ["chat", "rules", "bot"], bot: "Dyno" },
    { name: "Server 3", channels: ["music", "fun", "bot"], bot: "Nekotina" },
    { name: "Server 4", channels: ["gaming", "news", "bot"], bot: "Custom Bot" }
];

let username = "";
let currentServer = 0;
let currentChannel = 0;

function joinChat() {
    username = document.getElementById('username').value || "Guest";
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
    switchServer(0);
}

function switchServer(index) {
    currentServer = index;
    const channelList = document.getElementById('channel-list');
    channelList.innerHTML = "";
    servers[index].channels.forEach((channel, i) => {
        const btn = document.createElement('button');
        btn.innerText = `#${channel}`;
        btn.onclick = () => switchChannel(i);
        channelList.appendChild(btn);
    });
    switchChannel(0);
}

function switchChannel(index) {
    currentChannel = index;
    document.getElementById('messages').innerHTML = "";
    sendBotMessage(`Welcome to #${servers[currentServer].channels[index]}!`);
}

function handleInput(event) {
    if (event.key === 'Enter') {
        const message = event.target.value;
        if (message.trim() !== "") {
            addMessage(username, message);
            sendBotReply(message);
            event.target.value = "";
        }
    }
}

function addMessage(user, message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${user}:</strong> ${message}`;
    document.getElementById('messages').appendChild(messageDiv);
    messageDiv.scrollIntoView();
}

function sendBotMessage(message) {
    setTimeout(() => addMessage(servers[currentServer].bot, message), 1000);
}

function sendBotReply(userMessage) {
    if (servers[currentServer].bot === "Dank Memer") {
        if (userMessage.includes("meme")) sendBotMessage("Here's a meme: 🐸");
    } else if (servers[currentServer].bot === "Dyno") {
        if (userMessage.includes("help")) sendBotMessage("Need help? Type !commands");
    } else if (servers[currentServer].bot === "Nekotina") {
        if (userMessage.includes("play")) sendBotMessage("Playing fire.mp3 🔥");
    }
}
