// Set up canvas sizes
const physicsCanvas = document.getElementById('physicsCanvas');
const physicsCtx = physicsCanvas.getContext('2d');

let currentGame = null;

let objects = [];
let lockedObjects = [];
let movingObject = null;
let isMoving = false;

let mouseX, mouseY;

// Set up canvas dimensions
physicsCanvas.width = window.innerWidth;
physicsCanvas.height = window.innerHeight;

// Set the bottom square "ground" area
const groundHeight = 100;

// Create the ground square
function drawGround() {
    physicsCtx.fillStyle = "#444";
    physicsCtx.fillRect(0, physicsCanvas.height - groundHeight, physicsCanvas.width, groundHeight);
}

function goHome() {
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('physics-game').style.display = 'none';
    document.getElementById('combat-game').style.display = 'none';
}

function startPhysicsGame() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('physics-game').style.display = 'block';
    currentGame = 'physics';
    initPhysicsGame();
}

function initPhysicsGame() {
    // Physics properties for different objects
    class ObjectBase {
        constructor(x, y, width, height, type) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.type = type;
            this.velocityX = 0;
            this.velocityY = 0;
            this.isLocked = false;
            this.isMoving = false;
            this.isEngineOn = false;
        }

        draw() {
            if (this.type === 'plank') {
                physicsCtx.fillStyle = '#1e90ff';
                physicsCtx.fillRect(this.x, this.y, this.width, this.height);
            } else if (this.type === 'nail') {
                // Draw a small circle for nails
                physicsCtx.fillStyle = '#a9a9a9';
                physicsCtx.beginPath();
                physicsCtx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
                physicsCtx.fill();

                // Draw an "X" in the middle of the nail
                physicsCtx.strokeStyle = '#000';
                physicsCtx.beginPath();
                physicsCtx.moveTo(this.x - 5, this.y - 5);
                physicsCtx.lineTo(this.x + 5, this.y + 5);
                physicsCtx.moveTo(this.x - 5, this.y + 5);
                physicsCtx.lineTo(this.x + 5, this.y - 5);
                physicsCtx.stroke();
            } else if (this.type === 'wheel') {
                // Draw wheels as circles
                physicsCtx.fillStyle = '#808080';
                physicsCtx.beginPath();
                physicsCtx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
                physicsCtx.fill();
            } else if (this.type === 'engine') {
                // Draw engines as squares
                physicsCtx.fillStyle = '#ff4500';
                physicsCtx.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        update() {
            if (!this.isLocked) {
                this.velocityY += 0.5; // Gravity
                this.x += this.velocityX;
                this.y += this.velocityY;
            }
        }

        isHit(x, y) {
            return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
        }
    }

    class Engine extends ObjectBase {
        constructor(x, y, width, height) {
            super(x, y, width, height, 'engine');
        }

        turnOn() {
            this.isEngineOn = true;
        }

        turnOff() {
            this.isEngineOn = false;
        }

        update() {
            super.update();
            if (this.isEngineOn) {
                for (let obj of objects) {
                    if (obj.type === 'wheel' && this.isHit(obj.x, obj.y)) {
                        obj.velocityX = 5; // Engine powers wheel
                    }
                }
            }
        }
    }

    class Wheel extends ObjectBase {
        constructor(x, y, width, height) {
            super(x, y, width, height, 'wheel');
            this.velocityX = 0;
        }

        update() {
            super.update();
        }
    }

    // Handle user input and object spawning
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'z':
                toggleLock();
                break;
            case 'x':
                startMoving();
                break;
            case 'y':
                spawnObject('plank');
                break;
            case 'u':
                spawnObject('wheel');
                break;
            case 'i':
                spawnObject('engine');
                break;
            case 'o':
                spawnObject('nail');
                break;
        }
    });

    // Mouse Position Tracking
    physicsCanvas.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    physicsCanvas.addEventListener('mousedown', (event) => {
        if (isMoving) {
            moveObjectAtMouse(event.clientX, event.clientY);
        }
    });

    function spawnObject(type) {
        objects.push(new ObjectBase(mouseX, mouseY, 100, 20, type)); // Default size
    }

    function toggleLock() {
        for (let obj of objects) {
            if (obj.isHit(mouseX, mouseY)) {
                obj.isLocked = !obj.isLocked;
                if (obj.isLocked) {
                    lockedObjects.push(obj);
                } else {
                    let index = lockedObjects.indexOf(obj);
                    if (index !== -1) lockedObjects.splice(index, 1);
                }
                break;
            }
        }
    }

    function startMoving() {
        for (let obj of objects) {
            if (obj.isHit(mouseX, mouseY) && !obj.isLocked) {
                movingObject = obj;
                isMoving = true;
                break;
            }
        }
    }

    function moveObjectAtMouse(x, y) {
        if (movingObject) {
            movingObject.x = x - movingObject.width / 2;
            movingObject.y = y - movingObject.height / 2;
        }
    }

    function updatePhysics() {
        physicsCtx.clearRect(0, 0, physicsCanvas.width, physicsCanvas.height);

        // Draw ground
        drawGround();

        // Update all objects in the scene
        for (let obj of objects) {
            obj.update();
            obj.draw();
        }

        requestAnimationFrame(updatePhysics);
    }

    updatePhysics();
}
