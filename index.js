// Game data (static list as an example)
const games = [
    {
        name: 'Adopt Me!',
        totalVisits: 2900000000,
        currentPlayers: 4000,
        gameLink: 'https://www.roblox.com/games/920587237/Adopt-Me',
        videoId: 'm5RO4VwmOk4'  // YouTube video ID
    },
    {
        name: 'Brookhaven',
        totalVisits: 1500000000,
        currentPlayers: 3000,
        gameLink: 'https://www.roblox.com/games/4924922222/Brookhaven',
        videoId: 'Q2Yhgxi7gyk'  // YouTube video ID
    },
    {
        name: 'Arsenal',
        totalVisits: 500000000,
        currentPlayers: 1500,
        gameLink: 'https://www.roblox.com/games/286090429/Arsenal',
        videoId: 'At_k5GntZpk'  // YouTube video ID
    }
    // Add more games here as needed
];

// Function to pick a random game and display the details
document.getElementById('getGameButton').addEventListener('click', function() {
    // Pick a random game from the list
    const randomIndex = Math.floor(Math.random() * games.length);
    const game = games[randomIndex];

    // Update the page with the selected game details
    document.getElementById('gameName').textContent = game.name;
    document.getElementById('totalVisits').textContent = game.totalVisits.toLocaleString();
    document.getElementById('currentPlayers').textContent = game.currentPlayers;
    document.getElementById('gameLink').href = game.gameLink;
    document.getElementById('gameLink').textContent = 'Play the game';
    document.getElementById('gameVideo').src = `https://www.youtube.com/embed/${game.videoId}`;

    // Make the game info section visible
    document.getElementById('gameInfo').style.display = 'block';
});
