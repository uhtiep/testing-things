// Array of game objects with name and game ID (Just an example, you should continue adding more games)
const games = [
    { name: "Adopt Me!", gameId: "920587237" },
    { name: "Brookhaven", gameId: "4924922222" },
    { name: "Arsenal", gameId: "291056764" },
    { name: "Bloxburg", gameId: "185655149" },
    { name: "Tower of Hell", gameId: "1962086860" },
    { name: "Murder Mystery 2", gameId: "142823291" },
    { name: "Piggy", gameId: "4623386862" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Flee the Facility", gameId: "184191456" },
    { name: "MeepCity", gameId: "370931780" },
    { name: "The Mimic", gameId: "7104977340" },
    { name: "Murder Mystery X", gameId: "3695061718" },
    { name: "Tower Defense Simulator", gameId: "6516141723" },
    { name: "Blox Fruits", gameId: "4520744810" },
    { name: "Vehicle Simulator", gameId: "1962086841" },
    { name: "Speed Run 4", gameId: "122421227" },
    { name: "Epic Minigames", gameId: "251264357" },
    { name: "Super Bomb Survival", gameId: "426425213" },
    { name: "Murder Mystery", gameId: "275425198" },
    { name: "Natural Disaster Survival", gameId: "19353989" },
    { name: "Funky Friday", gameId: "7227251387" },
    { name: "Rogue Lineage", gameId: "3233176128" },
    { name: "Bee Swarm Simulator", gameId: "153769096" },
    { name: "Welcome to Bloxburg", gameId: "185655149" },
    { name: "All Star Tower Defense", gameId: "4997462737" },
    { name: "Brookhaven RP", gameId: "4924922222" },
    { name: "SharkBite", gameId: "287784633" },
    { name: "Lumber Tycoon 2", gameId: "204307925" },
    { name: "Build A Boat For Treasure", gameId: "537413528" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Bloxburg", gameId: "185655149" },
    { name: "Adopt Me!", gameId: "920587237" },
    { name: "Arsenal", gameId: "291056764" },
    { name: "Tower Defense Simulator", gameId: "6516141723" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Adopt Me!", gameId: "920587237" },
    { name: "Murder Mystery 2", gameId: "142823291" },
    { name: "Arsenal", gameId: "291056764" },
    { name: "Dungeon Quest", gameId: "4287741374" },
    { name: "Epic Minigames", gameId: "251264357" },
    { name: "Rogue Lineage", gameId: "3233176128" },
    { name: "Murder Mystery 2", gameId: "142823291" },
    { name: "Lumber Tycoon 2", gameId: "204307925" },
    { name: "Vehicle Simulator", gameId: "1962086841" },
    { name: "Tower of Hell", gameId: "1962086860" },
    { name: "Speed Run 4", gameId: "122421227" },
    { name: "SharkBite", gameId: "287784633" },
    { name: "Murder Mystery X", gameId: "3695061718" },
    { name: "MeepCity", gameId: "370931780" },
    { name: "Blox Fruits", gameId: "4520744810" },
    { name: "Brookhaven", gameId: "4924922222" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Natural Disaster Survival", gameId: "19353989" },
    { name: "Arsenal", gameId: "291056764" },
    { name: "Adopt Me!", gameId: "920587237" },
    { name: "Super Bomb Survival", gameId: "426425213" },
    { name: "Bloxburg", gameId: "185655149" },
    { name: "Flee the Facility", gameId: "184191456" },
    { name: "Rogue Lineage", gameId: "3233176128" },
    { name: "Piggy", gameId: "4623386862" },
    { name: "Tower of Hell", gameId: "1962086860" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Adopt Me!", gameId: "920587237" },
    { name: "Arsenal", gameId: "291056764" },
    { name: "Bloxburg", gameId: "185655149" },
    { name: "Dungeon Quest", gameId: "4287741374" },
    { name: "Murder Mystery 2", gameId: "142823291" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Vehicle Simulator", gameId: "1962086841" },
    { name: "Speed Run 4", gameId: "122421227" },
    { name: "Murder Mystery X", gameId: "3695061718" },
    { name: "Natural Disaster Survival", gameId: "19353989" },
    { name: "Blox Fruits", gameId: "4520744810" },
    { name: "MeepCity", gameId: "370931780" },
    { name: "SharkBite", gameId: "287784633" },
    { name: "Lumber Tycoon 2", gameId: "204307925" },
    { name: "Build A Boat For Treasure", gameId: "537413528" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Bloxburg", gameId: "185655149" },
    { name: "Adopt Me!", gameId: "920587237" },
    { name: "Arsenal", gameId: "291056764" },
    { name: "Tower Defense Simulator", gameId: "6516141723" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Adopt Me!", gameId: "920587237" },
    { name: "Murder Mystery 2", gameId: "142823291" },
    { name: "Arsenal", gameId: "291056764" },
    { name: "Dungeon Quest", gameId: "4287741374" },
    { name: "Epic Minigames", gameId: "251264357" },
    { name: "Rogue Lineage", gameId: "3233176128" },
    { name: "Murder Mystery 2", gameId: "142823291" },
    { name: "Lumber Tycoon 2", gameId: "204307925" },
    { name: "Vehicle Simulator", gameId: "1962086841" },
    { name: "Tower of Hell", gameId: "1962086860" },
    { name: "Speed Run 4", gameId: "122421227" },
    { name: "SharkBite", gameId: "287784633" },
    { name: "Murder Mystery X", gameId: "3695061718" },
    { name: "MeepCity", gameId: "370931780" },
    { name: "Blox Fruits", gameId: "4520744810" },
    { name: "Brookhaven", gameId: "4924922222" },
    { name: "Shindo Life", gameId: "4585672290" },
    { name: "Natural Disaster Survival", gameId: "19353989" },
    { name: "Arsenal", gameId: "291056764" },
    { name: "Adopt Me!", gameId: "920587237" },
    { name: "Super Bomb Survival", gameId: "426425213" },
    { name: "Bloxburg", gameId: "185655149" },
    { name: "Flee the Facility", gameId: "184191456" },
    { name: "Rogue Lineage", gameId: "3233176128" },
    { name: "Piggy", gameId: "4623386862" }, 
    { name: "Identity Fraud", gameId: "338521019" }
    // Add more games up to 400 here
];

// Function to load a random game and show it on the page
function loadRandomGame() {
    const randomGame = games[Math.floor(Math.random() * games.length)];

    // Determine the popularity of the game and its color
    let popularity = "";
    let popularityColor = "";

    if (randomGame.name === "Adopt Me!" || randomGame.name === "Brookhaven" || randomGame.name === "Arsenal") {
        popularity = "Super Popular";
        popularityColor = "green";
    } else if (randomGame.name === "Shindo Life" || randomGame.name === "Murder Mystery 2" || randomGame.name === "Bloxburg") {
        popularity = "Known";
        popularityColor = "yellow";
    } else {
        popularity = "Lesser Known";
        popularityColor = "red";
    }

    const gameUrl = `https://www.roblox.com/games/${randomGame.gameId}`;

    // Update the HTML content to show the selected game's data
    document.getElementById('gameName').textContent = `Game: ${randomGame.name}`;
    document.getElementById('totalVisits').textContent = `Total Visits: Not Provided`;
    document.getElementById('currentPlayers').innerHTML = `<span style="color: ${popularityColor};">${popularity}</span>`;
    document.getElementById('gameLink').innerHTML = `<a href="${gameUrl}" target="_blank">Play Game</a>`;
}

// Attach the click event to the "Get Random Game" button
document.getElementById('randomGameButton').addEventListener('click', loadRandomGame);

// Load a random game when the page is first loaded
loadRandomGame();
