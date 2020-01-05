import {scene, THREE} from './threeHandler.js'

function addGround() {
    //loadObj('../resources/models/hills.obj');
}

function addLights() {
    let light = new THREE.AmbientLight(0x404040);
    scene.add(light);
    
    scene.background = new THREE.Color(0xffffff);
}

// add distance fog
// https://threejsfundamentals.org/threejs/lessons/threejs-fog.html
function addFog() {
    const color = 0xffffff;
    const near = 5;
    const far = 20;
    scene.fog = new THREE.Fog(color, near, far);
}

function setupScene() {
    //addGround();
    addLights();
    addFog();
}

export {setupScene};