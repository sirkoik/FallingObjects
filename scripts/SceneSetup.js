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
import {scene, renderer, pmremGenerator} from './threeHandler.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {setProgress} from './domElements.js';

export {hdrCubeRenderTarget};

// display non-HDR sphere environment map.
let sphereEnvMap = 0;

let hdrCubeRenderTarget = {};

function addGround() {
    //loadObj('../resources/models/hills.obj');
}

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
    let prevProg = 0;
    new RGBELoader().load(
        './resources/environments/' + bg[0], 
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
            let prog = Math.round(progressEvent.lengthComputable? 100 * progressEvent.loaded / progressEvent.total : 0);
            
            setProgress(prog-prevProg);
            prevProg = prog;
            //document.querySelector('.load-progress').style.width = prog + '%';
        }
    );
    
    // add an environment map sphere that is of higher resolution than that in the RGBELoader.
    if (sphereEnvMap) {
        let geometry = new SphereBufferGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        let texture = new TextureLoader().load('./resources/environments/' + bg[1]);
        let material = new MeshBasicMaterial({map: texture});
        let mesh = new Mesh(geometry, material);
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