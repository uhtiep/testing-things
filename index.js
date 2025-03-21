document.addEventListener("DOMContentLoaded", () => {
    const lanes = {
        "c": document.getElementById("c-lane"),
        "n": document.getElementById("n-lane")
    };

    // Chart synchronized with "kikuo_-_Aishite_(Hydr0.org).mp3"
    const chart = [
        { time: 1500, key: "c", type: "tap" },
        { time: 3000, key: "n", type: "tap" },
        { time: 4500, key: "c", type: "tap" },
        { time: 6000, key: "n", type: "tap" },
        { time: 7500, key: "c", type: "hold", duration: 1500 },
        { time: 10000, key: "n", type: "tap" },
        { time: 11500, key: "c", type: "tap" },
        { time: 13000, key: "n", type: "hold", duration: 2000 },
        { time: 16500, key: "c", type: "tap" },
        { time: 18000, key: "n", type: "tap" },
        { time: 19500, key: "c", type: "tap" },
        { time: 21000, key: "n", type: "tap" },
        { time: 23000, key: "c", type: "hold", duration: 3000 },
        { time: 27000, key: "n", type: "tap" },
        { time: 28500, key: "c", type: "tap" },
        { time: 30000, key: "n", type: "hold", duration: 2500 },
        { time: 34000, key: "c", type: "tap" },
        { time: 35500, key: "n", type: "tap" },
        { time: 37000, key: "c", type: "tap" },
        { time: 38500, key: "n", type: "tap" },
        { time: 40500, key: "c", type: "hold", duration: 3500 },
        { time: 46000, key: "n", type: "tap" },
        { time: 47500, key: "c", type: "tap" },
        { time: 49000, key: "n", type: "hold", duration: 3000 },
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
