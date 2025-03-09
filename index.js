// List of anime with their names, streaming links from Zoro.to or 9anime
const animeList = [
    { name: "Naruto", url: "https://zoro.to/watch/naruto-dub-5", embed: "https://zoro.to/embed/1/15642" },
    { name: "Attack on Titan", url: "https://9anime.to/watch/attack-on-titan-3y98", embed: "https://9anime.to/embed/attack-on-titan-3468" },
    { name: "One Piece", url: "https://9anime.to/watch/one-piece-121x", embed: "https://9anime.to/embed/one-piece-1234" },
    { name: "My Hero Academia", url: "https://zoro.to/watch/my-hero-academia-ep-1-12345", embed: "https://zoro.to/embed/hero-academia-4356" },
    { name: "Demon Slayer", url: "https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-150x", embed: "https://9anime.to/embed/demon-slayer-9090" },
    { name: "Dragon Ball Z", url: "https://zoro.to/watch/dragon-ball-z-ep-3", embed: "https://zoro.to/embed/dbz-3130" },
    { name: "Fullmetal Alchemist: Brotherhood", url: "https://9anime.to/watch/fullmetal-alchemist-brotherhood-3y68", embed: "https://9anime.to/embed/fma-brotherhood-7881" },
    { name: "One Punch Man", url: "https://zoro.to/watch/one-punch-man-1-ep-2", embed: "https://zoro.to/embed/one-punch-man-5532" },
    { name: "Sword Art Online", url: "https://9anime.to/watch/sword-art-online-r41v", embed: "https://9anime.to/embed/sword-art-online-5678" },
    { name: "Tokyo Ghoul", url: "https://zoro.to/watch/tokyo-ghoul-s2-1", embed: "https://zoro.to/embed/tokyo-ghoul-2017" },
    { name: "Death Note", url: "https://9anime.to/watch/death-note-15xx", embed: "https://9anime.to/embed/death-note-2980" },
    { name: "Hunter x Hunter", url: "https://zoro.to/watch/hunter-x-hunter-1234", embed: "https://zoro.to/embed/hunter-x-hunter-2938" },
    { name: "Fullmetal Alchemist", url: "https://zoro.to/watch/fullmetal-alchemist-2345", embed: "https://zoro.to/embed/fma-3429" },
    // Add additional 90 anime entries in the same structure
    // Ensure that all anime have proper embed links from 9anime or Zoro.to
];

// Event listener for picking a random anime
document.getElementById('pickAnimeBtn').addEventListener('click', function() {
    // Pick a random anime
    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];

    // Display the selected anime
    const animeEmbedHTML = `
        <h3>Watch: <a href="${randomAnime.url}" target="_blank">${randomAnime.name}</a></h3>
        <iframe src="${randomAnime.embed}" frameborder="0" allowfullscreen></iframe>
    `;
    
    // Show the anime container and populate with content
    const animeContainer = document.getElementById('animeEmbed');
    animeContainer.style.display = 'block';
    animeContainer.innerHTML = animeEmbedHTML;
});
