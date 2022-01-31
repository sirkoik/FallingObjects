import {
    AxesHelper,
    LineSegments,
    BoxGeometry,
    WireframeGeometry,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three';
import {scene} from './threeHandler.js';
import {hdrCubeRenderTarget} from './SceneSetup.js';

function addAxisHelper() {
    let axesHelper = new AxesHelper( 50 );
    scene.add( axesHelper );
    
    let axesHelper2 = new AxesHelper( 10 );
    axesHelper2.position.set(10, 5, 10);
    scene.add( axesHelper2 );    
}

function addBoxHelper() {
    let size = 20;
    let geometry = new BoxGeometry(size, size, size);
    let wireframe = new WireframeGeometry(geometry);
    
    let line = new LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    
    scene.add(line);
}

function addHelpers() {
    addAxisHelper();
    addBoxHelper();
}

function addDebugSphere() {
    let size = 20;
    let geometry = new SphereGeometry(size, size, size);
    let material = new MeshBasicMaterial({color: 0xffffff});
    
//    let material = new THREE.MeshStandardMaterial({
//        envMap: hdrCubeRenderTarget.texture,
//        metalness: 0.5,
//        roughness: 0.5,
//        transparent: true, // important for fading in / out
//        opacity: 1 // start out invisible, then fade in.
//    });
    
    let mesh = new Mesh(geometry, material);
    console.log(mesh);
    scene.add(mesh);
}

export {addHelpers, addDebugSphere}