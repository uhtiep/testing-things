document.addEventListener("DOMContentLoaded", () => {
    const lanes = {
        "d": document.getElementById("d-lane"),
        "f": document.getElementById("f-lane"),
        "j": document.getElementById("j-lane"),
        "k": document.getElementById("k-lane")
    };

    const scoreDisplay = document.getElementById("score");
    const music = document.getElementById("music");
    const startButton = document.getElementById("startButton");
    const comboDisplay = document.getElementById("combo");

    let score = 0;
    let combo = 0;
    let chart = [];
    const heldKeys = {};
    let lastNoteTime = 0;
    const minNoteGap = 400; // Prevent notes from spawning too close

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
                combo++;
                updateCombo();
                note.remove();
            } else {
                combo = 0; // Reset combo on miss
                updateCombo();
            }
        }
        scoreDisplay.textContent = score;
    }

    function updateCombo() {
        comboDisplay.innerHTML = "";
        const comboStr = combo.toString();
        for (let i = 0; i < comboStr.length; i++) {
            let img = document.createElement("img");
            img.src = comboStr[i] + ".png";
            comboDisplay.appendChild(img);
        }
        let comboText = document.createElement("img");
        comboText.src = "combo.png";
        comboDisplay.appendChild(comboText);
    }

    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        startGame();
    });

    function generateFullChart() {
        const chart = [];
        const keys = ["d", "f", "j", "k"];
        let currentTime = 1000;

        while (currentTime < 230000) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            const type = Math.random() > 0.8 ? "hold" : "tap";
            const duration = type === "hold" ? Math.random() * 2000 + 1000 : 0;

            if (currentTime - lastNoteTime >= minNoteGap) {
                chart.push({ time: currentTime, key, type, duration });
                lastNoteTime = currentTime;
                currentTime += Math.random() * 800 + 300;
            }
        }

        return chart;
    }

    function loadChart(file) {
        fetch(file)
            .then(response => response.json())
            .then(data => {
                chart = data;
                console.log("Custom chart loaded.");
            })
            .catch(error => console.error("Error loading chart:", error));
    }

    // Default chart
    chart = generateFullChart();

    // Allow file selection for custom charts
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                chart = JSON.parse(e.target.result);
                console.log("Loaded custom chart:", chart);
            };
            reader.readAsText(file);
        }
    });
    document.body.appendChild(fileInput);
});
