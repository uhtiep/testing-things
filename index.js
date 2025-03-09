// List of anime with names, streaming links, embed links, and categories
const animeList = [
    { name: "Naruto", url: "https://zoro.to/watch/naruto-dub-5", embed: "https://zoro.to/embed/1/15642", genres: ["Action", "Adventure", "Shonen"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "Attack on Titan", url: "https://9anime.to/watch/attack-on-titan-3y98", embed: "https://9anime.to/embed/attack-on-titan-3468", genres: ["Action", "Drama", "Shonen"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "One Piece", url: "https://9anime.to/watch/one-piece-121x", embed: "https://9anime.to/embed/one-piece-1234", genres: ["Action", "Adventure", "Shonen"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "My Hero Academia", url: "https://zoro.to/watch/my-hero-academia-ep-1-12345", embed: "https://zoro.to/embed/hero-academia-4356", genres: ["Action", "Superhero", "Shonen"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "Demon Slayer", url: "https://9anime.to/watch/demon-slayer-kimetsu-no-yaiba-150x", embed: "https://9anime.to/embed/demon-slayer-9090", genres: ["Action", "Fantasy", "Adventure"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "Dragon Ball Z", url: "https://zoro.to/watch/dragon-ball-z-ep-3", embed: "https://zoro.to/embed/dbz-3130", genres: ["Action", "Adventure", "Shonen"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "Fullmetal Alchemist: Brotherhood", url: "https://9anime.to/watch/fullmetal-alchemist-brotherhood-3y68", embed: "https://9anime.to/embed/fma-brotherhood-7881", genres: ["Action", "Adventure", "Drama"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "One Punch Man", url: "https://zoro.to/watch/one-punch-man-1-ep-2", embed: "https://zoro.to/embed/one-punch-man-5532", genres: ["Action", "Comedy", "Superhero"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "Sword Art Online", url: "https://9anime.to/watch/sword-art-online-r41v", embed: "https://9anime.to/embed/sword-art-online-5678", genres: ["Action", "Adventure", "Fantasy"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "Tokyo Ghoul", url: "https://zoro.to/watch/tokyo-ghoul-s2-1", embed: "https://zoro.to/embed/tokyo-ghoul-2017", genres: ["Action", "Horror", "Supernatural"], services: ["Zoro", "Miruiro", "Aniwave"] },
    { name: "Death Note", url: "https://9anime.to/watch/death-note-15xx", embed: "https://9anime.to/embed/death-note-2980", genres: ["Mystery", "Supernatural", "Psychological"], services: ["Zoro", "Miruiro", "Aniwave"] },
    // Add 90 more anime with appropriate genres, streaming service embeds, etc.
    { name: "Naruto Shippuden", url: "https://miruro.tv/watch/naruto-shippuden-01", embed: "https://miruro.tv/embed/1/15432", genres: ["Action", "Adventure", "Shonen"], services: ["Miruiro", "Aniwave", "Zoro"] },
    { name: "Bleach", url: "https://miruro.tv/watch/bleach-01", embed: "https://miruro.tv/embed/1/15433", genres: ["Action", "Adventure", "Shonen"], services: ["Miruiro", "Aniwave", "Zoro"] },
    { name: "Fairy Tail", url: "https://miruro.tv/watch/fairy-tail-01", embed: "https://miruro.tv/embed/1/15434", genres: ["Action", "Adventure", "Shonen"], services: ["Miruiro", "Aniwave", "Zoro"] },
    { name: "Black Clover", url: "https://miruro.tv/watch/black-clover-01", embed: "https://miruro.tv/embed/1/15435", genres: ["Action", "Adventure", "Fantasy"], services: ["Miruiro", "Aniwave", "Zoro"] },
    { name: "Mob Psycho 100", url: "https://aniwave.se/watch/mob-psycho-100-01", embed: "https://aniwave.se/embed/1/15436", genres: ["Action", "Comedy", "Supernatural"], services: ["Aniwave", "Miruiro", "Zoro"] },
    { name: "Your Name", url: "https://aniwave.se/watch/your-name-01", embed: "https://aniwave.se/embed/1/15437", genres: ["Romance", "Drama", "Fantasy"], services: ["Aniwave", "Miruiro", "Zoro"] },
    { name: "Attack on Titan Season 2", url: "https://aniwave.se/watch/attack-on-titan-season-2-01", embed: "https://aniwave.se/embed/1/15438", genres: ["Action", "Drama", "Shonen"], services: ["Aniwave", "Miruiro", "Zoro"] },
    { name: "Fullmetal Alchemist", url: "https://animeflix.ltd/watch/fullmetal-alchemist-01", embed: "https://animeflix.ltd/embed/1/15439", genres: ["Action", "Adventure", "Drama"], services: ["Aniflix", "Miruiro", "Zoro"] },
    { name: "Code Geass", url: "https://animeflix.ltd/watch/code-geass-01", embed: "https://animeflix.ltd/embed/1/15440", genres: ["Action", "Drama", "Mecha"], services: ["Aniflix", "Miruiro", "Zoro"] },
    { name: "Neon Genesis Evangelion", url: "https://animeflix.ltd/watch/neon-genesis-evangelion-01", embed: "https://animeflix.ltd/embed/1/15441", genres: ["Mecha", "Action", "Psychological"], services: ["Aniflix", "Miruiro", "Zoro"] },
    { name: "One Punch Man", url: "https://animeflix.ltd/watch/one-punch-man-01", embed: "https://animeflix.ltd/embed/1/15442", genres: ["Action", "Comedy", "Superhero"], services: ["Aniflix", "Miruiro", "Zoro"] },
    { name: "JoJo's Bizarre Adventure", url: "https://animeflix.ltd/watch/jojos-bizarre-adventure-01", embed: "https://animeflix.ltd/embed/1/15443", genres: ["Action", "Adventure", "Supernatural"], services: ["Aniflix", "Miruiro", "Zoro"] },
    { name: "The Promised Neverland", url: "https://miruro.tv/watch/the-promised-neverland-01", embed: "https://miruro.tv/embed/1/15444", genres: ["Horror", "Psychological", "Drama"], services: ["Miruiro", "Aniwave", "Zoro"] },
    { name: "Re:Zero", url: "https://miruro.tv/watch/re-zero-01", embed: "https://miruro.tv/embed/1/15445", genres: ["Fantasy", "Action", "Drama"], services: ["Miruiro", "Aniwave", "Zoro"] },
    { name: "Fairy Tail", url: "https://animeflix.ltd/watch/fairy-tail-01", embed: "https://animeflix.ltd/embed/1/15446", genres: ["Action", "Adventure", "Shonen"], services: ["Aniflix", "Miruiro", "Zoro"] },
    { name: "Hunter x Hunter", url: "https://animeflix.ltd/watch/hunter-x-hunter-01", embed: "https://animeflix.ltd/embed/1/15447", genres: ["Action", "Adventure", "Shonen"], services: ["Aniflix", "Miruiro", "Zoro"] },
    // Add 80 more anime titles with appropriate embeds and genres
];

// Event listener for picking a random anime
document.getElementById('pickAnimeBtn').addEventListener('click', function() {
    const selectedGenres = Array.from(document.getElementById('genres').selectedOptions).map(option => option.value);
    const selectedService = document.getElementById('streamingService').value;

    // Filter anime by selected genres and streaming service
    const filteredAnime = animeList.filter(anime => {
        const matchesGenres = selectedGenres.every(genre => anime.genres.includes(genre));
        const matchesService = anime.services.includes(selectedService);
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
