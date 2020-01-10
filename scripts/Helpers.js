import {THREE, scene} from './threeHandler.js';

function addAxisHelper() {
    let axesHelper = new THREE.AxesHelper( 50 );
    scene.add( axesHelper );    
}

function addBoxHelper() {
    let size = 20;
    let geometry = new THREE.BoxGeometry(size, size, size);
    let wireframe = new THREE.WireframeGeometry(geometry);
    
    let line = new THREE.LineSegments(wireframe);
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
    let size = 50;
    let geometry = new THREE.SphereGeometry(size, size, size);
    let material = new THREE.MeshNormalMaterial();
    
    let mesh = new THREE.Mesh(geometry, material);
    console.log(mesh);
    scene.add(mesh);
}

export {addHelpers, addDebugSphere}