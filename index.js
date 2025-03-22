document.addEventListener("DOMContentLoaded", () => {
    const lanes = {
      "d": document.getElementById("d-lane"),
      "f": document.getElementById("f-lane"),
      "j": document.getElementById("j-lane"),
      "k": document.getElementById("k-lane")
    };
  
    let chart = [];
    let score = 0;
    let combo = 0;
    const scoreDisplay = document.getElementById("score");
    const music = document.getElementById("music");
    const startButton = document.getElementById("startButton");
    const chartSelect = document.getElementById("chartSelect");
    const chartUpload = document.getElementById("chartUpload");
    const musicUpload = document.getElementById("musicUpload");
    const comboImage = document.getElementById("combo-image");
  
    // Mapping charts to their respective music
    const chartMusicMap = {
      "custom test.json": "test.mp3",
      "invincible.json": "invincible.mp3"
    };
  
    function createNote(key, type, duration = 0) {
      const note = document.createElement("div");
      note.classList.add(type === "hold" ? "hold-note" : "note");
  
      if (type === "hold") {
        note.style.height = `${duration / 3}px`;
        note.style.top = `-${duration / 3}px`;
      } else {
        note.style.top = "-40px";
      }
  
      lanes[key].appendChild(note);
  
      let position = -40;
      const fallSpeed = 4;
  
      function moveNote() {
        position += fallSpeed;
        note.style.top = position + "px";
  
        if (position > 600) {
          note.remove();
          resetCombo();
        } else {
          requestAnimationFrame(moveNote);
        }
      }
      moveNote();
    }
  
    function startGame() {
      if (music.readyState >= 2) {
        music.currentTime = 0;
        music.play();
      }
  
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
          combo++;
          note.remove();
          updateComboUI();
        }
      }
      scoreDisplay.textContent = score;
    }
  
    function updateComboUI() {
      if (combo > 0) {
        comboImage.style.display = "inline";
        comboImage.innerHTML = "";
  
        const digits = combo.toString().split("").map(Number);
        digits.forEach(digit => {
          const img = document.createElement("img");
          img.src = `${digit}.png`;
          comboImage.appendChild(img);
        });
  
        const comboText = document.createElement("img");
        comboText.src = "combo.png";
        comboImage.appendChild(comboText);
      } else {
        comboImage.style.display = "none";
      }
    }
  
    function resetCombo() {
      combo = 0;
      updateComboUI();
    }
  
    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      startGame();
    });
  
    chartUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            chart = JSON.parse(e.target.result);
            const chartName = file.name;
            if (chart.music) {
              music.src = chart.music;
            } else {
              alert("No associated music found for this chart!");
            }
          } catch (error) {
            alert("Invalid chart format");
          }
        };
        reader.readAsText(file);
      }
    });
  
    musicUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const objectURL = URL.createObjectURL(file);
        music.src = objectURL;
      }
    });
  
    chartSelect.addEventListener("change", () => {
      const selectedChart = chartSelect.value;
      fetch(selectedChart)
        .then(response => response.json())
        .then(data => {
          chart = data;
          if (data.music) {
            music.src = data.music;
          } else {
            alert("No music found for this chart!");
          }
        })
        .catch(() => alert("Failed to load chart."));
    });
  
    // Populate chart selection and preload charts with music
    Object.keys(chartMusicMap).forEach(chart => {
      const option = document.createElement("option");
      option.value = chart;
      option.textContent = chart;
      chartSelect.appendChild(option);
    });
  
    // Load the default chart and music
    fetch("custom test.json")
      .then(response => response.json())
      .then(data => {
        chart = data;
        music.src = "test.mp3";
      });
  });
  