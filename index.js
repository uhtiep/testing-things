// Spotify track URIs
const songs = [
    "https://open.spotify.com/embed/track/0BZ1lKlzvIthcq1BJHgmpn", // I Must Apologize
    "https://open.spotify.com/embed/track/4A84P5U5dTgIF0lqhbjK3P", // Identity
    "https://open.spotify.com/embed/track/5yH6D2E6s8IhgdGtzmcUE2", // Queen
    "https://open.spotify.com/embed/track/2eOBvYd0xLyPAtYTu6UnJz", // Hito Mania
    "https://open.spotify.com/embed/track/3LrVEvF8fqO6X4hW9kg6Sc", // Medicine
    "https://open.spotify.com/embed/track/1KtyTCIhGswNsHffBOxFVY", // Crime and Punishment Reloaded
    "https://open.spotify.com/embed/track/5D8ZqL3E85EtUmul7ViTfI", // Neverland
    "https://open.spotify.com/embed/track/6eENJ7g2plJ5OuIoYhX79Q"  // Non-Breath Oblige
];

// Shuffle songs each time the page loads
let shuffledSongs = songs.sort(() => Math.random() - 0.5);
let currentIndex = 0;
const spotifyFrame = document.getElementById("spotify-frame");

// Load first song
function loadSong(index) {
    spotifyFrame.src = shuffledSongs[index];
}

// Play next song
document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % shuffledSongs.length;
    loadSong(currentIndex);
});

// Play previous song
document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + shuffledSongs.length) % shuffledSongs.length;
    loadSong(currentIndex);
});

// Play/Pause (Spotify embed doesn't support full control, but reloads the song)
document.getElementById("play").addEventListener("click", () => {
    spotifyFrame.src = shuffledSongs[currentIndex];
});

// Load the first song on page load
loadSong(currentIndex);
