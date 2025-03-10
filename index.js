const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

// Create engine and world
const engine = Engine.create();
const world = engine.world;

// Create renderer
const render = Render.create({
    element: document.getElementById('physicsPlayground'),
    canvas: document.getElementById('worldCanvas'),
    engine: engine
});
Render.run(render);

// Create mouse constraint
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, { mouse });
World.add(world, mouseConstraint);

// Make the canvas fill the section
render.canvas.width = window.innerWidth;
render.canvas.height = 400; // Set a specific height for the canvas

// Spawn Ball function
function spawnBall() {
    const ball = Bodies.circle(Math.random() * window.innerWidth, 50, 30, {
        restitution: 0.8,
        friction: 0.05,
        render: { fillStyle: 'blue' }
    });
    World.add(world, ball);
}

// Add ground
const ground = Bodies.rectangle(window.innerWidth / 2, 390, window.innerWidth, 20, { isStatic: true });
World.add(world, ground);

// Button to spawn balls
document.getElementById('spawnBall').addEventListener('click', spawnBall);

// Button to scroll to Physics Playground
document.getElementById('spawnBallBtn').addEventListener('click', () => {
    document.getElementById('physicsPlayground').scrollIntoView({ behavior: 'smooth' });
});

// Back to top functionality
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Run the engine
Engine.run(engine);
