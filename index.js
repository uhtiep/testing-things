// Setup basic WebGL context and canvas size
const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext("webgl");

// Check for WebGL support
if (!gl) {
    console.error("WebGL not supported");
    alert("Your browser does not support WebGL.");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set the WebGL viewport to match the canvas size
gl.viewport(0, 0, canvas.width, canvas.height);

// Define vertex shader and fragment shader sources
const vertexShaderSource = `
    attribute vec4 a_position;
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_projectionMatrix;
    void main() {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);  // Green color
    }
`;

// Function to compile shaders
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling shader:", gl.getShaderInfoLog(shader));
    }
    return shader;
}

// Create shader program
const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Define vertices for the player's cube (simple cube geometry)
const vertices = new Float32Array([
    -0.05, -0.05, -0.05,   0.05, -0.05, -0.05,   0.05,  0.05, -0.05,  // Front face
    -0.05,  0.05, -0.05,   -0.05, -0.05, -0.05,  -0.05, -0.05,  0.05,  // Left face
    0.05, -0.05,  0.05,   0.05,  0.05,  0.05,   0.05,  0.05, -0.05,   // Right face
    0.05, -0.05, -0.05,   0.05, -0.05,  0.05,   -0.05, -0.05,  0.05,   // Bottom face
    -0.05,  0.05,  0.05,  -0.05,  0.05, -0.05,   0.05,  0.05, -0.05,   // Top face
    -0.05,  0.05,  0.05,   0.05, -0.05,  0.05,   -0.05, -0.05,  0.05   // Back face
]);

// Create buffer to store vertices
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get the attribute location and enable it
const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);

// Get uniform locations for matrices
const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "u_modelViewMatrix");
const uProjectionMatrix = gl.getUniformLocation(shaderProgram, "u_projectionMatrix");

// Set up projection matrix (perspective)
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

// Set up modelView matrix (camera position)
const modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3]);

// Send projection and modelView matrices to shaders
gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

// Handle movement with WASD keys
const player = { x: 0, y: 0, z: -3 };
const speed = 0.1;

function handleKeyDown(event) {
    if (event.key === "w") player.z += speed;
    if (event.key === "s") player.z -= speed;
    if (event.key === "a") player.x -= speed;
    if (event.key === "d") player.x += speed;
}

document.addEventListener("keydown", handleKeyDown);

// Animation loop
function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the screen

    // Update modelView matrix for movement
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [player.x, player.y, player.z]);
    
    // Update the modelView matrix in the shader
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

    // Draw the player (cube)
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

    // Request next frame
    requestAnimationFrame(animate);
}

animate();
