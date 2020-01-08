import {scene, THREE, renderer, pmremGenerator} from './threeHandler.js';
import {RGBELoader} from '../resources/three.js-r112/examples/jsm/loaders/RGBELoader.js';

export {hdrCubeRenderTarget};

let hdrCubeRenderTarget = {};

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

const envs = {
    'winterForest': [
        'Winter_Forest/WinterForest_Env.hdr',
        'Winter_Forest/WinterForest_8k.jpg'
    ],
    'snowyPark': [
        'Snowy_Park/snowy_park_01_1k.hdr',
        'Snowy_Park/snowy_park_01.jpg'
    ],
    'snowyForestPath': [
        'Snowy_Forest_Path/snowy_forest_path_02_1k.hdr',
        'Snowy_Forest_Path/white.png',
        'Snowy_Forest_Path/snowy_forest_path_02_e.jpg'
    ]
};

let sphereEnvMap = 1;

function addBg(callback) {
    let bg = envs['snowyForestPath'];
    
    //console.log(RGBELoader);
    new RGBELoader().setDataType(THREE.UnsignedByteType).load('../resources/environments/' + bg[0], (hdrEquiRect, textureData) => {
        textureData.exposure = 100;
        hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquiRect);
        pmremGenerator.compileCubemapShader();
        scene.background = hdrCubeRenderTarget.texture;
        hdrCubeRenderTarget.mapping = THREE.CubeRefractionMapping;
        callback();
    });
    
    // add an environment map sphere that is of higher resolution than that in the RGBELoader.
    if (sphereEnvMap) {
        let geometry = new THREE.SphereBufferGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        let texture = new THREE.TextureLoader().load('../resources/environments/' + bg[1]);
        let material = new THREE.MeshBasicMaterial({map: texture});
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }
}

function setupScene(callback) {
    //addGround();
    addLights();
    //addFog();
    addBg(() => {
        callback();
    });
}

export {setupScene};