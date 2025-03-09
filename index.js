// List of Roblox games with their names, links, and optional video embed (using YouTube trailers)
const games = [
    { name: "Adopt Me!", url: "https://www.roblox.com/games/920587237/Adopt-Me", embed: "https://www.youtube.com/embed/Ur91pfgwdv0" },
    { name: "Brookhaven", url: "https://www.roblox.com/games/4924922222/Brookhaven-RP", embed: "https://www.youtube.com/embed/gXrIATp-KXM" },
    { name: "Arsenal", url: "https://www.roblox.com/games/194275227/Arsenal", embed: "https://www.youtube.com/embed/6shJl2rQfgw" },
    { name: "Bloxburg", url: "https://www.roblox.com/games/185655149/Bloxburg", embed: "https://www.youtube.com/embed/9-KpkTux7Og" },
    { name: "Murder Mystery 2", url: "https://www.roblox.com/games/142823291/Murder-Mystery-2", embed: "https://www.youtube.com/embed/K7bFu_W4V0M" },
    { name: "Tower of Hell", url: "https://www.roblox.com/games/1962086868/Tower-of-Hell", embed: "https://www.youtube.com/embed/C7IQ44E9iy0" },
    { name: "Shindo Life", url: "https://www.roblox.com/games/6120752138/Shindo-Life", embed: "https://www.youtube.com/embed/j-p4Dlf2zXs" },
    { name: "Piggy", url: "https://www.roblox.com/games/4623386862/Piggy", embed: "https://www.youtube.com/embed/PlpkTqfv9sY" },
    { name: "Loomian Legacy", url: "https://www.roblox.com/games/4106970328/Loomian-Legacy", embed: "https://www.youtube.com/embed/PLVZzK_Crxw" },
    { name: "Flee the Facility", url: "https://www.roblox.com/games/184165349/Flee-the-Facility", embed: "https://www.youtube.com/embed/mKyyNjm5uU4" },
    { name: "Speed Run 4", url: "https://www.roblox.com/games/133322818/Speed-Run-4", embed: "https://www.youtube.com/embed/Dnb-QgKGRbc" },
    { name: "Vehicle Simulator", url: "https://www.roblox.com/games/233965426/Vehicle-Simulator", embed: "https://www.youtube.com/embed/ZGnqeF4o6pY" },
    { name: "Bee Swarm Simulator", url: "https://www.roblox.com/games/1537690964/Bee-Swarm-Simulator", embed: "https://www.youtube.com/embed/jD60Km9b8jY" },
    { name: "Build A Boat For Treasure", url: "https://www.roblox.com/games/537413528/Build-A-Boat-For-Treasure", embed: "https://www.youtube.com/embed/Mm08GZaVbRI" },
    { name: "Theme Park Tycoon 2", url: "https://www.roblox.com/games/460763277/Theme-Park-Tycoon-2", embed: "https://www.youtube.com/embed/4DkE2JdZQ6I" },
    { name: "Pet Simulator X", url: "https://www.roblox.com/games/752917684/Pet-Simulator-X", embed: "https://www.youtube.com/embed/D6PYy2fK6xQ" },
    { name: "SharkBite", url: "https://www.roblox.com/games/137250995/SharkBite", embed: "https://www.youtube.com/embed/tH2mkwERcfE" },
    { name: "The Mimic", url: "https://www.roblox.com/games/4553662773/The-Mimic", embed: "https://www.youtube.com/embed/LCH7BxltnsE" },
    { name: "Super Bomb Survival", url: "https://www.roblox.com/games/422994837/Super-Bomb-Survival", embed: "https://www.youtube.com/embed/qkPqlfYp4G8" },
    { name: "Club Iris", url: "https://www.roblox.com/games/1255278159/Club-Iris", embed: "https://www.youtube.com/embed/BzNsXcXJBCg" },
    { name: "Tower Defense Simulator", url: "https://www.roblox.com/games/3260590327/Tower-Defense-Simulator", embed: "https://www.youtube.com/embed/eoT1COjB0lY" },
    { name: "Epic Minigames", url: "https://www.roblox.com/games/163621197/Epic-Minigames", embed: "https://www.youtube.com/embed/d5x2fWGyA00" },
    { name: "Blox Fruits", url: "https://www.roblox.com/games/2753915549/Blox-Fruits", embed: "https://www.youtube.com/embed/fCPL3QnBdHw" },
    { name: "Rogue Lineage", url: "https://www.roblox.com/games/3012683500/Rogue-Lineage", embed: "https://www.youtube.com/embed/Az1M8G5wD0k" },
    { name: "Mining Simulator 2", url: "https://www.roblox.com/games/7032099057/Mining-Simulator-2", embed: "https://www.youtube.com/embed/nVRyFC-kzts" },
    { name: "Funky Friday", url: "https://www.roblox.com/games/6456357529/Funky-Friday", embed: "https://www.youtube.com/embed/k0wCjOB8HDs" },
    { name: "Dungeon Quest", url: "https://www.roblox.com/games/6031259457/Dungeon-Quest", embed: "https://www.youtube.com/embed/QvTeNkHzrdo" },
    { name: "Anime Fighters Simulator", url: "https://www.roblox.com/games/8239846009/Anime-Fighters-Simulator", embed: "https://www.youtube.com/embed/nPsyC54HkLU" },
    { name: "Rogue Lineage", url: "https://www.roblox.com/games/3012683500/Rogue-Lineage", embed: "https://www.youtube.com/embed/Vzzv2A4e_WA" },
    { name: "Pet Simulator", url: "https://www.roblox.com/games/3143102095/Pet-Simulator", embed: "https://www.youtube.com/embed/kU0cHl2JjHg" },
    { name: "Phantom Forces", url: "https://www.roblox.com/games/292439477/Phantom-Forces", embed: "https://www.youtube.com/embed/K-MxMHIspMI" },
    { name: "All Star Tower Defense", url: "https://www.roblox.com/games/4622112756/All-Star-Tower-Defense", embed: "https://www.youtube.com/embed/HzbKoG7tQ8A" },
    { name: "Lumber Tycoon 2", url: "https://www.roblox.com/games/86194414/Lumber-Tycoon-2", embed: "https://www.youtube.com/embed/1wBGZpAqzVQ" },
    { name: "Shindo Life", url: "https://www.roblox.com/games/6120752138/Shindo-Life", embed: "https://www.youtube.com/embed/W6q9pcwsKyk" },
    { name: "SharkBite", url: "https://www.roblox.com/games/137250995/SharkBite", embed: "https://www.youtube.com/embed/tH2mkwERcfE" },
    { name: "Super Bomb Survival", url: "https://www.roblox.com/games/422994837/Super-Bomb-Survival", embed: "https://www.youtube.com/embed/qkPqlfYp4G8" },

    // Adding 25 more games
    { name: "The Normal Elevator", url: "https://www.roblox.com/games/2672521554/The-Normal-Elevator", embed: "https://www.youtube.com/embed/t8y4h52xhhQ" },
    { name: "Superhero Tycoon", url: "https://www.roblox.com/games/480191661/Superhero-Tycoon", embed: "https://www.youtube.com/embed/Wv4-mKrQGCg" },
    { name: "Escape Room Tycoon", url: "https://www.roblox.com/games/6238852823/Escape-Room-Tycoon", embed: "https://www.youtube.com/embed/D-pvqs7hhtk" },
    { name: "Idle Miner Tycoon", url: "https://www.roblox.com/games/6227613355/Idle-Miner-Tycoon", embed: "https://www.youtube.com/embed/8LxTATgA2tY" },
    { name: "Fashion Famous", url: "https://www.roblox.com/games/285425267/Fashion-Famous", embed: "https://www.youtube.com/embed/fVVzP4LquAQ" },
    { name: "Shiny Hunting Simulator", url: "https://www.roblox.com/games/7757214343/Shiny-Hunting-Simulator", embed: "https://www.youtube.com/embed/p7JS9KLfHHM" },
    { name: "Hero Simulator", url: "https://www.roblox.com/games/3327523407/Hero-Simulator", embed: "https://www.youtube.com/embed/S5brZT1P0l4" },
    { name: "Escape The Supermarket Obby", url: "https://www.roblox.com/games/8156963915/Escape-The-Supermarket-Obby", embed: "https://www.youtube.com/embed/o9_qk8tAS3s" },
    { name: "Tiny Simulator", url: "https://www.roblox.com/games/6995595634/Tiny-Simulator", embed: "https://www.youtube.com/embed/dLFSxP4Odak" },
    { name: "Shimmering Shores", url: "https://www.roblox.com/games/1057658212/Shimmering-Shores", embed: "https://www.youtube.com/embed/auKHb3l7U5Y" },
    { name: "Monster Legends", url: "https://www.roblox.com/games/4811608995/Monster-Legends", embed: "https://www.youtube.com/embed/SfKDe_TQK2E" },
    { name: "Battle Cats Tycoon", url: "https://www.roblox.com/games/5723515541/Battle-Cats-Tycoon", embed: "https://www.youtube.com/embed/cfHaer7c3-A" },
    { name: "Survive The Disasters", url: "https://www.roblox.com/games/5244472855/Survive-The-Disasters", embed: "https://www.youtube.com/embed/VguPzD89Umg" },
    { name: "Frog Family Roleplay", url: "https://www.roblox.com/games/3873248592/Frog-Family-Roleplay", embed: "https://www.youtube.com/embed/pVg6A35UoHw" },
    { name: "Freddy Fazbear's Pizza", url: "https://www.roblox.com/games/4655769282/Freddy-Fazbears-Pizza", embed: "https://www.youtube.com/embed/fpPxzFXGos8" },
    { name: "Anime Dimensions", url: "https://www.roblox.com/games/5425505799/Anime-Dimensions", embed: "https://www.youtube.com/embed/PSqM5bUkCXM" },
    { name: "Ultimate Driving", url: "https://www.roblox.com/games/142823291/Ultimate-Driving", embed: "https://www.youtube.com/embed/7O3PBV0iFBs" },
    { name: "Bubble Gum Simulator", url: "https://www.roblox.com/games/1537690964/Bubble-Gum-Simulator", embed: "https://www.youtube.com/embed/hz_iPa3v4FQ" }
];

document.getElementById('pickGameBtn').addEventListener('click', function() {
    // Pick a random game
    const randomGame = games[Math.floor(Math.random() * games.length)];
    
    // Display the selected game
    const gameEmbedHTML = `
        <h3>Play: <a href="${randomGame.url}" target="_blank">${randomGame.name}</a></h3>
        <iframe width="560" height="315" src="${randomGame.embed}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    document.getElementById('gameEmbed').innerHTML = gameEmbedHTML;
});
