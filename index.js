// List of Roblox games with their names and links
const games = [
    { name: "Adopt Me!", url: "https://www.roblox.com/games/920587237/Adopt-Me" },
    { name: "Brookhaven", url: "https://www.roblox.com/games/4924922222/Brookhaven-RP" },
    { name: "Arsenal", url: "https://www.roblox.com/games/194275227/Arsenal" },
    { name: "Bloxburg", url: "https://www.roblox.com/games/185655149/Bloxburg" },
    { name: "Murder Mystery 2", url: "https://www.roblox.com/games/142823291/Murder-Mystery-2" },
    { name: "Tower of Hell", url: "https://www.roblox.com/games/1962086868/Tower-of-Hell" },
    { name: "Shindo Life", url: "https://www.roblox.com/games/6120752138/Shindo-Life" },
    { name: "Piggy", url: "https://www.roblox.com/games/4623386862/Piggy" },
    { name: "Loomian Legacy", url: "https://www.roblox.com/games/4106970328/Loomian-Legacy" },
    { name: "Flee the Facility", url: "https://www.roblox.com/games/184165349/Flee-the-Facility" },
    { name: "Speed Run 4", url: "https://www.roblox.com/games/133322818/Speed-Run-4" },
    { name: "Vehicle Simulator", url: "https://www.roblox.com/games/233965426/Vehicle-Simulator" },
    { name: "Murder Mystery 3", url: "https://www.roblox.com/games/4365864411/Murder-Mystery-3" },
    { name: "Bee Swarm Simulator", url: "https://www.roblox.com/games/1537690964/Bee-Swarm-Simulator" },
    { name: "Build A Boat For Treasure", url: "https://www.roblox.com/games/537413528/Build-A-Boat-For-Treasure" },
    { name: "Theme Park Tycoon 2", url: "https://www.roblox.com/games/460763277/Theme-Park-Tycoon-2" },
    { name: "Pet Simulator X", url: "https://www.roblox.com/games/752917684/Pet-Simulator-X" },
    { name: "SharkBite", url: "https://www.roblox.com/games/137250995/SharkBite" },
    { name: "The Mimic", url: "https://www.roblox.com/games/4553662773/The-Mimic" },
    { name: "Super Bomb Survival", url: "https://www.roblox.com/games/422994837/Super-Bomb-Survival" },
    { name: "Club Iris", url: "https://www.roblox.com/games/1255278159/Club-Iris" },
    { name: "Tower Defense Simulator", url: "https://www.roblox.com/games/3260590327/Tower-Defense-Simulator" },
    { name: "Epic Minigames", url: "https://www.roblox.com/games/163621197/Epic-Minigames" },
    { name: "Blox Fruits", url: "https://www.roblox.com/games/2753915549/Blox-Fruits" },
    { name: "Rogue Lineage", url: "https://www.roblox.com/games/3012683500/Rogue-Lineage" },
    { name: "Mining Simulator 2", url: "https://www.roblox.com/games/7032099057/Mining-Simulator-2" },
    { name: "Funky Friday", url: "https://www.roblox.com/games/6456357529/Funky-Friday" },
    { name: "Dungeon Quest", url: "https://www.roblox.com/games/6031259457/Dungeon-Quest" },
    { name: "Anime Fighters Simulator", url: "https://www.roblox.com/games/8239846009/Anime-Fighters-Simulator" },
    { name: "Rogue Lineage", url: "https://www.roblox.com/games/3012683500/Rogue-Lineage" },
    { name: "Pet Simulator", url: "https://www.roblox.com/games/3143102095/Pet-Simulator" },
    { name: "Phantom Forces", url: "https://www.roblox.com/games/292439477/Phantom-Forces" },
    { name: "All Star Tower Defense", url: "https://www.roblox.com/games/4622112756/All-Star-Tower-Defense" },
    { name: "Bloxburg", url: "https://www.roblox.com/games/185655149/Bloxburg" },
    { name: "Lumber Tycoon 2", url: "https://www.roblox.com/games/86194414/Lumber-Tycoon-2" },
    { name: "Shindo Life", url: "https://www.roblox.com/games/6120752138/Shindo-Life" },
    { name: "SharkBite", url: "https://www.roblox.com/games/137250995/SharkBite" },
    { name: "Vehicle Simulator", url: "https://www.roblox.com/games/233965426/Vehicle-Simulator" },
    { name: "Super Bomb Survival", url: "https://www.roblox.com/games/422994837/Super-Bomb-Survival" },

    // Adding some lesser-known games
    { name: "The Normal Elevator", url: "https://www.roblox.com/games/2672521554/The-Normal-Elevator" },
    { name: "Superhero Tycoon", url: "https://www.roblox.com/games/480191661/Superhero-Tycoon" },
    { name: "Escape Room Tycoon", url: "https://www.roblox.com/games/6238852823/Escape-Room-Tycoon" },
    { name: "Idle Miner Tycoon", url: "https://www.roblox.com/games/6227613355/Idle-Miner-Tycoon" },
    { name: "Fashion Famous", url: "https://www.roblox.com/games/285425267/Fashion-Famous" },
    { name: "Shiny Hunting Simulator", url: "https://www.roblox.com/games/7757214343/Shiny-Hunting-Simulator" },
    { name: "Hero Simulator", url: "https://www.roblox.com/games/3327523407/Hero-Simulator" },
    { name: "Escape The Supermarket Obby", url: "https://www.roblox.com/games/8156963915/Escape-The-Supermarket-Obby" },
    { name: "Tiny Simulator", url: "https://www.roblox.com/games/6995595634/Tiny-Simulator" },
    { name: "Shimmering Shores", url: "https://www.roblox.com/games/1057658212/Shimmering-Shores" },
    { name: "Monster Legends", url: "https://www.roblox.com/games/4811608995/Monster-Legends" },
    { name: "Battle Cats Tycoon", url: "https://www.roblox.com/games/5723515541/Battle-Cats-Tycoon" },
    { name: "Survive The Disasters", url: "https://www.roblox.com/games/5244472855/Survive-The-Disasters" },
    { name: "Frog Family Roleplay", url: "https://www.roblox.com/games/3873248592/Frog-Family-Roleplay" },
    { name: "Freddy Fazbear's Pizza", url: "https://www.roblox.com/games/4655769282/Freddy-Fazbears-Pizza" },
    { name: "Anime Dimensions", url: "https://www.roblox.com/games/5425505799/Anime-Dimensions" },
    { name: "Ultimate Driving", url: "https://www.roblox.com/games/142823291/Ultimate-Driving" },
    { name: "Bubble Gum Simulator", url: "https://www.roblox.com/games/1537690964/Bubble-Gum-Simulator" }
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
