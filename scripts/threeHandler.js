import * as THREE from '../resources/three.js-r112/build/three.module.js';
import {OrbitControls} from '../resources/three.js-r112/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from '../resources/three.js-r112/examples/jsm/loaders/OBJLoader2.js';

export {THREE};
export {load, scene, animFunctions};
export {loadObj, loadObjPromise};

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

function loadTexture(path) {
    return new Promise(resolve => {new THREE.TextureLoader().load(path, resolve);});
}

function loadObjPromise(paths) {
    //const promises = [];
    
    const promises = paths.map(key => {
        return loadTexture(key.obj).then(texture => {
            alert('texture loaded');
            //alert(texture);
            // needs some kind of action here. It's not executing.
        }).catch(fail => {
            alert('Something went wrong');
        });
    });
    
    setTimeout(() => console.log(paths), 5000);
    
//    for (let x = 0; x < paths.length; x++) {
//        let thisPromise = () => {
//            return loadObj(paths[x].obj, {obj: true}, resolve).then((root) => {
//                alert(root);
//            });
//        }
//        
//        promises.push(thisPromise);
//    }
        
    return Promise.all(promises).then(result => {
        alert('all loaded');
    });
}