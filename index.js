document.addEventListener("DOMContentLoaded", () => {
    const lanes = {
        "d": document.getElementById("d-lane"),
        "f": document.getElementById("f-lane"),
        "j": document.getElementById("j-lane"),
        "k": document.getElementById("k-lane")
    };

    // Chart synced to "kikuo_-_Aishite_(Hydr0.org).mp3"
    const chart = [
        { time: 1000, key: "d", type: "tap" },
        { time: 1500, key: "f", type: "tap" },
        { time: 2000, key: "j", type: "tap" },
        { time: 2500, key: "k", type: "tap" },
        { time: 3000, key: "d", type: "hold", duration: 1500 },
        { time: 5000, key: "f", type: "tap" },
        { time: 6000, key: "j", type: "hold", duration: 2000 },
        { time: 8500, key: "k", type: "tap" },
        { time: 10000, key: "d", type: "tap" },
        { time: 12000, key: "f", type: "hold", duration: 2500 },
        { time: 16000, key: "j", type: "tap" },
        { time: 18000, key: "k", type: "tap" },
        { time: 20000, key: "d", type: "tap" },
        { time: 22000, key: "f", type: "tap" },
        { time: 24000, key: "j", type: "hold", duration: 3000 },
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
        music.currentTime = 0; // Ensure song restarts properly
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
