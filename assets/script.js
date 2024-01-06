import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

let initialRotationSpeed = 0.05; // faster initial rotation speed
let currentRotationSpeed = initialRotationSpeed;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(new THREE.Color("rgb(17, 11, 17)"));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


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

const rubiksCube = new THREE.Group();
const cubeOffset = 1.05; 
for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
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

let initialRotationFrames = 100; 
let currentRotationFrames = initialRotationFrames;

let startTime = Date.now();
let transitionDuration = 4500; // transition duration

function animate() {
    requestAnimationFrame(animate);

    if (currentRotationFrames > 0) {
        rubiksCube.rotation.x += initialRotationSpeed;
        rubiksCube.rotation.y += initialRotationSpeed;
        currentRotationFrames--;
    } else {
        if (!isDragging) {
            let elapsedTime = Date.now() - startTime;

            if (elapsedTime < transitionDuration) {

                currentRotationSpeed = initialRotationSpeed - (initialRotationSpeed - 0.001) * (elapsedTime / transitionDuration);
            }


            rubiksCube.rotation.x += currentRotationSpeed;
            rubiksCube.rotation.y += currentRotationSpeed;
        }
    }

    renderer.render(scene, camera);
}

// start animation
animate();


document.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);


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

        const rotateAngleX = toRadians(deltaMove.y * 0.5); 
        const rotateAngleY = toRadians(deltaMove.x * 0.5); 

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




const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");


circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;

});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
  
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();



