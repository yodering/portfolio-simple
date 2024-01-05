import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(new THREE.Color("rgb(17, 11, 17)")); // Set the background color here
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Function to create a small cube of Rubik's Cube
function createSmallCube() {
  const smallCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const faceMaterials = [
    new THREE.MeshBasicMaterial({ color: "rgb(235, 87, 87)" }), // red
    new THREE.MeshBasicMaterial({ color: "rgb(234, 143, 87)" }), // orange
    new THREE.MeshBasicMaterial({ color: "rgb(124, 172, 217)" }), // blue
    new THREE.MeshBasicMaterial({ color: "rgb(180, 219, 130)" }), // green
    new THREE.MeshBasicMaterial({ color: "rgb(255, 251, 234)" }), // white
    new THREE.MeshBasicMaterial({ color: "rgb(243, 236, 135)" }), // yellow
  ];
  return new THREE.Mesh(smallCubeGeometry, faceMaterials);
}

// Create the Rubik's Cube (3x3x3)
const rubiksCube = new THREE.Group();
const cubeOffset = 1.05; // Slightly more than the size of a small cube to add some spacing
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      // Skip the inner cubes as they are not visible
      if (x === 1 && y === 1 && z === 1) continue;
      
      const smallCube = createSmallCube();
      smallCube.position.set(
        (x - 1) * cubeOffset,
        (y - 1) * cubeOffset,
        (z - 1) * cubeOffset
      );
      rubiksCube.add(smallCube);
    }
  }
}

scene.add(rubiksCube);

camera.position.z = 10;

// Function to animate the Rubik's Cube
function animate() {
  requestAnimationFrame(animate);

  if (!isDragging) {
    rubiksCube.rotation.x += 0.001;
    rubiksCube.rotation.y += 0.001;
  }

  renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Add event listeners for mouse input
document.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

// Convert to spherical rotation
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function startDrag(e) {
    isDragging = true;
    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;
}

function drag(e) {
    if (isDragging) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        const rotateAngleX = toRadians(deltaMove.y * 0.5); // Adjust rotation sensitivity
        const rotateAngleY = toRadians(deltaMove.x * 0.5); // Adjust rotation sensitivity

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                rotateAngleX,
                rotateAngleY,
                0,
                'XYZ'
            ));

        rubiksCube.quaternion.multiplyQuaternions(deltaRotationQuaternion, rubiksCube.quaternion);

        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    }
}

function stopDrag() {
    isDragging = false;
}