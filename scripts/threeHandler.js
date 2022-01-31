import {
    Scene, 
    PerspectiveCamera, 
    WebGLRenderer,
    Clock,
    Vector2,
    Vector3,
    PMREMGenerator,
    TextureLoader
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// post-processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// import { GUI } from '../resources/three.js-r112/examples/jsm/libs/dat.gui.module.js';

import {setProgress} from './domElements.js';

export {
    load,
    scene,
    animFunctions,
    
    clock,
    clockDelta,
    clockSpeed
};
export {
    loadObjs2
};
export {
    sceneArgs,
    debugArgs
};
export {
    pmremGenerator
}
export {
    renderer
};


let debug = false;
let sceneArgs, debugArgs = {};
let enableAnimation = true;

// important for keeping simulation speed the same at lower or higher framerates.
let clock = new Clock();
let clockSpeed = 0.5;
let clockDelta = 0;

let scene = new Scene();
let camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.toneMapping = ReinhardToneMapping;

// let pointLight = new PointLight( 0xffffff, 0.01 );
// camera.add( pointLight );

// Composer and mixer for composing bloom post-processing effect
// UnrealBloomPass bloom pass
// from https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html

let bloomParams = {
    exposure: 0.4,
    bloomStrength: 0.4,
    bloomThreshold: 0,
    bloomRadius: 0
};

let renderScene = new RenderPass(scene, camera);
let bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    0.4,
    0,
    0
);


// DAT.gui for bloomParams
// courtesy https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html
// function loadDAT() {
//     let gui = new GUI();

//     gui.add(bloomParams, 'exposure', 0.1, 2).onChange(function (value) {
//         console.log(Math.pow(value, 4.0));
//         renderer.toneMappingExposure = Math.pow(value, 4.0);
//     });

//     gui.add(bloomParams, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
//         bloomPass.threshold = Number(value);
//     });

//     gui.add(bloomParams, 'bloomStrength', 0.0, 3.0).onChange(function (value) {
//         bloomPass.strength = Number(value);
//     });

//     gui.add(bloomParams, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function (value) {
//         bloomPass.radius = Number(value);
//     });
// }


let composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.setSize(window.innerWidth, window.innerHeight);

// PMREM Generator for HDR
let pmremGenerator = new PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Orbit Controls
let controls = new OrbitControls(camera, renderer.domElement);

let animFunctions = [];

function load(args) {
    if (args) sceneArgs = args;
    if (args && args.enableAnimation !== undefined) enableAnimation = args.enableAnimation;
    
    // camera
    let cameraX, cameraY, cameraZ = 0;
    if (args.camera) {
        cameraX = args.camera.x;
        cameraY = args.camera.y;
        cameraZ = args.camera.z;
    }

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(new Vector3(0, 0, 0));
    
    // renderer size and DOM element
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // helper and debug
    if (args.helpers && args.enableHelpers) args.helpers();
    if (args.debug) debug = args.debug;
    if (args.debugArgs) {
        debugArgs = args.debugArgs;
        // if (debugArgs.enableDAT !== undefined) enableDAT = debugArgs.enableDAT;
    }

    // DAT GUI
    // if (enableDAT) loadDAT();

    // controls rotate
    if (args.autoRotate) {
        controls.autoRotate = true;
        if (args.autoRotateSpeed) controls.autoRotateSpeed = args.autoRotateSpeed;
    }

    animate();
}

// animate: JS Animation function
function animate() {
    requestAnimationFrame(animate);

    clockDelta = clock.getDelta();
    
    // update controls, including auto-rotation
    controls.update();

    // run each custom animation function.
    if (enableAnimation) {
        for (var x = 0; x < animFunctions.length; x++) {
            animFunctions[x]();
        }
    }

    // render with the composer
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
        const objLoader = new OBJLoader();
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
        new TextureLoader().load(path, resolve);
    });
}

// loadObjs2: Load objects asynchronously with promises, and then 
// resolve when all promises have fulfilled.
function loadObjs2(objInfo, progAmount) {
    return new Promise((resolve, reject) => {
        let promisesSuper = [];
        let promisesFlat = [];
        let objects = [];

        // iterate over objInfo
        objInfo.map((currentValue, index, arr) => {
            let mapPromise = loadMap2(currentValue.map).then(map => {
                objInfo[index].map = map;
                setProgress(progAmount);
            });
            let normalMapPromise = loadMap2(currentValue.normalMap).then(normalMap => {
                objInfo[index].normalMap = normalMap;
                setProgress(progAmount);
            });
            let meshPromise = loadObj2(currentValue.mesh).then(mesh => {
                objInfo[index].mesh = mesh;
                setProgress(progAmount);
            });

            // push all promises for this object into a sub-array of the promisesSuper array.
            promisesSuper.push([currentValue.name, meshPromise, mapPromise, normalMapPromise]);
            promisesFlat.push(currentValue.name, meshPromise, mapPromise, normalMapPromise);
        });

        // this promise resolves each time an object is loaded.
        promisesSuper.map((currentValue, index, arr) => {
            Promise.all(currentValue).then(output => {
                // TODO add object.

                // resolve(output);
            });
        });

        // this promise resolves when all objects are loaded.
        Promise.all(promisesFlat)
            .then(output => {
                // TODO continue script when object has loaded.
                resolve(promisesFlat);
            })
            .catch(error => {
                alert('Error');
            });
    });
}
