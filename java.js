function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function submitMessage() {
    let username = document.getElementById('username').value || 'Anonymous';
    let message = document.getElementById('userMessage').value;
    let addCheck = document.getElementById('addCheck').checked ? '✔️' : '';

    if (message) {
        let messageList = document.getElementById('messageList');
        let newMessage = document.createElement('p');
        newMessage.innerHTML = `<strong>${username}:</strong> ${message} ${addCheck}`;
        messageList.appendChild(newMessage);
    }
}

function clearMessages() {
    document.getElementById('messageList').innerHTML = '';
}
