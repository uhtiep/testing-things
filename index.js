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

    const heldKeys = {};

    document.addEventListener("keydown", (event) => {
        if (!heldKeys[event.key] && lanes[event.key]) {
            heldKeys[event.key] = true;
            checkNoteHit(event.key);
        }
    });

    document.addEventListener("keyup", (event) => {
        if (lanes[event.key]) {
            heldKeys[event.key] = false;
        }
    });

    function checkNoteHit(key) {
        const lane = lanes[key];
        const notes = lane.getElementsByClassName("note");

        if (notes.length > 0) {
            const note = notes[0];
            const notePos = parseInt(note.style.top);

            if (notePos > 520 && notePos < 580) {
                score += 100;
                note.remove();
                showEffect(lane, "spark");
                showEffect(lane, "nice-popup");
            }
        }
        scoreDisplay.textContent = score;
    }

    function showEffect(lane, effectClass) {
        const effect = document.createElement("div");
        effect.className = effectClass;
        lane.appendChild(effect);

        setTimeout(() => effect.remove(), 700);
    }

    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        startGame();
    });

    function generateFullChart() {
        const chart = [];
        const keys = ["d", "f", "j", "k"];
        let currentTime = 1000;
        const minGap = 300;

        while (currentTime < 230000) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            const type = Math.random() > 0.8 ? "hold" : "tap";
            const duration = type === "hold" ? Math.random() * 2000 + 1000 : 0;

            if (
                chart.length === 0 ||
                currentTime - chart[chart.length - 1].time >= minGap
            ) {
                chart.push({ time: currentTime, key, type, duration });
                currentTime += Math.random() * 800 + 300;
            }
        }

        return chart;
    }
});
