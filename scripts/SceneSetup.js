import {
    AmbientLight,
    Color,
    PointLight,
    Fog,
    TextureLoader,
    MeshBasicMaterial,
    Mesh,
    SphereBufferGeometry,
    LinearToneMapping
} from 'three';
import { scene, renderer, pmremGenerator } from './threeHandler.js';
import { RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import { setProgress } from './domElements.js';
import { HDR_BG, SPHERE_ENVMAP } from './constants/env-constants.js';

// display non-HDR sphere environment map.
let sphereEnvMap = 0;

let hdrCubeRenderTarget = {};

function addLights() {
    let light = new AmbientLight(0x404040);
    scene.add(light);
    
    scene.background = new Color(0xffffff);
    
    // pointLight to illuminate snowflakes.
    // this is critical to making the scene look really nice.
    // Not sure whether positioning the light toward the sunlight in the HDR or at the origin looks better.
    // Positioning toward the sunlight is more realistic but makes the snowflakes look darker.
    // Positioning toward the origin might still be realistic because of the way ice refracts light.
    let pointLight = new PointLight(0xffffff, 5);
    //pointLight.position.set(10, 5, 10);
    //pointLight.castShadow = true;
    scene.add(pointLight);
}

// add distance fog
// https://threejsfundamentals.org/threejs/lessons/threejs-fog.html
function addFog() {
    const color = 0xffffff;
    const near = 5;
    const far = 20;
    scene.fog = new Fog(color, near, far);
}

function addBg(callback) {    
    let prevProg = 0;
    new RGBELoader().load(
        HDR_BG,
        (hdrEquiRect, textureData) => {
            hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquiRect);
            pmremGenerator.compileCubemapShader();
            scene.background = hdrCubeRenderTarget.texture;

            // set tone mapping to linear tone mapping
            // https://discourse.threejs.org/t/tonemappingexposure-not-working-on-r120/18503/2
            renderer.toneMapping = LinearToneMapping;
            renderer.toneMappingExposure = 0.4;
            
            callback();
        },
        progressEvent => {
            const prog = Math.round(progressEvent.lengthComputable? 100 * progressEvent.loaded / progressEvent.total : 0);
            
            setProgress(prog - prevProg);
            prevProg = prog;
        }
    );
    
    // add an environment map sphere that is of higher resolution than that in the RGBELoader.
    if (sphereEnvMap) {
        const geometry = new SphereBufferGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        const texture = new TextureLoader().load(SPHERE_ENVMAP);
        const material = new MeshBasicMaterial({map: texture});
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);
    }
}

export function setupScene(callback) {
    addLights();
    addBg(() => {
        callback();
    });
}

export { hdrCubeRenderTarget };