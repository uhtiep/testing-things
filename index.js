document.addEventListener("DOMContentLoaded", () => {
    const lanes = {
        "c": document.getElementById("c-lane"),
        "n": document.getElementById("n-lane")
    };
    
    let score = 0;
    const scoreDisplay = document.getElementById("score");
    const music = document.getElementById("music");

    function createNote(key) {
        const note = document.createElement("div");
        note.classList.add("note");
        lanes[key].appendChild(note);

        let position = -40;
        const fallSpeed = 3;

        function moveNote() {
            position += fallSpeed;
            note.style.top = position + "px";

            if (position > 400) {
                note.remove();
            } else {
                requestAnimationFrame(moveNote);
            }
        }
        moveNote();
    }

    function startGame() {
        music.play();

        setInterval(() => {
            createNote(Math.random() > 0.5 ? "c" : "n");
        }, 1000);
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "c" || event.key === "n") {
            let lane = lanes[event.key];
            let notes = lane.getElementsByClassName("note");

            if (notes.length > 0) {
                let note = notes[0];
                let notePos = parseInt(note.style.top);

                if (notePos > 350 && notePos < 400) {
                    score += 100;
                    note.remove();
                }
            }
            scoreDisplay.textContent = score;
        }
    });

    setTimeout(startGame, 1000);
});
