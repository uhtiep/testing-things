// Setup basic WebGL context and canvas size
const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext("webgl");
if (!gl) {
    console.error("WebGL not supported, using experimental-webgl");
    alert("Your browser does not support WebGL.");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define a basic shader setup
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
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red color
    }
`;

// Shader compilation function
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling shader:", gl.getShaderInfoLog(shader));
    }
    return shader;
}

// Create the shader program
const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Setup buffer and vertices for the cube (player)
const vertices = new Float32Array([
    -0.05, -0.05, -0.05,   0.05, -0.05, -0.05,   0.05,  0.05, -0.05,  // Front face
    -0.05,  0.05, -0.05,   -0.05, -0.05, -0.05,  -0.05, -0.05,  0.05,  // Left face
    0.05, -0.05,  0.05,   0.05,  0.05,  0.05,   0.05,  0.05, -0.05,   // Right face
    0.05, -0.05, -0.05,   0.05, -0.05,  0.05,   -0.05, -0.05,  0.05,   // Bottom face
    -0.05,  0.05,  0.05,  -0.05,  0.05, -0.05,   0.05,  0.05, -0.05,   // Top face
    -0.05,  0.05,  0.05,   0.05, -0.05,  0.05,   -0.05, -0.05,  0.05   // Back face
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttributeLocation);

// Projection matrix (perspective)
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

// ModelView matrix for camera setup
const modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3]);

// Send matrices to the shader
const uProjectionMatrix = gl.getUniformLocation(shaderProgram, "u_projectionMatrix");
const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "u_modelViewMatrix");
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

// Basic animation loop
function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update modelViewMatrix for movement
    mat4.translate(modelViewMatrix, mat4.create(), [player.x, player.y, player.z]);
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

    requestAnimationFrame(animate);
}

animate();
