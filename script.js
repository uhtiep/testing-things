const audio = document.getElementById("bgm");
const startBtn = document.getElementById("startBtn");
const circle = document.getElementById("circle");
const square = document.getElementById("square");
const triangle = document.getElementById("triangle");

startBtn.addEventListener("click", () => {
  audio.play();
  runPattern();
});

function runPattern() {
  // Every 2 seconds, spawn a shape in rhythm (120 BPM)
  setTimeout(() => spawn(circle, 50), 2000);   // Circle falls from top center
  setTimeout(() => spawn(square, 100), 4000);  // Square from left
  setTimeout(() => spawn(triangle, 300), 6000); // Triangle from right

  // Repeating pattern every 6s
  setInterval(() => {
    spawn(circle, 50);
    spawn(square, 100);
    spawn(triangle, 300);
  }, 6000);
}

function spawn(shape, x) {
  shape.style.left = `${x + Math.random() * 200}px`;
  shape.classList.add("animate");

  setTimeout(() => {
    shape.classList.remove("animate");
    shape.style.opacity = 0;
    shape.style.top = "-60px";
  }, 2000);
}
