import * as THREE from '../resources/three.js-r112/build/three.module.js';
import {OrbitControls} from '../resources/three.js-r112/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from '../resources/three.js-r112/examples/jsm/loaders/OBJLoader2.js';

// post-processing
import {EffectComposer} from '../resources/three.js-r112/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from '../resources/three.js-r112/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from '../resources/three.js-r112/examples/jsm/postprocessing/UnrealBloomPass.js';

import {PointLight} from '../resources/three.js-r112/src/lights/PointLight.js';

import {GUI} from '../resources/three.js-r112/examples/jsm/libs/dat.gui.module.js';

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
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.toneMapping = THREE.ReinhardToneMapping;

//let pointLight = new PointLight( 0xffffff, 0.01 );
//camera.add( pointLight );



// Composer and mixer for composing bloom post-processing effect
// UnrealBloomPass bloom pass

let bloomParams = {
    exposure: 0.4,
    bloomStrength: 0.4,
    bloomThreshold: 0,
    bloomRadius: 0
};

let renderScene = new RenderPass(scene, camera);
let bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    0.4, 
    0, 
    0
);


// DAT.gui for bloomParams
var gui = new GUI();

gui.add( bloomParams, 'exposure', 0.1, 2 ).onChange( function ( value ) {
    console.log(Math.pow( value, 4.0 ));
    renderer.toneMappingExposure = Math.pow( value, 4.0 );

} );

gui.add( bloomParams, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

    bloomPass.threshold = Number( value );

} );

gui.add( bloomParams, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

    bloomPass.strength = Number( value );

} );

gui.add( bloomParams, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

    bloomPass.radius = Number( value );

} );


let composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.setSize(window.innerWidth, window.innerHeight);

// PMREM Generator for HDR
let pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Orbit Controls
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

// animate: JS Animation function
function animate() {
    requestAnimationFrame(animate);

    // update controls, including auto-rotation
    controls.update();
    
    // run each custom animation function.
    if (enableAnimation) {for (var x = 0; x < animFunctions.length; x++) {
        animFunctions[x]();
    }}

    // render with the composer (compositor?)
    //renderer.render(scene, camera);
    composer.render();
}

// update renderer size and camera projection matrix when the window is resized to keep everything proportionate
// courtesy https://stackoverflow.com/a/20434960/5511776
function onWindowResize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    
    renderer.setSize(w, h);
    composer.setSize(w, h);
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