document.addEventListener("DOMContentLoaded", () => {
    const lanes = {
        "d": document.getElementById("d-lane"),
        "f": document.getElementById("f-lane"),
        "j": document.getElementById("j-lane"),
        "k": document.getElementById("k-lane")
    };

    const chart = generateFullChart();
    let score = 0;
    let gameStarted = false;
    const scoreDisplay = document.getElementById("score");
    const music = document.getElementById("music");
    const startButton = document.getElementById("startButton");

    const heldKeys = {};
    const holdNotes = [];

    function createNote(key, type, duration = 0) {
        const note = document.createElement("div");
        note.classList.add(type === "hold" ? "hold-note" : "note");

        if (type === "hold") {
            note.style.height = `${duration / 3}px`; // Make hold notes taller
            note.dataset.duration = duration;
            note.dataset.startTime = performance.now(); // Store start time for hold note
            holdNotes.push(note);

            // Create the visible hit zone
            const hitZone = document.createElement("div");
            hitZone.classList.add("hit-zone");
            note.appendChild(hitZone);
        }

        lanes[key].appendChild(note);

        let position = -40;
        const fallSpeed = 4;

        function moveNote() {
            position += fallSpeed;
            note.style.top = position + "px";

            if (position > 600) {
                note.remove();
                if (type === "hold") {
                    removeHoldNote(note); // Remove hold note when it's missed
                }
            } else {
                requestAnimationFrame(moveNote);
            }
        }
        moveNote();
    }

    function startGame() {
        if (gameStarted) return; // Prevent starting the game multiple times
        gameStarted = true;
        music.currentTime = 0;
        music.play();

        chart.forEach((note) => {
            setTimeout(() => {
                createNote(note.key, note.type, note.duration);
            }, note.time);
        });
    }

    document.addEventListener("keydown", (event) => {
        if (!heldKeys[event.key] && lanes[event.key]) {
            heldKeys[event.key] = true;
            checkNoteHit(event.key);
        }
    });

    document.addEventListener("keyup", (event) => {
        if (lanes[event.key]) {
            heldKeys[event.key] = false;
            handleHoldNoteRelease(event.key);
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
                showEffect(lane, "nice-popup");
            }
        }
        scoreDisplay.textContent = score;
    }

    function handleHoldNoteRelease(key) {
        const lane = lanes[key];
        const holdNotesInLane = lane.getElementsByClassName("hold-note");

        if (holdNotesInLane.length > 0) {
            const note = holdNotesInLane[0];
            const notePos = parseInt(note.style.top);
            const startTime = parseFloat(note.dataset.startTime);
            const duration = parseFloat(note.dataset.duration);

            // Check if the key was released during the hold note
            if (notePos > 520 && notePos < 580) {
                const timeHeld = performance.now() - startTime;
                if (timeHeld >= duration) {
                    score += 100;
                    note.remove();
                    showEffect(lane, "nice-popup");
                }
            }
        }
    }

    function removeHoldNote(note) {
        const index = holdNotes.indexOf(note);
        if (index !== -1) {
            holdNotes.splice(index, 1);
        }
    }

    function showEffect(lane, effectClass) {
        const effect = document.createElement("div");
        effect.className = effectClass;
        lane.appendChild(effect);

        setTimeout(() => effect.remove(), 700);
    }

    startButton.addEventListener("click", () => {
        score = 0;
        scoreDisplay.textContent = score;
        gameStarted = false;
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
