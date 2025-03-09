// List of Roblox games with their names, links, and YouTube embed links
const games = [
    { name: "Adopt Me!", url: "https://www.roblox.com/games/920587237/Adopt-Me", embed: "https://www.youtube.com/embed/Ur91pfgwdv0" },
    { name: "Brookhaven", url: "https://www.roblox.com/games/4924922222/Brookhaven-RP", embed: "https://www.youtube.com/embed/gXrIATp-KXM" },
    { name: "Arsenal", url: "https://www.roblox.com/games/194275227/Arsenal", embed: "https://www.youtube.com/embed/6shJl2rQfgw" },
    { name: "Bloxburg", url: "https://www.roblox.com/games/185655149/Bloxburg", embed: "https://www.youtube.com/embed/9-KpkTux7Og" },
    { name: "Murder Mystery 2", url: "https://www.roblox.com/games/142823291/Murder-Mystery-2", embed: "https://www.youtube.com/embed/K7bFu_W4V0M" },
    { name: "Tower of Hell", url: "https://www.roblox.com/games/1962086868/Tower-of-Hell", embed: "https://www.youtube.com/embed/C7IQ44E9iy0" },
    { name: "Shindo Life", url: "https://www.roblox.com/games/6120752138/Shindo-Life", embed: "https://www.youtube.com/embed/j-p4Dlf2zXs" },
    { name: "Piggy", url: "https://www.roblox.com/games/4623386862/Piggy", embed: "https://www.youtube.com/embed/PlpkTqfv9sY" },
    { name: "Flee the Facility", url: "https://www.roblox.com/games/184165349/Flee-the-Facility", embed: "https://www.youtube.com/embed/mKyyNjm5uU4" },
    { name: "Bee Swarm Simulator", url: "https://www.roblox.com/games/1537690964/Bee-Swarm-Simulator", embed: "https://www.youtube.com/embed/jD60Km9b8jY" },
    { name: "Vehicle Simulator", url: "https://www.roblox.com/games/233965426/Vehicle-Simulator", embed: "https://www.youtube.com/embed/ZGnqeF4o6pY" }
];

document.getElementById('pickGameBtn').addEventListener('click', function() {
    // Pick a random game
    const randomGame = games[Math.floor(Math.random() * games.length)];
    
    // Display the selected game
    const gameEmbedHTML = `
        <h3>Play: <a href="${randomGame.url}" target="_blank">${randomGame.name}</a></h3>
        <iframe src="${randomGame.embed}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    
    // Show the game container and populate with content
    const gameContainer = document.getElementById('gameEmbed');
    gameContainer.style.display = 'block';
    gameContainer.innerHTML = gameEmbedHTML;
});
