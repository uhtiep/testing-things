const servers = [
    { name: "Server 1", channels: ["general", "memes", "bot"], bot: "Dank Memer" },
    { name: "Server 2", channels: ["chat", "rules", "bot"], bot: "Dyno" },
    { name: "Server 3", channels: ["music", "fun", "bot"], bot: "Nekotina" },
    { name: "Server 4", channels: ["gaming", "news", "bot"], bot: "Custom Bot" }
];

let username = "";
let currentServer = 0;
let currentChannel = 0;
let peers = [];

function joinChat() {
    username = document.getElementById('username').value || "Guest";
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('chat-app').classList.remove('hidden');
    loadServers();
    connectToPeers();
}

function loadServers() {
    const serverList = document.getElementById('server-list');
    servers.forEach((server, i) => {
        const btn = document.createElement('button');
        btn.innerText = server.name;
        btn.onclick = () => switchServer(i);
        serverList.appendChild(btn);
    });
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
    document.getElementById('chat-header').innerText = `#${servers[currentServer].channels[index]}`;
    document.getElementById('message-display').innerHTML = "";
    sendBotMessage(`Welcome to the happy palace! im kiddin', yo! wecome to  #${servers[currentServer].channels[index]}`);
}

function sendMessage(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        if (message) {
            displayMessage(username, message);
            broadcastMessage({ type: 'chat', user: username, message });
            input.value = "";
            handleBotResponse(message);
        }
    }
}

function displayMessage(user, message) {
    const display = document.getElementById('message-display');
    const msg = document.createElement('div');
    msg.innerHTML = `<strong>${user}:</strong> ${message}`;
    display.appendChild(msg);
    display.scrollTop = display.scrollHeight;
}

function sendBotMessage(message) {
    setTimeout(() => displayMessage(servers[currentServer].bot, message), 1000);
}

function handleBotResponse(message) {
    const bot = servers[currentServer].bot;
    if (bot === "Dank Memer" && message.includes("meme")) {
        sendBotMessage("Here's a memity meme!: 🐸");
    }
    if (bot === "Dyno" && message.includes("help")) {
        sendBotMessage("wow buddy!! ya dont need no help!");
    }
    if (bot === "Nekotina" && message.includes("play")) {
        sendBotMessage("Playing firey music! 🔥");
    }
}

// WebRTC Functions
function connectToPeers() {
    const peer = new RTCPeerConnection();
    peers.push(peer);
    peer.ondatachannel = (event) => setupDataChannel(event.channel);

    const channel = peer.createDataChannel("chat");
    setupDataChannel(channel);

    peer.createOffer().then((offer) => peer.setLocalDescription(offer));

    // Simulate signaling (for demo purposes, usually a signaling server is needed)
    setTimeout(() => receiveOffer(peer.localDescription), 2000);
}

function receiveOffer(offer) {
    const peer = new RTCPeerConnection();
    peers.push(peer);
    peer.ondatachannel = (event) => setupDataChannel(event.channel);
    peer.setRemoteDescription(offer);
    peer.createAnswer().then((answer) => peer.setLocalDescription(answer));
}

function setupDataChannel(channel) {
    channel.onmessage = (event) => {
        const { user, message } = JSON.parse(event.data);
        displayMessage(user, message);
    };
}

function broadcastMessage(data) {
    peers.forEach((peer) => {
        const channel = peer.createDataChannel("chat");
        channel.send(JSON.stringify(data));
    });
}
