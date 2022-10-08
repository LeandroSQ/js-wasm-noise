// Set up the canvas with a 2D rendering context
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Constants
const ratio = window.devicePixelRatio || 1;
const width = 600;
const height = 600;
const bufferSize = width * height * 4;

// Size canvas
canvas.width = width;
canvas.height = height;
ctx.scale(ratio, ratio);
document.body.appendChild(canvas);

// FPS variables
const targetFPS = 30;
const targetFrameTime = 1000 / targetFPS;
let lastFrameTime = 0;
let fpsTimer = 0;
let frameCounter = 0;
let fps = 0;

// Web assembly constants
const memory = new WebAssembly.Memory({
    // Calculates the amount of 64k memory pages are required to store the pixels
    initial: Math.ceil(bufferSize / 1024.0 / 64.0) + 1,
});
const buffer = new Uint8ClampedArray(memory.buffer);
const imageData = ctx.createImageData(width, height);
let wasm = null;

// Functions
function render(startFrameTime) {
    // Calculate the frame gap length
    const frameLength = startFrameTime - lastFrameTime;

    // Only render in the desired frame rate
    if (frameLength >= targetFrameTime) {
        // Calculate the delta time
        const deltaTime = frameLength / 1000;

        // Call the WASM rendering
        wasmRender();

        // Updates FPS counter
        fpsTimer += deltaTime;
        frameCounter++;
        if (fpsTimer >= 1) {
            fpsTimer -= 1;
            fps = frameCounter;
            frameCounter = 0;
        }

        // Saves the last frame time
        lastFrameTime = performance.now();
    }

    requestAnimationFrame(render);
}

function wasmRender() {
    // Run the WASM function
    wasm.render(width, height);

    // Output the WASM frame buffer to the canvas
    imageData.data.set(buffer.subarray(0, bufferSize));
    ctx.putImageData(imageData, 0, 0);
}

/**
 * This function resolves the path for a given file.
 * Fixing relative path issues on github pages
 *
 * @param {string} file
 * @return {string}
 */
function resolveFilePath(file) {
    const locationRoot = window.location.href.indexOf("http://localhost:")
			? window.location.href
			: window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));

    return locationRoot + file;
}

async function loadWasmModule() {
    // Define the WASM imports, including the created memory
    const imports = {
        env: {
            memory,
            seed() { return Date.now() * Math.random(); }
        }
    };

    // Compiles an instantiate the .wasm module, asynchronously thus not requiring a worker thread to load it
    const wasmFile = fetch(resolveFilePath("/wasm/module.wasm"));
    const instance = await WebAssembly.instantiateStreaming(wasmFile, imports);
    wasm = instance.instance.exports;
}

// Loads the wasm module and then schedule the first frame
loadWasmModule()
    .then(x => requestAnimationFrame(render));