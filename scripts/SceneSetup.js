import {scene, THREE, renderer, pmremGenerator} from './threeHandler.js';
import {RGBELoader} from '../resources/three.js-r112/examples/jsm/loaders/RGBELoader.js';

export {hdrCubeRenderTarget};

// display non-HDR sphere environment map.
let sphereEnvMap = 0;

let hdrCubeRenderTarget = {};

function addGround() {
    //loadObj('../resources/models/hills.obj');
}

function addLights() {
    let light = new THREE.AmbientLight(0x404040);
    scene.add(light);
    
    scene.background = new THREE.Color(0xffffff);
    
    // pointLight to illuminate snowflakes.
    // this is critical to making the scene look really nice.
    // Not sure whether positioning the light toward the sunlight in the HDR or at the origin looks better.
    // Positioning toward the sunlight is more realistic but makes the snowflakes look darker.
    // Positioning toward the origin might still be realistic because of the way ice refracts light.
    let pointLight = new THREE.PointLight(0xffffff, 5);
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
//        'Snowy_Forest_Path/snowy_forest_path_02_4k.hdr',
        'Snowy_Forest_Path/snowy_forest_path_02_2k.hdr',
//        'Snowy_Forest_Path/snowy_forest_path_02_1k.hdr',
//        'Snowy_Forest_Path/white.png',
        'Snowy_Forest_Path/snowy_forest_path_02_e.jpg'
    ]
};



function addBg(callback) {
    let bg = envs['snowyForestPath'];
    
    //console.log(RGBELoader);
    new RGBELoader().setDataType(THREE.UnsignedByteType).load(
        './resources/environments/' + bg[0], 
        (hdrEquiRect, textureData) => {
            hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquiRect);
            pmremGenerator.compileCubemapShader();
            scene.background = hdrCubeRenderTarget.texture;
            //scene.background = new THREE.Color(0x000000);
            //hdrCubeRenderTarget.mapping = THREE.CubeRefractionMapping;
            renderer.toneMappingExposure = 0.4;
            
            //document.querySelector('.loading-overlay-container').style.display = 'none';
            
            callback();
        },
        progressEvent => {
            let prog = Math.round(progressEvent.lengthComputable? 100 * progressEvent.loaded / progressEvent.total : 0);
            document.querySelector('.load-progress').style.width = prog + '%';
        }
    );
    
    // add an environment map sphere that is of higher resolution than that in the RGBELoader.
    if (sphereEnvMap) {
        let geometry = new THREE.SphereBufferGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        let texture = new THREE.TextureLoader().load('./resources/environments/' + bg[1]);
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