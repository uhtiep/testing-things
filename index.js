document.addEventListener("DOMContentLoaded", () => {
    const lanes = {
        "c": document.getElementById("c-lane"),
        "n": document.getElementById("n-lane")
    };

    const chart = [
        { time: 1000, key: "c", type: "tap" },
        { time: 1500, key: "n", type: "tap" },
        { time: 2200, key: "c", type: "hold", duration: 1200 },
        { time: 4000, key: "n", type: "tap" },
        { time: 5500, key: "c", type: "hold", duration: 1800 },
    ];

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
        music.play();

        chart.forEach((note) => {
            setTimeout(() => {
                createNote(note.key, note.type, note.duration);
            }, note.time);
        });
    }

    // Input handling for C and N keys
    document.addEventListener("keydown", (event) => {
        if (event.key === "c" || event.key === "n") {
            const lane = lanes[event.key];
            const notes = lane.getElementsByClassName("note");
            const holdNotes = lane.getElementsByClassName("hold-note");

            if (notes.length > 0) {
                const note = notes[0];
                const notePos = parseInt(note.style.top);

                // Check if the note is in the hit window
                if (notePos > 520 && notePos < 580) {
                    score += 100;
                    note.remove();
                }
            }

            if (holdNotes.length > 0) {
                const holdNote = holdNotes[0];
                const holdPos = parseInt(holdNote.style.top);

                // Check if hold note is within the hit window
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
});
