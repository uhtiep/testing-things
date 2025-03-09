// List of anime with their names, links, and YouTube embed links (for trailers)
const animeList = [
    { name: "Naruto", url: "https://www.crunchyroll.com/naruto", embed: "https://www.youtube.com/embed/3u3bpFjsV2A" },
    { name: "Attack on Titan", url: "https://www.crunchyroll.com/attack-on-titan", embed: "https://www.youtube.com/embed/65q8yB-MGA4" },
    { name: "One Piece", url: "https://www.crunchyroll.com/one-piece", embed: "https://www.youtube.com/embed/hKcmz6vquIk" },
    { name: "My Hero Academia", url: "https://www.crunchyroll.com/my-hero-academia", embed: "https://www.youtube.com/embed/iw6y5GrJ18Q" },
    { name: "Demon Slayer", url: "https://www.crunchyroll.com/demon-slayer", embed: "https://www.youtube.com/embed/CWg63uGe_HI" },
    { name: "Dragon Ball Z", url: "https://www.crunchyroll.com/dragon-ball-z", embed: "https://www.youtube.com/embed/3UuXH7AiZ3w" },
    { name: "Fullmetal Alchemist: Brotherhood", url: "https://www.crunchyroll.com/fullmetal-alchemist-brotherhood", embed: "https://www.youtube.com/embed/d5uLZzj5_vA" },
    { name: "One Punch Man", url: "https://www.crunchyroll.com/one-punch-man", embed: "https://www.youtube.com/embed/7mK-wfGF9Vw" },
    { name: "Sword Art Online", url: "https://www.crunchyroll.com/sword-art-online", embed: "https://www.youtube.com/embed/Q-hXXB_hP5k" },
    { name: "Tokyo Ghoul", url: "https://www.crunchyroll.com/tokyo-ghoul", embed: "https://www.youtube.com/embed/2vXlGJ4O2SY" }
];

document.getElementById('pickAnimeBtn').addEventListener('click', function() {
    // Pick a random anime
    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];

    // Display the selected anime
    const animeEmbedHTML = `
        <h3>Watch: <a href="${randomAnime.url}" target="_blank">${randomAnime.name}</a></h3>
        <iframe src="${randomAnime.embed}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    
    // Show the anime container and populate with content
    const animeContainer = document.getElementById('animeEmbed');
    animeContainer.style.display = 'block';
    animeContainer.innerHTML = animeEmbedHTML;
});
