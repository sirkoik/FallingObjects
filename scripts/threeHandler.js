import * as THREE from '../resources/three.js-r112/build/three.module.js';
import {OrbitControls} from '../resources/three.js-r112/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from '../resources/three.js-r112/examples/jsm/loaders/OBJLoader2.js';

export {THREE};
export {load, scene, animFunctions};
export {loadObjs2};
export {sceneArgs, debugArgs};
export {pmremGenerator}
export {renderer};

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({
    antialias: true
});

let pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

let controls = new OrbitControls(camera, renderer.domElement);

let animFunctions = [];

let debug = false;
let sceneArgs, debugArgs = {};
let enableAnimation = true;

function load(args) {
    if (args) sceneArgs = args;
    if (args && args.enableAnimation !== undefined) enableAnimation = args.enableAnimation;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

//    camera.position.x = 10;
//    camera.position.y = -2;
//    camera.position.z = 10;

    camera.position.set(1, -2 , 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    if (args.helpers && args.enableHelpers) args.helpers();
    if (args.debug) debug = args.debug;
    if (args.debugArgs) debugArgs = args.debugArgs;

    if (args.autoRotate) {
        controls.autoRotate = true;
        if (args.autoRotateSpeed) controls.autoRotateSpeed = args.autoRotateSpeed;
    }
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // update controls, including auto-rotation
    controls.update();
    
    // run each custom animation function.
    if (enableAnimation) {for (var x = 0; x < animFunctions.length; x++) {
        animFunctions[x]();
    }}

    renderer.render(scene, camera);
}

// update renderer size and camera projection matrix when the window is resized to keep everything proportionate
// courtesy https://stackoverflow.com/a/20434960/5511776
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);


/* promise obj/map loaders */

// loadObj2: Load an object with OBJLoader2.
function loadObj2(path) {
    return new Promise(resolve => {
        const objLoader = new OBJLoader2();
        objLoader.load(path, (root) => {
            // TODO do something with the object.

            if (debug) console.log(root);
            if (debug) console.log(scene);
            
            if (debug) console.log(path + ' loaded.');
            resolve(root);
        });
    });
}

// loadMap2: Load a texture map.
function loadMap2(path) {
    return new Promise(resolve => {
        new THREE.TextureLoader().load(path, resolve);
    });
}

// loadObjs2: Load objects asynchronously with promises, and then 
// resolve when all promises have fulfilled.
function loadObjs2(objInfo) {
	return new Promise((resolve, reject) => {
		let promisesSuper = [];
        let promisesFlat = [];
        let objects = [];
		
		// iterate over objInfo
		objInfo.map((currentValue, index, arr) => {
			let mapPromise = loadMap2(currentValue.map).then(map => {
                objInfo[index].map = map;
            });
			let normalMapPromise = loadMap2(currentValue.normalMap).then(normalMap => {
                objInfo[index].normalMap = normalMap;
            });
			let meshPromise = loadObj2(currentValue.mesh).then(mesh => {
                objInfo[index].mesh = mesh;
            });
			
            // push all promises for this object into a sub-array of the promisesSuper array.
			promisesSuper.push([currentValue.name, meshPromise, mapPromise, normalMapPromise]);
			promisesFlat.push(currentValue.name, meshPromise, mapPromise, normalMapPromise);
		});
        
        // this promise resolves each time an object is loaded.
        promisesSuper.map((currentValue, index, arr) => {
            Promise.all(currentValue).then(output => {
                // TODO add object.
                //alert('Object fully loaded.');
                //console.log(output);
                
                //resolve(output);
            });
        });
        
		// this promise resolves when all objects are loaded.
		Promise.all(promisesFlat)
		.then(output => {
            // TODO continue script when object has loaded.
			//alert('all promises in promise array resolved.');
			resolve(promisesFlat);
		})
		.catch(error => {
			alert('Error');
		});
	});
}