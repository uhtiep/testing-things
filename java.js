function submitText() {
    const textInput = document.getElementById('textInput').value;
    const checkbox = document.getElementById('checkbox').checked;
    const displayText = document.getElementById('displayText');

    if (textInput) {
        let textElement = document.createElement('p');
        textElement.textContent = textInput;

        if (checkbox) {
            let checkIcon = document.createElement('span');
            checkIcon.textContent = '✔';
            checkIcon.classList.add('blue-check');
            textElement.appendChild(checkIcon);
        }

        displayText.appendChild(textElement);
    }

    // Clear the input after submission
    document.getElementById('textInput').value = '';
}
