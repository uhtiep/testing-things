// Array of random image URLs (you can add your own or find free-to-use ones online)
const images = [
    'https://source.unsplash.com/random/300x300?cat',
    'https://source.unsplash.com/random/300x300?dog',
    'https://source.unsplash.com/random/300x300?nature',
    'https://source.unsplash.com/random/300x300?city',
    'https://source.unsplash.com/random/300x300?space',
    'https://source.unsplash.com/random/300x300?beach',
    'https://source.unsplash.com/random/300x300?food',
    'https://source.unsplash.com/random/300x300?mountain',
    'https://source.unsplash.com/random/300x300?ocean',
    'https://source.unsplash.com/random/300x300?forest'
];

// Function to set a random image to the img tag
function setRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImageUrl = images[randomIndex];
    document.getElementById('random-image').src = randomImageUrl;
}

// Event listener for the button click
document.getElementById('click-btn').addEventListener('click', setRandomImage);

// Set an initial random image when the page loads
window.onload = setRandomImage;
