// List of Roblox games with their names and links
const games = [
    { name: "Adopt Me!", url: "https://www.roblox.com/games/920587237/Adopt-Me" },
    { name: "Brookhaven", url: "https://www.roblox.com/games/4924922222/Brookhaven-RP" },
    { name: "Arsenal", url: "https://www.roblox.com/games/194275227/Arsenal" },
    { name: "Bloxburg", url: "https://www.roblox.com/games/185655149/Bloxburg" },
    { name: "Murder Mystery 2", url: "https://www.roblox.com/games/142823291/Murder-Mystery-2" },
    { name: "Tower of Hell", url: "https://www.roblox.com/games/1962086868/Tower-of-Hell" },
    { name: "Shindo Life", url: "https://www.roblox.com/games/6120752138/Shindo-Life" },
    { name: "Piggy", url: "https://www.roblox.com/games/4623386862/Piggy" }
];

document.getElementById('pickGameBtn').addEventListener('click', function() {
    // Pick a random game from the list
    const randomGame = games[Math.floor(Math.random() * games.length)];

    // Display the game name and link
    const gameLinkContainer = document.getElementById('gameLinkContainer');
    const gameLink = document.getElementById('gameLink');

    gameLink.textContent = `Play ${randomGame.name}`;
    gameLink.href = randomGame.url;
    gameLink.target = "_blank";
});
