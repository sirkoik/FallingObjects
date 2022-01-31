import {
    Scene, 
    PerspectiveCamera, 
    WebGLRenderer,
    Clock,
    Vector2,
    Vector3,
    PMREMGenerator
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// post-processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { loadDAT } from './dat.gui-functions';

let debug = false;
export let sceneArgs, debugArgs = {};
let enableAnimation = true;

// important for keeping simulation speed the same at lower or higher framerates.
export const clock = new Clock();
export let clockSpeed = 0.5;
export let clockDelta = 0;

export const scene = new Scene();
export const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

// let pointLight = new PointLight( 0xffffff, 0.01 );
// camera.add( pointLight );

// Composer and mixer for composing bloom post-processing effect
// UnrealBloomPass bloom pass
// from https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html
export const bloomParams = {
    exposure: 0.4,
    bloomStrength: 0.4,
    bloomThreshold: 0,
    bloomRadius: 0
};

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    0.4,
    0,
    0
);

export const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.setSize(window.innerWidth, window.innerHeight);

// PMREM Generator for HDR
export const pmremGenerator = new PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

export let animFunctions = [];

export const load = (args) => {
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