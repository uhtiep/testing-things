document.addEventListener("DOMContentLoaded", () => {
    const lanes = {
        "d": document.getElementById("d-lane"),
        "f": document.getElementById("f-lane"),
        "j": document.getElementById("j-lane"),
        "k": document.getElementById("k-lane")
    };

    const chart = generateFullChart();
    let score = 0;
    const scoreDisplay = document.getElementById("score");
    const music = document.getElementById("music");
    const startButton = document.getElementById("startButton");

    function createNote(key, type, duration = 0) {
        const note = document.createElement("div");
        note.classList.add(type === "hold" ? "hold-note" : "note");

        if (type === "hold") {
            note.style.height = `${duration / 3}px`;
        }

        lanes[key].appendChild(note);

        let position = -40;
        const fallSpeed = 4;

        function moveNote() {
            position += fallSpeed;
            note.style.top = position + "px";

            if (position > 600) {
                note.remove();
            } else {
                requestAnimationFrame(moveNote);
            }
        }
        moveNote();
    }

    function startGame() {
        music.currentTime = 0;
        music.play();

        chart.forEach((note) => {
            setTimeout(() => {
                createNote(note.key, note.type, note.duration);
            }, note.time);
        });
    }

    // Input handling for D, F, J, and K keys
    document.addEventListener("keydown", (event) => {
        if (lanes[event.key]) {
            const lane = lanes[event.key];
            const notes = lane.getElementsByClassName("note");
            const holdNotes = lane.getElementsByClassName("hold-note");

            if (notes.length > 0) {
                const note = notes[0];
                const notePos = parseInt(note.style.top);

                if (notePos > 520 && notePos < 580) {
                    score += 100;
                    note.remove();
                }
            }

            if (holdNotes.length > 0) {
                const holdNote = holdNotes[0];
                const holdPos = parseInt(holdNote.style.top);

                if (holdPos > 520 && holdPos < 580) {
                    score += 150;
                    holdNote.remove();
                }
            }

            scoreDisplay.textContent = score;
        }
    });

    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        startGame();
    });

    function generateFullChart() {
        const chart = [];
        const keys = ["d", "f", "j", "k"];
        let currentTime = 1000;

        // Create notes throughout the entire song (~3:50 min)
        while (currentTime < 230000) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            const type = Math.random() > 0.8 ? "hold" : "tap";
            const duration = type === "hold" ? Math.random() * 2000 + 1000 : 0;

            chart.push({ time: currentTime, key, type, duration });
            currentTime += Math.random() * 800 + 300; // Randomize note intervals
        }

        return chart;
    }
});
