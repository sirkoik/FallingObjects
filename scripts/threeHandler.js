import * as THREE from '../resources/three.js-r112/build/three.module.js';
import {OrbitControls} from '../resources/three.js-r112/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from '../resources/three.js-r112/examples/jsm/loaders/OBJLoader2.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let controls = new OrbitControls(camera, renderer.domElement);

let animFunctions = [];

let debug = false;
let enableAnimation = true;

function load(args) {
    if (args && args.enableAnimation !== undefined) enableAnimation = args.enableAnimation;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //camera.position.z = 5;
    camera.position.x = 10;
    camera.position.y = 7;
    camera.position.z = 10;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    if (args.helpers && args.enableHelpers) args.helpers();
    if (args.debug) debug = args.debug;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // run each custom animation function.
    if (enableAnimation) {for (var x = 0; x < animFunctions.length; x++) {
        animFunctions[x]();
    }}

    renderer.render(scene, camera);
}

// update renderer size and camera projection matrix when the window is resized to keep everything proportionate
window.onresize = () => {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// load an object using three.js OBJLoader2
function loadObj(path, args, callback) {    
    const objLoader = new OBJLoader2();
    objLoader.load(path, (root) => {
        if (args && args.obj) {
            callback(root);
        } else {
            scene.add(root);
        }
        
        if (debug) console.log(root);
        if (debug) console.log(scene);
    });
}

export {THREE};
export {load, scene, animFunctions};
export {loadObj};