function submitText() {
    const usernameInput = document.getElementById('usernameInput').value;
    const textInput = document.getElementById('textInput').value;
    const checkbox = document.getElementById('checkbox').checked;
    const displayText = document.getElementById('displayText');

    if (textInput) {
        let textElement = document.createElement('p');
        
        // Use username if provided, otherwise default to "Anonymous"
        let username = usernameInput ? usernameInput : "Anonymous";
        textElement.textContent = `${username}: ${textInput}`;

        if (checkbox) {
            let checkIcon = document.createElement('span');
            checkIcon.textContent = '✔';
            checkIcon.classList.add('blue-check');
            textElement.appendChild(checkIcon);
        }

        displayText.appendChild(textElement);
    }

    // Clear the input after submission
    document.getElementById('usernameInput').value = '';
    document.getElementById('textInput').value = '';
}

function clearMessages() {
    const displayText = document.getElementById('displayText');
    displayText.innerHTML = '';  // Clears all messages
}

function goToNextPage() {
    // Hide the main page and show the game page
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
    document.getElementById('gamePage').style.display = 'block';
}

function goBack() {
    // Hide the game page and show the main page again
    document.getElementById('gamePage').style.display = 'none';
    document.getElementById('nextButton').style.display = 'block';
    document.getElementById('mainPage').style.display = 'block';
}
