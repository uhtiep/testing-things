// List of anime with names, streaming links, embed links, and categories
const animeList = [
    { name: "Naruto", url: "https://zoro.to/watch/naruto-dub-5", embed: "https://zoro.to/embed/1/15642", genres: ["Action", "Adventure", "Shonen"] },
    { name: "Attack on Titan", url: "https://9anime.to/watch/attack-on-titan-3y98", embed: "https://9anime.to/embed/attack-on-titan-3468", genres: ["Action", "Drama", "Shonen"] },
    { name: "One Piece", url: "https://9anime.to/watch/one-piece-121x", embed: "https://9anime.to/embed/one-piece-1234", genres: ["Action", "Adventure", "Shonen"] },
    { name: "My Hero Academia", url: "https://zoro.to/watch/my-hero-academia-ep-1-12345", embed: "https://zoro.to/embed/hero-academia-4356", genres: ["Action", "Superhero", "Shonen"] },
    { name: "Demon Slayer", url: "https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-150x", embed: "https://9anime.to/embed/demon-slayer-9090", genres: ["Action", "Fantasy", "Adventure"] },
    { name: "Dragon Ball Z", url: "https://zoro.to/watch/dragon-ball-z-ep-3", embed: "https://zoro.to/embed/dbz-3130", genres: ["Action", "Adventure", "Shonen"] },
    { name: "Fullmetal Alchemist: Brotherhood", url: "https://9anime.to/watch/fullmetal-alchemist-brotherhood-3y68", embed: "https://9anime.to/embed/fma-brotherhood-7881", genres: ["Action", "Adventure", "Drama"] },
    { name: "One Punch Man", url: "https://zoro.to/watch/one-punch-man-1-ep-2", embed: "https://zoro.to/embed/one-punch-man-5532", genres: ["Action", "Comedy", "Superhero"] },
    { name: "Sword Art Online", url: "https://9anime.to/watch/sword-art-online-r41v", embed: "https://9anime.to/embed/sword-art-online-5678", genres: ["Action", "Adventure", "Fantasy"] },
    { name: "Tokyo Ghoul", url: "https://zoro.to/watch/tokyo-ghoul-s2-1", embed: "https://zoro.to/embed/tokyo-ghoul-2017", genres: ["Action", "Horror", "Supernatural"] },
    { name: "Death Note", url: "https://9anime.to/watch/death-note-15xx", embed: "https://9anime.to/embed/death-note-2980", genres: ["Mystery", "Supernatural", "Psychological"] },
    // Add more anime entries, assigning appropriate genres
];

// Event listener for picking a random anime
document.getElementById('pickAnimeBtn').addEventListener('click', function() {
    const selectedGenres = Array.from(document.getElementById('genres').selectedOptions).map(option => option.value);
    const selectedService = document.getElementById('streamingService').value;

    // Filter anime by selected genres and streaming service
    const filteredAnime = animeList.filter(anime => {
        const matchesGenres = selectedGenres.every(genre => anime.genres.includes(genre));
        const matchesService = anime.url.includes(selectedService.toLowerCase());
        return matchesGenres && matchesService;
    });

    // If no anime matches, show a message
    if (filteredAnime.length === 0) {
        document.getElementById('animeEmbed').innerHTML = '<p>No anime found for your selection!</p>';
        return;
    }

    // Pick a random anime from filtered list
    const randomAnime = filteredAnime[Math.floor(Math.random() * filteredAnime.length)];

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
