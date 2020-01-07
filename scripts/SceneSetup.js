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

function addBg(callback) {
    //console.log(RGBELoader);
    new RGBELoader().setDataType(THREE.UnsignedByteType).load('../resources/environments/Winter_Forest/WinterForest_Env.hdr', (hdrEquiRect, textureData) => {
        textureData.exposure = 100;
        hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquiRect);
        pmremGenerator.compileCubemapShader();
        scene.background = hdrCubeRenderTarget.texture;
        hdrCubeRenderTarget.mapping = THREE.CubeRefractionMapping;
        callback();
    });
    
    // add an environment map sphere that is of higher resolution than that in the RGBELoader.
    let geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    
    let texture = new THREE.TextureLoader().load('../resources/environments/Winter_Forest/WinterForest_8k.jpg');
    let material = new THREE.MeshBasicMaterial({map: texture});
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
/*    new RGBELoader().load('../resources/envifronments/Winter_Forest/WinterForest_Ref.hdr', (texture, textureData) => {
        texture.encoding = THREE.RGBEEncoding;
        const cubeMap = new THREE.EquirectangularToCubeGenerator(texture, {resolution: 3200, type: THREE.UnsignedByteType});
        bg = cubeMap.renderTarget;
        cubeMapTexture = cubemap.update(renderer);
        texture.dispose();
    
        callback();
    });*/
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