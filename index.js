let countdown = 10.1;
let countdownInterval;
let cookieCount = 0;

const countdownElement = document.getElementById('countdown');
const startButton = document.getElementById('start-button');
const cookieButton = document.getElementById('cookie-button');
const cookieCountElement = document.getElementById('cookie-count');
const messageBox = document.getElementById('message-box');
const cookieContainer = document.getElementById('cookie-container');

startButton.addEventListener('click', startCountdown);

function startCountdown() {
  startButton.disabled = true; // Prevent multiple clicks

  countdownInterval = setInterval(() => {
    countdown -= 0.1;
    countdownElement.textContent = countdown.toFixed(1);

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      messageBox.innerHTML = '<h1>Your heart has stopped. Just kidding! Welcome to the game!</h1>';
      setTimeout(startGame, 2000);
    }
  }, 100);
}

function startGame() {
  messageBox.classList.add('hidden'); // Hide the initial message
  cookieContainer.classList.remove('hidden'); // Show the cookie clicker
  cookieButton.addEventListener('click', incrementCookies);
}

function incrementCookies() {
  cookieCount++;
  cookieCountElement.textContent = `Cookies: ${cookieCount}`;
}
